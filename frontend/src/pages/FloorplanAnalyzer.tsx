import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// @ts-ignore - api.js doesn't have type definitions
import { floorPlanAPI } from "../services/api";

interface AnalysisResult {
  statistics: {
    rooms: number;
    walls: number;
    corners: number;
  };
  blueprint3d: unknown;
  status?: string;
  message?: string;
}

type ServiceStatus = "checking" | "available" | "unavailable" | "error";

export function FloorplanAnalyzer() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<AnalysisResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [serviceStatus, setServiceStatus] = React.useState<ServiceStatus>("checking");
  const [showBlueprint, setShowBlueprint] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    checkServiceHealth();
  }, [isAuthenticated, navigate]);

  const checkServiceHealth = async () => {
    try {
      const isHealthy = await floorPlanAPI.checkHealth();
      setServiceStatus(isHealthy ? "available" : "unavailable");
    } catch (error) {
      setServiceStatus("error");
    }
  };

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Пожалуйста, выберите изображение (JPG или PNG)");
      return;
    }

    if (f.size > 10 * 1024 * 1024) {
      setError("Файл слишком большой. Максимальный размер: 10MB");
      return;
    }

    setError(null);
    setResult(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const analyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("authToken");
      const headers: Record<string, string> = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await fetch(`${API_BASE_URL}/api/floorplan/analyze`, {
        method: "POST",
        headers,
        body: formData,
        credentials: "include",
      });

      // Проверяем Content-Type ответа
      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        // Если не JSON - читаем как текст
        const text = await response.text();
        throw new Error("Сервер вернул не JSON: " + text);
      }

      const data = await response.json();

      if (!response.ok || data.status === "error") {
        throw new Error(data.message || "Ошибка при анализе");
      }

      setResult(data as AnalysisResult);
    } catch (e) {
      console.error("Полная ошибка:", e);
      const errorMessage = e instanceof Error ? e.message : "Ошибка при анализе";
      setError("Ошибка: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setShowBlueprint(false);
  };

  const getServiceStatusBadge = () => {
    switch (serviceStatus) {
      case "available":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-400/30">
            ✓ Доступен
          </span>
        );
      case "unavailable":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-400/30">
            ✗ Недоступен
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-400/30">
            ✗ Ошибка подключения
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-gray-300 border border-white/20">
            Проверка...
          </span>
        );
    }
  };

  return (
    <section className="relative bg-[#0B0F19] text-white overflow-hidden min-h-screen">
      {/* Top green blurred shapes */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transform-gpu overflow-hidden blur-3xl pointer-events-none"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="absolute left-1/2 top-0 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/4 rotate-[30deg] bg-gradient-to-tr from-[#86efac] to-[#4ade80] opacity-30"
        ></div>
      </div>

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-6 px-4 py-1 rounded-full bg-[rgba(0,255,100,0.1)] text-green-400 text-sm font-medium">
              Анализ планировок БТИ
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Анализ планировки БТИ
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
              Загрузите изображение планировки БТИ для автоматического анализа и преобразования в формат Blueprint3D
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Статус сервиса */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h6 className="font-semibold mb-4 text-white">Статус сервиса анализа</h6>
                <div>{getServiceStatusBadge()}</div>
              </div>
            </div>

            {/* Анализ планировки */}
            <div className="lg:col-span-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
                <div className="bg-green-500/20 border-b border-white/20 p-6">
                  <h5 className="text-xl font-semibold text-white">Загрузка и анализ</h5>
                </div>
                <div className="p-6">
                {/* Область загрузки */}
                {!preview && (
                  <div
                    id="uploadArea"
                    className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                      isDragging
                        ? "bg-green-500/20 border-green-400"
                        : "bg-white/5 border-green-500/50 hover:bg-white/10 hover:border-green-400"
                    }`}
                    onClick={() => {
                      const fileInput = document.getElementById("fileInput") as HTMLInputElement;
                      if (fileInput) {
                        fileInput.click();
                      }
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files[0]) {
                          handleFile(files[0]);
                        }
                      }}
                    />

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      fill="currentColor"
                      className="bi bi-cloud-upload mx-auto mb-3 text-green-400"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"
                      />
                      <path
                        fillRule="evenodd"
                        d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"
                      />
                    </svg>
                    <h5 className="text-lg font-semibold mb-2 text-white">
                      Перетащите изображение сюда
                    </h5>
                    <p className="text-gray-300 mb-1">
                      или нажмите для выбора файла
                    </p>
                    <p className="text-gray-400 text-sm">
                      Поддерживаются: JPG, PNG (макс. 10MB)
                    </p>
                  </div>
                )}

                {/* Превью изображения */}
                {preview && (
                  <div id="previewContainer">
                    <img
                      id="preview"
                      src={preview}
                      alt="Preview"
                      className="max-w-full max-h-96 mx-auto mt-5 rounded-lg shadow-lg"
                    />
                    <div className="text-center mt-4">
                      <button
                        id="analyzeBtn"
                        onClick={analyze}
                        disabled={loading}
                        className="rounded-md bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-gear-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                        </svg>
                        Анализировать планировку
                      </button>
                      <button
                        id="clearBtn"
                        onClick={clear}
                        className="rounded-md bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition border border-white/20 ml-2"
                      >
                        Очистить
                      </button>
                    </div>
                  </div>
                )}

                {/* Результаты анализа */}
                {result && (
                  <div
                    id="results"
                    className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    <hr className="my-4 border-white/20" />
                    <h5 className="text-xl font-semibold mb-4 text-white">
                      Результаты анализа
                    </h5>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center border border-white/20">
                        <h3 className="text-3xl font-bold text-green-400 mb-1">
                          {result.statistics?.rooms || 0}
                        </h3>
                        <p className="text-gray-300 m-0">Комнат</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center border border-white/20">
                        <h3 className="text-3xl font-bold text-green-400 mb-1">
                          {result.statistics?.walls || 0}
                        </h3>
                        <p className="text-gray-300 m-0">Стен</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center border border-white/20">
                        <h3 className="text-3xl font-bold text-green-400 mb-1">
                          {result.statistics?.corners || 0}
                        </h3>
                        <p className="text-gray-300 m-0">Углов</p>
                      </div>
                    </div>

                    <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 mt-4">
                      <strong className="text-green-400">
                        ✓ Анализ завершен успешно!
                      </strong>
                      <p className="text-gray-300 mb-0 mt-2">
                        Blueprint3D данные готовы для использования.
                      </p>
                    </div>

                    {/* Blueprint3D данные */}
                    <div className="mt-4">
                      <button
                        className="rounded-md bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition border border-white/20"
                        onClick={() => setShowBlueprint(!showBlueprint)}
                      >
                        {showBlueprint
                          ? "Скрыть Blueprint3D JSON"
                          : "Показать Blueprint3D JSON"}
                      </button>
                      {showBlueprint && (
                        <pre
                          id="blueprintJson"
                          className="mt-3 bg-[#0B0F19] p-4 rounded-lg max-h-96 overflow-auto text-sm border border-white/20 text-gray-300"
                        >
                          {JSON.stringify(result.blueprint3d, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                )}

                {/* Ошибка */}
                {error && (
                  <div
                    id="errorMessage"
                    className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-3 rounded-lg mt-4"
                  >
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Bottom green blurred shapes */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transform-gpu overflow-hidden blur-3xl pointer-events-none"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="absolute left-1/2 bottom-0 w-[300%] h-[300%] -translate-x-1/2 translate-y-1/4 rotate-[-30deg] bg-gradient-to-tr from-[#86efac] to-[#4ade80] opacity-30"
        ></div>
      </div>

      {/* Overlay загрузки */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400 mb-4"></div>
            <h4 className="text-xl font-semibold mb-2">
              Анализируем планировку...
            </h4>
            <p className="text-gray-300">Это может занять несколько секунд</p>
          </div>
        </div>
      )}
    </section>
  );
}

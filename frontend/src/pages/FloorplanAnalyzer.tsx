import React from "react";

export function FloorplanAnalyzer() {
  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);

  const handleFile = (f) => {
    setError(null);
    setResult(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const analyze = async () => {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/floorplan/analyze", {
        method: "POST",
        body: form,
        credentials: "include",
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(String(e.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Анализ планировки БТИ</h2>

        <div
          className="border-2 border-dashed rounded-xl p-10 text-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => document.getElementById("fileInputReact").click()}
        >
          <input
            id="fileInputReact"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />

          {!preview && (
            <div>
              <p className="text-gray-600 text-lg">
                Перетащите изображение или нажмите для выбора
              </p>
              <p className="text-gray-400 text-sm">Поддержка JPG/PNG до 10MB</p>
            </div>
          )}
        </div>

        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="preview"
              className="max-h-96 rounded-xl shadow"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={analyze}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Анализировать
              </button>
              <button
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  setResult(null);
                  setError(null);
                }}
                className="bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Очистить
              </button>
            </div>
          </div>
        )}

        {loading && (
          <p className="text-center text-blue-600 mt-4 text-lg font-semibold">
            Анализ...
          </p>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Результаты анализа</h3>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white rounded shadow">
                <p className="text-3xl text-blue-600 font-bold">
                  {result.statistics.rooms}
                </p>
                <p className="text-gray-600">Комнат</p>
              </div>
              <div className="p-3 bg-white rounded shadow">
                <p className="text-3xl text-blue-600 font-bold">
                  {result.statistics.walls}
                </p>
                <p className="text-gray-600">Стен</p>
              </div>
              <div className="p-3 bg-white rounded shadow">
                <p className="text-3xl text-blue-600 font-bold">
                  {result.statistics.corners}
                </p>
                <p className="text-gray-600">Углов</p>
              </div>
            </div>

            <details className="mt-4 bg-white p-4 rounded shadow">
              <summary className="cursor-pointer text-blue-600">
                Blueprint3D JSON
              </summary>
              <pre className="mt-2 text-sm bg-gray-100 p-3 rounded max-h-96 overflow-auto">
                {JSON.stringify(result.blueprint3d, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

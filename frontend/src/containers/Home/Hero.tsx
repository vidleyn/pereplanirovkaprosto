import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Hero() {
  const { user } = useAuth();

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

      <div className="container mx-auto px-6 py-32 flex lg:items-center lg:justify-between flex-col lg:flex-row relative gap-10 z-10">
        <div className="xl:min-w-2xl">
          <div className="inline-block mb-6 px-4 py-1 rounded-full bg-[rgba(0,255,100,0.1)] text-green-400 text-sm font-medium">
            Ваш надёжный спутник в ремонте
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">Ремонт от идеи до&#160;финала</h1>
          <p className="text-gray-300 text-lg mb-10 max-w-lg">
            Сопровождаем вас на всех этапах: от планировки и согласований до выбора мебели, поиска мастеров и покупки у производителей. Помогаем с бюрократией и документами.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link
              to="/planner"
              className="rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-green-400 transition"
            >
              Перейти в планировщик
            </Link>
            <Link
              to="/floorplan-analyzer"
              className="rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-green-400 transition"
            >
              Анализ планировки БТИ
            </Link>
            <Link
              to="/documentation"
              className="text-gray-300 hover:text-white text-sm flex items-center transition"
            >
              Подробнее →
            </Link>
          </div>
        </div>

        <img
          src="/images/green_planing.jpg"
          alt="Современный интерьер с зеленым растением в горшке"
          className="rounded-xl shadow-2xl opacity-90 max-w-2xl w-full h-auto"
        />
      </div>

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
    </section>
  );
}

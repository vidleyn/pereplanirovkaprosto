export default function Hero() {
  return (
    <section className="relative bg-[#0B0F19] text-white overflow-hidden">
      {/* Top green blurred shapes */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40  transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#86efac] to-[#4ade80] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
        ></div>
      </div>

      <div className="container mx-auto px-6 py-32 flex lg:items-center lg:justify-between flex-col lg:flex-row relative gap-10 z-10">
        <div className="xl:min-w-2xl">
          <div className="inline-block mb-6 px-4 py-1 rounded-full bg-[rgba(0,255,100,0.1)] text-green-400 text-sm font-medium">
            Новое · v1.0
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">Перепланировка без&#160;проблем</h1>
          <p className="text-gray-300 text-lg mb-10 max-w-md">
            Помогаем разобраться с планировкой без лишней бюрократии.
          </p>
          <div className="flex space-x-4">
            <a
              href="/planner"
              className="rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-green-400"
            >
              Перейти в планировщик
            </a>
            <a href="#more" className="text-gray-300 hover:text-white text-sm flex items-center">
              Подробнее →
            </a>
          </div>
        </div>

        <img
          src="/images/photo_2025-11-24_07-10-31.jpg"
          alt="Dashboard preview"
          className="rounded-xl shadow-2xl opacity-90"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] pointer-events-none"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-[#86efac] to-[#4ade80] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72rem]"
        ></div>
      </div>
    </section>
  );
}

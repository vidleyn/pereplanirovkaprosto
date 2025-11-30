import { useState, useEffect } from "react";
import { shopAPI } from "../services/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("все");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchQuery]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await shopAPI.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки товаров");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Фильтр по категории
    if (selectedCategory !== "все") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Фильтр по поисковому запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const categories = ["все", "мебель", "посуда", "текстиль", "освещение", "декор", "техника", "сантехника", "стройматериалы"];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);
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
              Магазин товаров
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Магазин РемонтПроводник
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
              Мебель, посуда и товары для дома от производителей
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-green-500 text-white"
                      : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
              <p className="mt-4 text-gray-300">Загрузка товаров...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <>
              <div className="mb-6 text-center">
                <p className="text-gray-400">
                  Найдено товаров: {filteredProducts.length}
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-lg">
                    Товары не найдены
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => {
                    const ProductCard = () => {
                      const [imageError, setImageError] = useState(false);
                      
                      return (
                        <div
                          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-green-400/50 transition-all hover:shadow-xl hover:shadow-green-500/10 group flex flex-col"
                        >
                          {/* Product Image */}
                          <div className="relative h-48 bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {product.image_url && !imageError ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                loading="lazy"
                                style={{ minHeight: '192px', maxHeight: '192px' }}
                                onError={() => setImageError(true)}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                        {product.stock === 0 && (
                          <div className="absolute top-2 right-2 bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Нет в наличии
                          </div>
                        )}
                        {product.stock > 0 && product.stock < 5 && (
                          <div className="absolute top-2 right-2 bg-yellow-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Осталось {product.stock}
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2 min-h-[3.5rem]">
                          {product.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-2xl font-bold text-green-400">
                            {formatPrice(product.price)}
                          </span>
                          <button
                            disabled={product.stock === 0}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex-shrink-0 ${
                              product.stock === 0
                                ? "bg-gray-500/50 text-gray-400 cursor-not-allowed"
                                : "bg-green-500 text-white hover:bg-green-400"
                            }`}
                          >
                            {product.stock === 0 ? "Нет в наличии" : "В корзину"}
                          </button>
                        </div>
                      </div>
                    </div>
                    );
                  };
                  
                  return <ProductCard key={product.id} />;
                  })}
                </div>
              )}
            </>
          )}
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
    </section>
  );
}


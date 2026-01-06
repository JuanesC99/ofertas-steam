'use client';

import { useState, useEffect } from 'react';

async function fetchDeals() {
  try {
    const res = await fetch(
      'https://www.cheapshark.com/api/1.0/deals?storeID=1,7,11,15,23,25&upperPrice=30&metacritic=70&pageSize=40'
    );
    if (!res.ok) throw new Error('Error fetching deals');
    return await res.json();
  } catch (error) {
    console.error('Error directo:', error);
    try {
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const apiUrl = encodeURIComponent(
        'https://www.cheapshark.com/api/1.0/deals?storeID=1,7,11,15,23,25&upperPrice=30&metacritic=70&pageSize=40'
      );
      const res = await fetch(proxyUrl + apiUrl);
      if (!res.ok) throw new Error('Error con proxy');
      return await res.json();
    } catch (err) {
      console.error('Error con proxy:', err);
      return [];
    }
  }
}

function getStoreName(storeID) {
  const stores = {
    '1': '🟢 Steam',
    '7': '🟡 GOG',
    '11': '🟠 Humble Store',
    '15': '🟣 Fanatical',
    '23': '🔵 GameBillet',
    '25': '⚡ Epic Games',
  };
  return stores[storeID] || 'Otra tienda';
}

function formatPrice(price, rate, country) {
  const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  if (country === 'CO') {
    const cop = Math.round(price * rate);
    const local = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cop);
    return { local, usd };
  }
  return { local: usd, usd };
}

function DealCard({ deal, rate, countryCode }) {
  const prices = formatPrice(parseFloat(deal.salePrice), rate, countryCode);
  const normalPrices = formatPrice(parseFloat(deal.normalPrice), rate, countryCode);
  const savings = Math.round((1 - parseFloat(deal.salePrice) / parseFloat(deal.normalPrice)) * 100);

  return (
    <div className="group relative bg-gradient-to-br from-gray-900 via-purple-900 to-black rounded-3xl overflow-hidden shadow-2xl hover:shadow-cyan-500/50 hover:-translate-y-2 transition-all duration-500 border-4 border-purple-800 hover:border-cyan-500 p-6">
      <div className="relative h-64 overflow-hidden rounded-2xl mb-6">
        <img
          src={deal.thumb}
          alt={deal.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        <div className="absolute top-4 right-4 bg-gradient-to-br from-red-600 to-orange-600 px-4 py-2 rounded-2xl text-2xl font-black shadow-xl animate-pulse">
          -{savings}%
        </div>
      </div>

      <div className="p-4 text-center">
        <h3 className="text-xl font-bold mb-3 text-cyan-300 group-hover:text-cyan-100 transition-colors line-clamp-2">{deal.title}</h3>
        <p className="text-lg mb-4 text-emerald-400 font-semibold">{getStoreName(deal.storeID)}</p>

        <div className="mb-6">
          <p className="line-through text-gray-400 text-lg mb-2">{normalPrices.local}</p>
          <p className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {prices.local}
          </p>
          <p className="text-sm text-gray-400 mt-2">({prices.usd} USD)</p>
        </div>

        <a
          href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block py-3 bg-gradient-to-r from-cyan-600 via-emerald-600 to-purple-600 rounded-2xl font-bold text-lg hover:from-cyan-500 hover:via-emerald-500 hover:to-purple-500 transition-all shadow-lg hover:scale-105"
        >
          ¡COMPRAR YA! 🛒✨
        </a>
      </div>
    </div>
  );
}

function DealSkeleton() {
  return (
    <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl p-6 animate-pulse">
      <div className="h-64 bg-gray-800 rounded-2xl mb-6"></div>
      <div className="h-6 bg-gray-800 rounded mb-3 w-3/4 mx-auto"></div>
      <div className="h-4 bg-gray-800 rounded mb-4 w-1/2 mx-auto"></div>
      <div className="h-8 bg-gray-800 rounded mb-3 w-2/3 mx-auto"></div>
      <div className="h-12 bg-gray-800 rounded"></div>
    </div>
  );
}

function Navbar() {
  const navLinks = [
    { name: 'Steam', url: 'https://store.steampowered.com/specials', color: 'text-cyan-400 hover:text-cyan-300' },
    { name: 'Epic', url: 'https://store.epicgames.com/es-ES/free-games', color: 'text-emerald-400 hover:text-emerald-300' },
    { name: 'Nintendo', url: 'https://www.nintendo.com/es-co/store/offers/', color: 'text-red-400 hover:text-red-300' },
    { name: 'PlayStation', url: 'https://store.playstation.com/es-co/pages/deals', color: 'text-blue-400 hover:text-blue-300' },
    { name: 'Xbox', url: 'https://www.xbox.com/es-CO/games/all-games?cat=onsale', color: 'text-green-400 hover:text-green-300' },
  ];

  return (
    <nav className="bg-black py-4 shadow-2xl border-b-4 border-purple-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-6">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-lg font-bold ${link.color} transition`}
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
}

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  return (
    <div className="max-w-3xl mx-auto mb-12">
      <input
        type="text"
        placeholder="Busca un juego... (ej: GTA, Cyberpunk)"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        className="w-full py-4 px-6 bg-gray-900 text-white text-xl rounded-2xl border-4 border-cyan-600 focus:border-cyan-400 outline-none shadow-lg"
      />
    </div>
  );
}

function ConsoleSection({ title, emoji, links, gradient }) {
  return (
    <div className={`py-12 ${gradient}`}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-black mb-8 text-center text-white">
          {emoji} {title} {emoji}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-black/50 backdrop-blur rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300 border-4 border-white/20 hover:border-white/50"
            >
              <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">
                {link.icon}
              </div>
              <h3 className="text-2xl font-black mb-3 text-center text-white">{link.title}</h3>
              <p className="text-gray-300 text-center mb-4">{link.description}</p>
              <div className="text-center">
                <span className="inline-block bg-white text-black px-6 py-3 rounded-2xl font-bold group-hover:bg-yellow-400 transition-colors">
                  Ver Ofertas →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rate = 3790;
  const countryCode = 'CO';

  useEffect(() => {
    let mounted = true;
    fetchDeals()
      .then((data) => {
        if (mounted) {
          if (data.length === 0) {
            setError('No se pudieron cargar las ofertas. Intenta recargar la página.');
          }
          setDeals(data);
          setFilteredDeals(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError('Error al cargar ofertas. Intenta recargar la página.');
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  const handleSearch = (query) => {
    const filtered = deals.filter((deal) =>
      deal.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDeals(filtered);
  };

  const playstationLinks = [
    {
      title: 'Ofertas PS Plus',
      description: 'Descuentos exclusivos para miembros PS Plus',
      icon: '🎮',
      url: 'https://store.playstation.com/es-co/pages/deals'
    },
    {
      title: 'Ofertas PS5',
      description: 'Los mejores juegos de PS5 en oferta',
      icon: '🎯',
      url: 'https://store.playstation.com/es-co/pages/deals'
    },
    {
      title: 'Ofertas PS4',
      description: 'Grandes juegos de PS4 a precios increíbles',
      icon: '🏆',
      url: 'https://www.playstation.com/es-co/ps4/ps4-games/'
    }
  ];

  const xboxLinks = [
    {
      title: 'Ofertas Xbox',
      description: 'Juegos en descuento para Xbox Series X|S y Xbox One',
      icon: '💚',
      url: 'https://www.xbox.com/es-CO/games/all-games?cat=onsale'
    },
    {
      title: 'Game Pass',
      description: 'Catálogo completo de Xbox Game Pass',
      icon: '🎮',
      url: 'https://www.xbox.com/es-CO/xbox-game-pass/games'
    },
    {
      title: 'Ofertas Gold',
      description: 'Descuentos exclusivos para miembros Gold',
      icon: '⭐',
      url: 'https://www.xbox.com/es-CO/live/gold'
    }
  ];

  const nintendoLinks = [
    {
      title: 'Ofertas Switch',
      description: 'Los mejores juegos de Nintendo Switch en oferta',
      icon: '🔴',
      url: 'https://www.nintendo.com/es-co/store/sales-and-deals/'
    },
    {
      title: 'Juegos Indies',
      description: 'Descubre joyas indies a precios bajos',
      icon: '💎',
      url: 'https://www.nintendo.com/es-co/search/#q=Indie&p=1&cat=gme&sort=df'
    },
    {
      title: 'Clásicos Nintendo',
      description: 'Juegos clásicos y exclusivos de Nintendo',
      icon: '🌟',
      url: 'https://www.nintendo.com/es-co/store/sales-and-deals/'
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-cyan-950 text-white">
      <Navbar />

      <header className="py-12 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-600 bg-clip-text text-transparent mb-4">
          🎮 OFERTAS GAMER COLOMBIA 🎮
        </h1>
        <p className="text-xl md:text-2xl text-gray-300">
          Precios en Col$ (1 USD ≈ {rate.toLocaleString('es-CO')} COP)
        </p>
      </header>

      {/* Epic Games Gratis */}
      <section className="py-16 bg-gradient-to-r from-emerald-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            🎁 JUEGOS GRATIS EN EPIC (HASTA 8 ENE) 🎁
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-black rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl md:text-3xl font-black mb-6">Total War: THREE KINGDOMS</h3>
              <a 
                href="https://store.epicgames.com/es-ES/p/total-war-three-kingdoms-d3bb7a" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-emerald-600 to-cyan-600 px-8 py-4 rounded-2xl font-black text-xl hover:from-emerald-500 hover:to-cyan-500 transition-all shadow-xl hover:scale-105"
              >
                ¡RECLAMAR GRATIS!
              </a>
            </div>
            <div className="bg-black rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl md:text-3xl font-black mb-6">Wildgate</h3>
              <a 
                href="https://store.epicgames.com/es-ES/p/wildgate-standard-edition-b886b5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-2xl font-black text-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl hover:scale-105"
              >
                ¡RECLAMAR GRATIS!
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PC Deals */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-6xl font-black mb-8 text-center bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
          🔥 MEJORES OFERTAS PC 🔥
        </h2>

        <SearchBar onSearch={handleSearch} />

        {error && (
          <div className="bg-red-900 border-4 border-red-600 rounded-2xl p-8 mb-8 text-center">
            <p className="text-xl md:text-2xl font-bold">⚠️ {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-bold transition"
            >
              🔄 Recargar página
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <DealSkeleton key={i} />
            ))}
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl md:text-3xl font-bold text-gray-400">😕 No se encontraron juegos con ese nombre</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.dealID} deal={deal} rate={rate} countryCode={countryCode} />
            ))}
          </div>
        )}
      </section>

      {/* PlayStation Section */}
      <ConsoleSection
        title="OFERTAS PLAYSTATION"
        emoji="🔵"
        links={playstationLinks}
        gradient="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900"
      />

      {/* Xbox Section */}
      <ConsoleSection
        title="OFERTAS XBOX"
        emoji="💚"
        links={xboxLinks}
        gradient="bg-gradient-to-r from-green-900 via-emerald-900 to-green-900"
      />

      {/* Nintendo Section */}
      <ConsoleSection
        title="OFERTAS NINTENDO"
        emoji="🔴"
        links={nintendoLinks}
        gradient="bg-gradient-to-r from-red-900 via-pink-900 to-red-900"
      />

      {/* Tips Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-indigo-900">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-black mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            💡 Consejos para Gamers en Colombia
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/50 backdrop-blur rounded-2xl p-6 border-2 border-cyan-500/30">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">💻 Para PC:</h3>
              <ul className="space-y-2 text-gray-200">
                <li>✅ Steam CO tiene precios ~30-50% más bajos</li>
                <li>✅ Epic Games regala juegos cada jueves</li>
                <li>✅ GOG tiene juegos DRM-free</li>
              </ul>
            </div>
            <div className="bg-black/50 backdrop-blur rounded-2xl p-6 border-2 border-blue-500/30">
              <h3 className="text-2xl font-bold mb-4 text-blue-400">🎮 Para Consolas:</h3>
              <ul className="space-y-2 text-gray-200">
                <li>✅ PS Plus/Game Pass tienen ofertas exclusivas</li>
                <li>✅ Nintendo eShop tiene sales cada temporada</li>
                <li>✅ Compara precios físicos vs digitales</li>
              </ul>
            </div>
            <div className="bg-black/50 backdrop-blur rounded-2xl p-6 border-2 border-green-500/30">
              <h3 className="text-2xl font-bold mb-4 text-green-400">💳 Pagos:</h3>
              <ul className="space-y-2 text-gray-200">
                <li>✅ Usa PSE, Nequi o tarjetas locales</li>
                <li>✅ Evita VPN para compras (puede causar ban)</li>
                <li>✅ Verifica comisiones bancarias</li>
              </ul>
            </div>
            <div className="bg-black/50 backdrop-blur rounded-2xl p-6 border-2 border-purple-500/30">
              <h3 className="text-2xl font-bold mb-4 text-purple-400">⏰ Mejores Fechas:</h3>
              <ul className="space-y-2 text-gray-200">
                <li>✅ Winter/Summer Sales (Steam)</li>
                <li>✅ Black Friday (todas las tiendas)</li>
                <li>✅ Aniversarios de juegos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black py-8 text-center border-t-4 border-cyan-600">
        <p className="text-lg md:text-xl mb-2">© 2026 Ofertas Gamer Colombia</p>
        <p className="text-gray-400">Encontrando las mejores ofertas para gamers colombianos 🇨🇴</p>
      </footer>
    </main>
  );
}
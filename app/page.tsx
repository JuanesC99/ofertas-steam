'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

async function fetchDeals() {
  try {
    // Usando allorigins.win como proxy CORS
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const apiUrl = encodeURIComponent(
      'https://www.cheapshark.com/api/1.0/deals?storeID=1,7,11,23,25&upperPrice=30&metacritic=70&pageSize=40'
    );
    
    const res = await fetch(proxyUrl + apiUrl);
    if (!res.ok) throw new Error('Error fetching deals');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching deals:', error);
    // Si falla el proxy, intentamos directo (puede funcionar en algunos casos)
    try {
      const res = await fetch(
        'https://www.cheapshark.com/api/1.0/deals?storeID=1,7,11,23,25&upperPrice=30&metacritic=70&pageSize=40'
      );
      if (!res.ok) throw new Error('Error fetching deals');
      return res.json();
    } catch (err) {
      console.error('Fallback también falló:', err);
      return [];
    }
  }
}

function getStoreName(storeID) {
  const stores = {
    '1': '🟢 Steam',
    '7': '🔵 Epic Games',
    '11': '🟡 GOG',
    '23': '🟠 Humble Bundle',
    '25': '🟣 Fanatical',
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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="group relative bg-gradient-to-br from-gray-900 via-purple-900 to-black rounded-3xl overflow-hidden shadow-2xl hover:shadow-cyan-500 hover:-translate-y-3 hover:rotate-1 transition-all duration-500 border-4 border-purple-800 hover:border-cyan-500 p-6"
    >
      <div className="relative h-64 overflow-hidden rounded-2xl mb-6">
        <img
          src={deal.thumb}
          alt={deal.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-100 group-hover:brightness-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        <motion.div
          className="absolute top-4 right-4 bg-gradient-to-br from-red-700 to-orange-700 px-4 py-2 rounded-2xl text-3xl font-black shadow-xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          -{savings}%
        </motion.div>
      </div>

      <div className="p-4 text-center">
        <h3 className="text-2xl font-black mb-3 truncate text-cyan-300 group-hover:text-cyan-100 transition-all">{deal.title}</h3>
        <p className="text-xl mb-4 text-emerald-400 font-bold">{getStoreName(deal.storeID)}</p>

        <div className="mb-6">
          <p className="line-through text-gray-300 text-xl mb-2">{normalPrices.local}</p>
          <motion.p
            className="text-5xl font-black bg-gradient-to-r from-emerald-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {prices.local}
          </motion.p>
          <p className="text-lg text-gray-300 mt-2">({prices.usd} USD)</p>
        </div>

        <a
          href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block py-4 bg-gradient-to-r from-cyan-700 via-emerald-700 to-purple-700 rounded-2xl font-black text-2xl hover:from-cyan-600 hover:via-emerald-600 hover:to-purple-600 transition-all shadow-xl hover:scale-105"
        >
          ¡COMPRAR YA! 🛒✨
        </a>
      </div>
    </motion.div>
  );
}

function DealSkeleton() {
  return (
    <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl p-6 animate-pulse">
      <div className="h-64 bg-gray-800 rounded-2xl mb-6"></div>
      <div className="h-6 bg-gray-800 rounded mb-3"></div>
      <div className="h-4 bg-gray-800 rounded mb-4"></div>
      <div className="h-8 bg-gray-800 rounded mb-3"></div>
      <div className="h-12 bg-gray-800 rounded"></div>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="bg-black py-4 shadow-2xl border-b-4 border-purple-600">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-6">
        <a href="https://store.steampowered.com/specials" target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-cyan-400 hover:text-cyan-300 transition">Steam</a>
        <a href="https://store.epicgames.com/es-ES/free-games" target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-emerald-400 hover:text-emerald-300 transition">Epic</a>
        <a href="https://www.nintendo.com/es-co/store/offers/" target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-red-400 hover:text-red-300 transition">Nintendo</a>
        <a href="https://store.playstation.com/es-co/pages/deals" target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-blue-400 hover:text-blue-300 transition">PlayStation</a>
        <a href="https://www.xbox.com/es-CO/games/all-games?cat=onsale" target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-green-400 hover:text-green-300 transition">Xbox</a>
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
        placeholder="Busca un juego... (ej: GTA, Fortnite)"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        className="w-full py-4 px-6 bg-gray-900 text-white text-xl rounded-2xl border-4 border-cyan-600 focus:border-cyan-400 outline-none"
      />
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-cyan-950 text-white">
      <Navbar />

      <header className="py-12 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-600 bg-clip-text text-transparent">
          🎮 OFERTAS GAMER COLOMBIA 🎮
        </h1>
        <p className="text-2xl mt-4">
          Precios en Col$ (1 USD ≈ {rate.toLocaleString('es-CO')} COP)
        </p>
      </header>

      <section className="py-16 bg-gradient-to-r from-emerald-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            🎁 JUEGOS GRATIS EN EPIC (HASTA 8 ENE) 🎁
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-black rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-500"
            >
              <h3 className="text-3xl font-black mb-6">Total War: THREE KINGDOMS</h3>
              <a 
                href="https://store.epicgames.com/es-ES/p/total-war-three-kingdoms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-emerald-600 to-cyan-600 px-8 py-4 rounded-2xl font-black text-2xl hover:from-emerald-500 hover:to-cyan-500 transition-all shadow-xl hover:scale-105"
              >
                ¡RECLAMAR GRATIS!
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-black rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-500"
            >
              <h3 className="text-3xl font-black mb-6">Wildgate</h3>
              <a 
                href="https://store.epicgames.com/es-ES/p/wildgate" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-2xl font-black text-2xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl hover:scale-105"
              >
                ¡RECLAMAR GRATIS!
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl md:text-6xl font-black mb-8 text-center bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
          🔥 MEJORES OFERTAS WINTER SALE 🔥
        </h2>

        <SearchBar onSearch={handleSearch} />

        {error && (
          <div className="bg-red-900 border-4 border-red-600 rounded-2xl p-8 mb-8 text-center">
            <p className="text-2xl font-bold">⚠️ {error}</p>
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
            <p className="text-3xl font-bold text-gray-400">😕 No se encontraron juegos con ese nombre</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.dealID} deal={deal} rate={rate} countryCode={countryCode} />
            ))}
          </div>
        )}
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            💡 Consejos para Gamers en Colombia
          </h2>
          <ul className="text-xl md:text-2xl space-y-4">
            <li>En Steam CO, precios regionales son ~30-50% más bajos en USD. ¡Usa cuenta local!</li>
            <li>Evita VPN para compras: puede banearte. Solo para ver deals.</li>
            <li>Revisa Epic cada jueves: juegos gratis nuevos.</li>
            <li>Para Nintendo/PS/Xbox: checa stores oficiales por deals LATAM.</li>
            <li>Usa tarjetas como PSE o Nequi para pagos fáciles.</li>
          </ul>
        </div>
      </section>

      <footer className="bg-black py-8 text-center border-t-4 border-cyan-600">
        <p className="text-xl">© 2026 Ofertas Gamer Colombia • ¡Disfruta las ofertas!</p>
      </footer>
    </main>
  );
}
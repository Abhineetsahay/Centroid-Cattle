import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Keep your custom CSS

// 🔄 Spinner with animation
const Spinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-400 rounded-full animate-spin"></div>
  </div>
);

function App() {
  const [language, setLanguage] = useState("en");  // Used for API calls
  const [allBreeds, setAllBreeds] = useState([]);
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🐄 Fetch data from API
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await axios.get('https://model-backend-nxni.onrender.com/get-breed', {
          headers: {
            'Accept-Language': language
          }
        });
        const data = response.data;

        if (data && Array.isArray(data.body)) {
          const transformedData = data.body.map(breed => ({
            id: breed._id,
            name: breed.breedName,
            locations: Array.isArray(breed.Location) ? breed.Location : [],
            count:breed.count,
            mainUses: breed.mainUses,
            physicalDesc: breed.physicalDesc,
            species: breed.species,
            breedingTrait: breed.breedingTrait,
          }));
          setAllBreeds(transformedData);
          setFilteredBreeds(transformedData);
          
        } else {
          throw new Error('Invalid data format from API.');
        }
      } catch (err) {
        setError('❌ Could not fetch cow breeds. Try again later.');
        console.error('API Fetch Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreeds();
  }, [language]);

  // 🔎 Search filter
  useEffect(() => {
    if (!Array.isArray(allBreeds)) return;
    const results = allBreeds.filter(breed => {
      const nameMatch = typeof breed.name === 'string' && breed.name.toLowerCase().includes(searchTerm.toLowerCase());
      const locationMatch = Array.isArray(breed.locations) && breed.locations.some(loc => typeof loc === 'string' && loc.toLowerCase().includes(searchTerm.toLowerCase()));
      return nameMatch || locationMatch;
    });
    setFilteredBreeds(results);
  }, [searchTerm, allBreeds]);

  // ✨ Render content
  const renderContent = () => {
    if (isLoading) return <Spinner />;
    if (error) return <p className="text-center text-red-400 text-lg bg-red-900/40 p-4 rounded-lg">{error}</p>;

    if (filteredBreeds.length > 0) {
      return (
        <>
          <div className="text-center text-lg font-semibold text-blue-700 mg z-[101] relative">
            Showing {filteredBreeds.length} entries
          </div>
          <div className="z-[100] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 py-10 border-none bg-yellow-50" style={{position: 'relative'}}>
            {filteredBreeds.map(breed => (
              <div
                key={breed.id}
                className="bg-white border-2 border-blue-200 rounded-xl p-6 text-gray-900 shadow-2xl flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-300 hover:border-blue-500"
                style={{minHeight: '220px'}}
              >
                <h3 className="text-lg font-bold mb-2 text-center text-blue-700">{breed.name}</h3>
                <div className="text-[16px] text-gray-700 mb-1 text-center">
                  <span className="font-semibold">Location:</span> {breed.locations.join(', ')}
                </div>
                <div className="text-[16px] text-gray-700 mb-1">
                  <span className="font-semibold">Main Uses:</span> {breed.mainUses}
                </div>
                 <div className="text-[16px] text-gray-700 mb-1">
                  <span className="font-semibold">Registered Cattles</span> {breed.count}
                </div>
                <div className="text-[16px] text-gray-700 mb-1">
                  <span className="font-semibold">Physical:</span> {breed.physicalDesc}
                </div>
                <div className="text-[16px] text-gray-700 mb-1">
                  <span className="font-semibold">Species:</span> {breed.species}
                </div>
                <div className="text-[16px] text-gray-700">
                  <span className="font-semibold">Trait:</span> {breed.breedingTrait}
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }

    return (
      <div className="border-4 border-red-500 bg-yellow-50 p-8 text-center text-xl text-gray-800 z-[100] relative">
        No breeds found 🐄 (DEBUG: Grid container is visible)
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="relative w-full min-h-screen overflow-hidden">
        {/* Background image with proper loading */}
        <div 
          className="absolute inset-0 bg-[url('/cow.gif')] bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 "></div>

        {/* 🌟 Header */}
        <header className="w-full backdrop-blur-sm p-4 sticky top-0 z-50 border-b border-gray-700/30">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <a 
              href="https://under-cooked-25.vercel.app/" 
              className="relative group hover:opacity-90 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-blue-500/20 filter blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img 
                src="/namelogo1.png" 
                alt="Cattle Labs Logo" 
                className="w-full max-w-xs h-auto aspect-[4/1] relative z-10 transform transition-transform duration-300 group-hover:scale-105 object-contain rounded-lg bg-white/10"
                style={{ aspectRatio: '4/1', objectFit: 'contain', width: '100%', maxWidth: '240px', height: 'auto', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/vite.svg';
                }}
              />
            </a>
            <nav className="hidden sm:flex space-x-6 text-sm text-gray-300">
              <a href="#" className="mg hover:text-white">Home</a>
              <a href="#" className="mg hover:text-white">About</a>
              <a href="#" className="mg hover:text-white">Contact</a>
            </nav>
          </div>
        </header>

        {/* 🌟 Main */}
        <main className="max-w-6xl mx-auto py-12 px-6 relative z-10">
          <h1 className="text-5xl font-extrabold text-center text-white mb-6 drop-shadow-lg animate-bounce">
            {language === 'en' ? "Centralised Breed Database 🐄" :
             language === 'hi' ? "केंद्रीयकृत नस्ल डेटाबेस 🐄" :
             "କେନ୍ଦ୍ରୀୟ ପ୍ରଜାତି ଡାଟାବେସ 🐄"}
          </h1>
          <p className="text-center text-gray-300 mb-10 max-w-2xl mx-auto">
            {language === 'en' ? "Discover cow breeds from across the world. Search by name or location below." :
             language === 'hi' ? "दुनिया भर की गाय की नस्लों की खोज करें। नाम या स्थान के आधार पर नीचे खोजें।" :
             "ବିଶ୍ୱର ଗାଈ ପ୍ରଜାତିଗୁଡ଼ିକ ଖୋଜନ୍ତୁ। ନାମ କିମ୍ବା ସ୍ଥାନ ଅନୁଯାୟୀ ତଳେ ଖୋଜନ୍ତୁ।"}
          </p>

          {/* 🔍 Search Bar */}
          <div className='flex flex-col w-full justify-center items-center'>
          <div className="mb-12 flex w-full justify-center">
            <div className="relative w-screen sm:w-2/3 md:w-1/2">
              <input
                type="text"
                placeholder={
                  language === 'en' ? "Search cow breeds..." : 
                  language === 'hi' ? "गाय की नस्लें खोजें..." :
                  "ଗାଈ ପ୍ରଜାତି ଖୋଜନ୍ତୁ..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 pl-12 pr-4 rounded-full bg-black/70 text-white text-lg border border-gray-500/40
                focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-500
                hover:border-gray-300 placeholder-gray-400"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
            </div>
          </div>
          <div className="mt-4 relative">
              <select 
                value={language} 
                onChange={(e)=>setLanguage(e.target.value)}
                className="py-2 px-4 rounded-full bg-black/70 text-white border border-gray-500/40
                         focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-500
                         hover:border-gray-300 cursor-pointer appearance-none pr-8"
              >
                <option value="en">🇬🇧 English</option>
                <option value="or">🇮🇳 ଓଡ଼ିଆ</option>
                <option value="hi">🇮🇳 हिंदी</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
            </div>
          </div>
          {/* 🐮 Cards */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
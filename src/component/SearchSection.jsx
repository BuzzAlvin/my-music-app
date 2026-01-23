import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline";
import SongCard from "./SongCard";
import ButtomNav from "./ButtomNav";
import Footer from "./Footer";

export default function SearchSection({ active, setActive, playSong, goTo }) {
  const [inputText, setInputText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  function handleInputChange(event) {
    setInputText(event.target.value);
  }

  async function fetchSearchResults(query) {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `https://discoveryprovider.audius.co/v1/tracks/search?query=${query}&app_name=buzzalvin_music_app`
      );
      if (!res.ok) throw new Error("Failed to fetch search results");
      const data = await res.json();

      const normalizeSearch = data.data.map((song) => ({
        id: song.id,
        artist: song.user.username,
        title: song.title,
        artwork: song.artwork["480x480"],
        original: song,
      }));
      setSearchResults(normalizeSearch);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /*   useEffect(() => {
    if (!inputText.trim()) {
      setSearchResults([]);
      setHasSearch(false);
      setError(null);
    }
  }, [inputText]); */

  function handleSearch(e) {
    e.preventDefault();
    if (!inputText.trim()) return;

    setHasSearch(true);
    setSearchQuery(inputText);
    setLoading(true);
    setError(null);

    fetchSearchResults(inputText);
  }

  return (
    <main className="min-h-screen flex flex-col bg-linear-to-t from-[#000000] to-[#994040] text-white duration-300 h-screen py-4 px-3 flex-1">
      <nav className=" flex flex-row justify-between ">
        <h1 className="font-oswald capitalize text-3xl">search</h1>
        <span>
          <BellIcon className="h-6 w-6 font-bold" />
        </span>
      </nav>

      <div className="relative mt-5">
        <form onSubmit={handleSearch}>
          <input
            type="search"
            name="search"
            className="bg-white text-black rounded-lg w-full h-12 pl-12 focus:outline-none "
            placeholder="Search for songs, artists..."
            value={inputText}
            onChange={handleInputChange}
          />
          <button type="submit">
            <MagnifyingGlassIcon className="w-9 h-9 font-bold text-black absolute top-2 left-1 cursor-pointer" />
          </button>
        </form>
      </div>

      <section className="p-4 flex-1 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3 font-oswald tracking-wide">
          Results
        </h2>
        {/* Loading */}
        {loading && (
          <div className="flex justify-center mt-8">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
        {error && <p className="text-red-400">{error}</p>}
        {/* Not found */}
        {!loading && hasSearched && searchResults.length === 0 && inputText === searchQuery && (
          <p className="text-white mt-4">
            😔 No results found for <b>"{inputText}"</b>
          </p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 cursor-pointer">
          {searchResults.map((song, index) => (
            <SongCard
              key={song.id}
              artist={song.artist}
              img={song.artwork}
              title={song.title}
              onPlay={() => playSong(searchResults, index)}
            />
          ))}
        </div>
      </section>
      {<ButtomNav active={active} setActive={setActive} />}
      <Footer />
    </main>
  );
}



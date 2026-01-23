import { useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import CategoriesBar from "./CategoriesBar";
import SongCard from "./SongCard";
import CollectionCard from "./CollectionCard";
import ButtomNav from "./ButtomNav";
import Footer from "./Footer";

export default function HomeSection({ active, setActive, goTo, playSong }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [trending, setTrending] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [newCollections, setNewCollections] = useState([]);
  const [loading, setLoading] = useState({
    trending: true,
    playlist: true,
    newCollections: true,
  });
  const [error, setError] = useState(null);
  useEffect(() => {
    // Fetch trending songs
    async function fetchTrending() {
      try {
        const res = await fetch(
          "https://discoveryprovider.audius.co/v1/tracks/trending?limit=20&app_name=buzzalvin_music_app"
        );
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch trending songs");
        const data = await res.json();
        const normalizedTrending = data.data.map((song) => ({
          id: song.id,
          title: song.title,
          artist: song.user.username,
          artwork: song.artwork["480x480"],
          original: song,
        }));
        setTrending(normalizedTrending);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading((prev) => ({ ...prev, trending: false }));
      }
    }

    // Fetch playlist songs
    async function fetchPlaylist() {
      try {
        const res = await fetch(
          "https://discoveryprovider.audius.co/v1/playlists/trending?limit=20&app_name=buzzalvin_music_app"
        );
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch playlist songs");
        const data = await res.json();
        const normalizedPlaylist = data.data.map((pl) => ({
          id: pl.id,
          title: pl.playlist_name,
          artist: pl.user?.name,
          artwork: pl.artwork?.["480x480"],
          original: pl,
        }));
        setPlaylist(normalizedPlaylist);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading((prev) => ({ ...prev, playlist: false }));
      }
    }

    // Fetch new collections
    async function fetchNewCollections() {
      try {
        const res = await fetch(
          "https://discoveryprovider.audius.co/v1/tracks/trending/underground?limit=20&app_name=buzzalvin_music_app&limit=10"
        );
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch new collections");
        const data = await res.json();
        const normalizedCollections = data.data.map((song) => ({
          id: song.id,
          title: song.title,
          artist: song.user.username,
          artwork: song.artwork["480x480"],
          original: song,
        }));
        setNewCollections(normalizedCollections);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading((prev) => ({ ...prev, newCollections: false }));
      }
    }
    fetchTrending();
    fetchPlaylist();
    fetchNewCollections();
  }, []);
  return (
    <main className="font-poppins text-white py-2 px-4 h-dvh flex flex-col flex-1 justify-between min-h-screen max-h-screen overflow-hidden bg-linear-to-t from-[#000000] to-[#994040] duration-300 pl-8 pb-25 overflow-y-auto">
      
      <section className="flex justify-between items-center h-18 mb-10">
        
        <div className="flex items-center justify-center text-white">
          
          <h1 className="font-oswald font-bold text-2xl">
            
            Hello,
            <span className="font-medium italic font-poppins text-[18px]">
              
              BuzzAlvin
            </span>
          </h1>
        </div>
        <span className="">
          
          <BellIcon className="h-6 w-6 font-bold" />
        </span>
      </section>
      <CategoriesBar
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <section className="mt-6">
        
        <h3 className="text-2xl font-semibold mb-4 capitalize font-poppins text-white">
          
          popular songs
        </h3>
        <div className="flex flex-row gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 ">
          
          {trending.map((song, index) => (
            <SongCard
              key={song.id}
              artist={song.artist}
              img={song.artwork}
              title={song.title}
              onPlay={() => playSong(trending, index)}
            />
          ))}
        </div>
      </section>
      <section className="mt-6">
        
        <h3 className="text-2xl font-semibold mb-4 capitalize font-poppins text-white">
          
          new collections
        </h3>
        <div className="flex flex-row gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 ">
          
          {newCollections.map((song, index) => (
            <CollectionCard
              key={song.id}
              img={song.artwork}
              title={song.title}
              onPlay={() => playSong(newCollections, index)}
            />
          ))}
        </div>
      </section>
      <section className="mt-9">
        
        <h3 className="text-2xl font-semibold mb-4 capitalize font-poppins text-white">
          
          playlists
        </h3>
        <div className="flex flex-row gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 ">
          
          {playlist.map((song, index) => (
            <SongCard
              key={song.id}
              artist={song.artist}
              img={song.artwork}
              title={song.title}
              onPlay={() => playSong(playlist, index)}
            />
          ))}
        </div>
      </section>
      <ButtomNav goTo={goTo} active={active} setActive={setActive} /> <Footer />
    </main>
  );
}

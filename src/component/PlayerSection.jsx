import { useEffect, useState, useRef } from "react";
import {
  Shuffle,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  ChevronDown,
  ListMusic,
} from "lucide-react";
import Footer from "./Footer";

export default function PlayerSection({
  goBack,
  song,
  queue,
  currentIndex,
  setCurrentIndex,
  isShuffle,
  setIsShuffle,
  isRepeat,
  setisRepeat,
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  //calculate time format
  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  //Next Song
  const nextSong = () => {
    if (!queue || queue.length === 0) return;
    if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * queue.length);
      setCurrentIndex(nextIndex);
      return;
    }

    //Repeat One
    if (isRepeat === 2) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }
    //Repeat All
    else if (isRepeat === 1) setCurrentIndex(0);
    //Normal next
    else if (currentIndex < queue.length - 1) setCurrentIndex(currentIndex + 1);
  };

  //Previous Song
  const PrevSong = () => {
    if (!queue || queue.length === 0) return;
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else if (isRepeat === "all") setCurrentIndex(queue.length - 1);
  };

  //Repeat Song
  const toggleRepeat = () => {
    setisRepeat((prev) => (prev + 1) % 3);
  };

  //Load songs
  useEffect(() => {
    if (!song || !audioRef.current) return;

    audioRef.current.src = song.original?.track_cid
      ? `https://discoveryprovider.audius.co/v1/tracks/${song.original.id}/stream?app_name=buzzalvin_music_app`
      : "";

    audioRef.current.load();

    const playWhenReady = async () => {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Autoplay blocked:", error);
        setIsPlaying(false);
      }
    };
    playWhenReady();
    setCurrentTime(0);
  }, [song]);

  //Run Eventlistner once
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };
    const audioDuration = () => {
      setDuration(audio.duration || 0);
    };
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", audioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", audioDuration);
    };
  }, []);

  //Autoplay next song
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.onended = () => {
      nextSong();
      setIsPlaying(true);
      return () => (audio.onended = null);
    };
  }, [nextSong]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  //If text overflows
  /*   const titleRef = useRef(null);
  const [titleOverflow, setTitleOverflow] = useState(false);

  useEffect(() => {
    if (!titleRef.current) return;
    setTitleOverflow(
      titleRef.current.scrollWidth > titleRef.current.clientWidth
    );
  }, [song?.title]);

  const [artistOverflow, setArtistOverflow] = useState(false);
  const artistRef = useRef(null);
  useEffect(() => {
    if (!artistRef.current) return;
    setArtistOverflow(
      artistRef.current.scrollWidth > artistRef.current.clientWidth
    );
  }, [song?.artist]); */

  return (
    <main className="font-poppins text-white py-2 px-4 h-dvh flex flex-col flex-1 justify-between min-h-screen max-h-screen overflow-hidden bg-linear-to-t from-[#000000] to-[#994040] duration-300">
      <div className="mt-2">
        <div className="flex items-center justify-between mt-1">
          <ChevronDown className="h-6 w-6 cursor-pointer" onClick={goBack} />
          <h1 className="text-xl">Now Playing</h1>
          <ListMusic className="h-6 w-6 cursor-pointer" />
        </div>
      </div>
      <div className="track-info flex flex-col flex-1 items-center mt-2">
        <img
          className="mt-1 rounded-xl h-75"
          src={song.artwork}
          alt={song.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "../src/assets/adult-3086302_1280.jpg";
          }}
        />
        <div className="flex flex-col pt-4 mt-1 w-full text-center">
          {/* Title */}
          {song.title?.length > 20 ? (
            <div className="w-full overflow-hidden">
              <div className="inline-block whitespace-nowrap text-lg font-semibold animate-slide-horizontal">
                {song.title}
              </div>
            </div>
          ) : (
            <h2 className="text-lg font-semibold">{song.title}</h2>
          )}

          {/* Artist */}
          {song.artist?.length > 18 ? (
            <div className="w-full overflow-hidden">
              <div className="inline-block whitespace-nowrap text-base font-medium opacity-90 animate-slide-horizontal">
                {song.artist}
              </div>
            </div>
          ) : (
            <h3 className="text-base font-medium opacity-90">{song.artist}</h3>
          )}
        </div>

        <div className="w-full flex flex-col py-2 mt-3">
          <input
            type="range"
            className=" w-full h-1 bg-green-500 border-0"
            value={currentTime}
            min={0}
            max={duration}
            onChange={(e) => {
              audioRef.current.currentTime = e.target.value;
              setCurrentTime(e.target.value);
            }}
          />
          <div className="flex flex-row justify-between">
            <span className="current-time mt-2 text-sm">
              {formatTime(currentTime)}
            </span>
            <span className="total-duration mt-1 text-sm">
              {formatTime(duration)}
            </span>
          </div>
        </div>
        <div className="flex justify-between flex-row items-center w-full">
          <button onClick={() => setIsShuffle(!isShuffle)}>
            {isShuffle ? (
              <Shuffle className={"w-7 h-7 text-green-500"} />
            ) : (
              <Shuffle className={"w-7 h-7"} />
            )}
          </button>
          <div className="flex flex-row items-center justify-center gap-4">
            <button
              className="control-btn text-2xl cursor-pointer"
              onClick={PrevSong}
            >
              <SkipBack className="w-8 h-8" fill="currentColor" />
            </button>
            <button
              className="cursor-pointer flex items-center justify-center border rounded-full text-3xl w-20 h-20 text-black bg-[#1DB954]"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-14 h-14 " fill="currentColor" />
              ) : (
                <Play className="w-14 h-14 " fill="currentColor" />
              )}
            </button>
            <button
              className="cursor-pointer control-btn text-2xl"
              onClick={nextSong}
            >
              <SkipForward className="w-8 h-8" fill="currentColor" />
            </button>
          </div>
          <button onClick={toggleRepeat}>
            {isRepeat === 0 && <Repeat className="w-7 h-7 opacity-40" />}
            {isRepeat === 1 && <Repeat className="w-7 h-7 text-green-500" />}
            {isRepeat === 2 && <Repeat1 className="w-7 h-7 text-green-500" />}
          </button>
        </div>
      </div>
      <Footer /> <audio ref={audioRef} autoPlay />
    </main>
  );
}

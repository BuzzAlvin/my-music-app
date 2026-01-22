import { useState, useEffect } from "react";
import HomeSection from "./component/HomeSection";
import SearchSection from "./component/SearchSection";
import PlayerSection from "./component/PlayerSection";
function App() {
  const [active, setActive] = useState("home");
  const [previous, setPrevious] = useState(null);

  // Music Player States
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(0);

  const currentSong = queue[currentIndex];

  const goTo = (page) => {
    setActive(page);
    setPrevious(active);
  };

  const goBack = () => {
    setActive(previous || "home");
  };

  const playSong = (songList, index) => {
    setQueue(songList);
    setCurrentIndex(index);
    setPrevious(active);
    setActive("play");
  };

  //Restore Player State from localStorage( Run Once)

  useEffect(() => {
    const savedSong = localStorage.getItem("queue");
    const savedIndex = localStorage.getItem("currentIndex");
    const savedShuffle = localStorage.getItem("isShuffle");
    const savedRepeat = localStorage.getItem("isRepeat");

    if (savedSong) setQueue(JSON.parse(savedSong));
    if (savedIndex) setCurrentIndex(Number(savedIndex));
    if (savedShuffle) setIsShuffle(JSON.parse(savedShuffle));
    if (savedRepeat !==null) setIsRepeat(Number(savedRepeat));
  }, []);

  //Save Player State to localStorage
  useEffect(() => {
    if (currentSong) {
      localStorage.setItem("queue", JSON.stringify(queue));
      localStorage.setItem("currentIndex", currentIndex);
    }
  }, [queue, currentIndex]);

  //Save Shuffle and Repeat State to localStorage
  useEffect(() => {
    localStorage.setItem("isShuffle", JSON.stringify(isShuffle));
    localStorage.setItem("isRepeat", isRepeat);
  }, [isShuffle, isRepeat]);

  return (
    <>
      {active === "home" && (
        <HomeSection
          goTo={goTo}
          playSong={playSong}
          active={active}
          setActive={setActive}
        />
      )}
      {active === "search" && (
        <SearchSection
          goTo={goTo}
          playSong={playSong}
          active={active}
          setActive={setActive}
        />
      )}
      {active === "play" && (
        <PlayerSection
          goBack={goBack}
          song={currentSong}
          queue={queue}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          isShuffle={isShuffle}
          setIsShuffle={setIsShuffle}
          isRepeat={isRepeat}
          setisRepeat={setIsRepeat}
        />
      )}
    </>
  );
}
export default App;

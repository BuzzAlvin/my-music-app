const popularSongList = document.getElementById("popular-list");
const playlistSongList = document.getElementById("playlist-list");
const newCollectionList = document.getElementById("new-collections");

function getArtwork(artwork) {
  if (!artwork) return "./assets/img/adult-3086302_1280.jpg";

  const sizes = ["480x480", "2000x2000", "150x150"];

  for (let size of sizes) {
    if (artwork[size] && artwork[size].trim() !== "") {
      return artwork[size];
    }
  }

  return "./assets/img/adult-3086302_1280.jpg";
} 

//LOAD API
async function loadTrendingSongs() {

    const trendingSongsURL = 'https://discoveryprovider.audius.co/v1/tracks/trending?limit=20&app_name=buzzalvin_music_app';

    try {
        const res = await fetch(trendingSongsURL);
        const data = await res.json();
        songs = data.data.map(track => ({
            title: track.title,
            artist: track.user.name,
            img: getArtwork(track.artwork),
            src: `https://discoveryprovider.audius.co/v1/tracks/${track.id}/stream?app_name=buzzalvin_music_app`
        }));

        localStorage.setItem("trending", JSON.stringify(songs));

        //Populate UI
        popularSongList.innerHTML = "";

        songs.forEach((song, index) => {
            const div = document.createElement("div");

            div.className = "cursor-pointer snap-start flex-shrink-0 w-[180px] border border-black rounded-xl";
            
            div.innerHTML = `
                <img src=${song.img} alt="song cover" class="song-image w-full rounded-lg">
                <p class="song-title mt-2 text-sm text-white font-poppins pl-1">${song.title}</p>
                <p class="artist-name text-xs text-gray-400 pl-1">${song.artist}</p>
            `;

            div.addEventListener('click', () => {
                localStorage.setItem("startIndex", index);
                localStorage.setItem("autoplay", "true");
                window.location.href = "player.html";
            });

            popularSongList.appendChild(div);
        });

    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

async function loadPlaylistSongs() {
    const playListURL = 'https://discoveryprovider.audius.co/v1/playlists/trending?limit=20&app_name=buzzalvin_music_app';

    try {
        const res = await fetch(playListURL);
        const data =  await res.json();
        songs = data.data.map(track => ({
            title: track.playlist_name ?? track.title,
            artist: track.user.name,
            img: track.artwork?.['480x480'] ?? track.artwork?.['150x150'] ?? "./assets/img/adult-3086302_1280.jpg",
            src: `https://discoveryprovider.audius.co/v1/tracks/${track.id}/stream?app_name=buzzalvin_music_app`
        }));

        localStorage.setItem("playlist", JSON.stringify(songs));

        //POPULATE PLAYLIST
        playlistSongList.innerHTML = "";

        songs.forEach((song, index) => {
            const div = document.createElement("div");
            div.className = "snap-center shrink-0 w-[180px] border border-black rounded-xl";
            div.innerHTML = `
                <img src=${song.img} alt="song cover" class="song-image w-full rounded-lg">
                <p class="song-title mt-2 text-sm text-white font-poppins pl-1">${song.title}</p>
                <p class="artist-name text-xs text-gray-400 pl-1">${song.artist}</p>
            `;

            div.addEventListener('click', () => {
                localStorage.setItem("startIndex", index);
                localStorage.setItem("autoplay", "true");
                window.location.href = "player.html";
            });

            playlistSongList.appendChild(div)
        });

    } catch (error) {
        console.log("Error fetchingsongs:", error)
    }
}

async function loadNewCollection() {
    const newCollectionURL = 'https://discoveryprovider.audius.co/v1/tracks/trending/underground?limit=20&app_name=buzzalvin_music_app&limit=10';

    try {
        const res = await fetch(newCollectionURL);
        const data = await res.json();
        songs = data.data.map(track => ({
            title: track.title,
            artist: track.user.name,
            img: track.artwork?.['480x480'] || track.artwork?.['150x150'] || "./assets/img/adult-3086302_1280.jpg",
            src: `https://discoveryprovider.audius.co/v1/tracks/${track.id}/stream?app_name=buzzalvin_music_app`
        }));

        localStorage.setItem("newCollections", JSON.stringify(songs));

        newCollectionList.innerHTML = ""; // clear old content

        songs.forEach((song, index) => {
            const div = document.createElement("div");

                div.className = "cursor-pointer snap-start shrink-0 w-[370px] h-[280px] rounded-xl overflow-hidden";

                div.innerHTML = `
                <img src=${song.img} class="song-image w-full h-full object-cover rounded-xl mb-2">
                <h3 class="song-title text-sn pl-1 font-semibold">${song.title}</h3>
                <p class="artist-name text-xs pb-1 pl-1">${song.artist}</p>
                `;
            
             div.addEventListener('click', () => {
                localStorage.setItem("startIndex", index);
                localStorage.setItem("autoplay", "true");
                window.location.href = "player.html";
            });

                newCollectionList.appendChild(div);
            });

        } catch (error) {
            console.error("Error fetching new collections:", error);
        }

}




if (playlistSongList) loadPlaylistSongs(playlistSongList)
if (popularSongList) loadTrendingSongs(popularSongList);
if (newCollectionList) loadNewCollection(newCollectionList);
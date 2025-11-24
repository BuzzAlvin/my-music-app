const searchInput = document.getElementById('search-Input');
const searchBtn = document.getElementById('search-btn');
const searchResult = document.getElementById('searchResults');
const homeSection = document.getElementById('home-section');
const searchSection = document.getElementById('search-section');
const searchForm = document.getElementById("searchForm");

let searchSongsList = [];
let typingTimeout;


    

if (searchForm) {
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();

    clearTimeout(typingTimeout);

    if(!query) return;

    typingTimeout = setTimeout(() => {
        
        searchSongs(query);
    }, 500);

    });

    async function searchSongs(query) {
       const seacrhUrl = `https://discoveryprovider.audius.co/v1/tracks/search?query=${query}&app_name=buzzalvin_music_app`;
       
       
       try {

           const res = await fetch(seacrhUrl)
           const data = await res.json();
            searchSongsList = data.data.map(track => ({
                title: track.title,
                artist: track.user.name,
                img: track.artwork?.['480x480'] || track.artwork?.['150x150'] || "./assets/img/default.jpg",
                src: `https://discoveryprovider.audius.co/v1/tracks/${track.id}/stream?app_name=buzzalvin_music_app`
            }));

            localStorage.setItem("searchResult", JSON.stringify(searchSongsList));

            displaySearchResult();

        } catch(error) {
            console.error("Error searching songs:", error);
        }
    }

    function displaySearchResult() {
        searchResult.innerHTML = "";

        searchSongsList.forEach((song, index) =>{
            const div = document.createElement("div");

            div.classList = "track bg-gray-900 p-3 rounded-2xl cursor-pointer hover:bg-gray-800 transition";
            div.innerHTML = `
                <img id="song-img" src=${song.img} onerror="this.onerror=null;this.src='./assets/img/adult-3086302_1280.jpg';"  class="rounded-xl w-full h-32 object-cover mb-2">
                <h3 id="song-title" class="text-sm font-medium truncate">${song.title}</h3>
                <p id="song-artist" class="text-xs text-gray-400 truncate">${song.artist}</p>
            `

            div.addEventListener('click', () =>{
                localStorage.setItem("startIndex", index);
                localStorage.setItem("autoplay", "true");
                window.location.href = "player.html"; 
            });

            searchResult.appendChild(div);
        })
    }
}


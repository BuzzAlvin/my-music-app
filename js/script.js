const trackImage = document.querySelector('.track-img');
const trackTitle = document.querySelector('.track-title');
const trackArtist = document.querySelector('.track-artist');
const currentTimeEl = document.querySelector('.current-time');
const durationEl = document.querySelector('.total-duration');
const progressBar = document.querySelector('.progress-bar');
const prevBtn = document.querySelector('#prev-btn');
const playBtn = document.querySelector('#play-btn');
const pauseBtn = document.querySelector('#pause-btn');
const nextBtn = document.querySelector('#next-btn');
const shuffleBtn = document.querySelector('#shuffle');
const repeatBtn = document.querySelector('#repeat');

//PLAYER STATE
let currentSongIndex = 0;
let isPlaying = false;
let songs = [];
let isRepeat = false;
let isShuffle = false;

const audio = new Audio();

const selectedSong = JSON.parse(localStorage.getItem('selectedSong'));

if(selectedSong) {
    const { title, user, stream_url, artwork } = selectedSong;
    trackTitle.textContent = title || 'Unknown Title';
    trackArtist.textContent = user?.name || 'Unknown Artist';
    trackImage.src = artwork?.['480x480'] || artwork?.['150x150'] || "../assets/img/adult-3086302_1280.jpg";
    audio.src = selectedSong.stream_url || selectedSong.permalink_url;
}

//PLAY SEARCH SONGS
window.addEventListener('DOMContentLoaded', () => {
    const selected = localStorage.getItem('selectedSong');

    if(selected) {
        const song = JSON.parse(selected);

        trackImage.src = song.artwork?.['480x480'] || "../assets/img/adult-3086302_1280.jpg";
        trackTitle.textContent = song.title;
        trackArtist.textContent = song.user.name;

        audio.src = song.stream_url || song.audio || song.permalink_url;

        localStorage.removeItem('selectedSong')
    }
})

//LOAD PLAYLIST FROM HOMEPAGE
window.addEventListener("DOMContentLoaded", () =>{
    const trendingData = localStorage.getItem("trending");
    const playlistData = localStorage.getItem("playlist");
    const newCollectionData = localStorage.getItem("newCollections");
    const searchData = localStorage.getItem("searchResult");
    const startIndex = localStorage.getItem("startIndex");

    currentSongIndex = parseInt(startIndex) || 0;

    if (searchData) {
        songs = JSON.parse(searchData);
        console.log("Loaded Search Results");

        // clear others
        localStorage.removeItem("trending");
        localStorage.removeItem("playlist");
        localStorage.removeItem("newCollections");

    }else if (trendingData) {
        songs = JSON.parse(trendingData);
        console.log("Loaded Trending Songs");

        //Remove playlist cache to avoid conflicts
        localStorage.removeItem("playlist");
        localStorage.removeItem("newCollections");
        
    } else if (playlistData) {
        songs = JSON.parse(playlistData);
        console.log("Loaded Playlist Songs");

        //Remove trending cache to avoid conflicts
        localStorage.removeItem("trending");
        localStorage.removeItem("newCollections");

    } else if (newCollectionData) {
        songs =JSON.parse(newCollectionData);
        console.log("Loaded New Collections Songs");
        localStorage.removeItem("playlist");
        localStorage.removeItem("trending");
        
    } else {
        console.error("No trending songs found in storage!");
        return;

    }  

    loadSong(currentSongIndex);

    //Play songs automatically
    const autoplay = localStorage.getItem("autoplay") === "true";
    if (autoplay) {
        playSong();
        localStorage.removeItem("autoplay");
    }
});

// LOAD SONG
function loadSong(track) {
    const song = songs[track];

    if (!song) return;

    if (trackImage) trackImage.src = song.img;
    if (trackTitle) trackTitle.textContent = song.title;
    if (trackArtist) trackArtist.textContent = song.artist;
    if (audio) audio.src = song.src;

    updateSongInfo(song.title, song.artist);

    if (progressBar) progressBar.value = 0
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
    if (durationEl) durationEl.textContent = '0:00';
}

// PLAY SONG
function playSong() {
    if (!songs.length) return;
    isPlaying = true;
    
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';

    //To prevent abortError if play is called before audio is ready//
    audio.play().catch(() => {
        audio.addEventListener('canplay', () => {
            audio.play().catch(error => 
                console.error("Error playing audio:", error));
            }, { once: true });
    });
}

// PAUSE SONG
function pauseSong() {
    isPlaying = false;
    audio.pause()
    playBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
}

//PREV SONG
function prevSong() {
    if (isShuffle) {
        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === currentSongIndex && songs.length > 1);
        currentSongIndex = randomIndex;

    } else {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    }
   loadSong(currentSongIndex);
   playSong();
} 

// NEXT SONG
function nextSong() {
    if (isShuffle) {
        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * songs.length);

        } while (randomIndex === currentSongIndex && songs.length > 1)
            
        currentSongIndex = randomIndex;
        } else {
            currentSongIndex =( currentSongIndex + 1) % songs.length;
        }
     
    loadSong(currentSongIndex);
    playSong();
}

//SHUFFLE SONG
function shuffleSong() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
    
}

//REPEAT SONG
function repeatSong() {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
}

// UPDATE PROGRESS BAR & TIME
function updateProgress() {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
    
    // Update time display as song plays
    const currentMinutes = Math.floor(audio.currentTime / 60);
    const currentSeconds = Math.floor(audio.currentTime % 60);
    const totalMinutes = Math.floor(audio.duration / 60);
    const totalSeconds = Math.floor(audio.duration % 60);
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
    durationEl.textContent = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;

}else {
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '0:00';
}
}

// SEEK SONG
if(progressBar) {
progressBar.addEventListener('input', (e) => {
    const seekTime = ( audio.duration * e.target.value) / 100;
    if (!isNaN(audio.duration)) audio.currentTime = seekTime;
});
}
// WHEN THE SONG ENDS
audio.addEventListener('ended', () => {
    if (isRepeat) {
        playSong();
    } else {
        nextSong();
    }
});

//MARQUEE EFFECT
function applyMarquee(el) {
    const parent = el.parentElement;

    const textWidth = el.scrollWidth;
    const containerWidth = parent.clientWidth;

    if (textWidth > containerWidth) {
        el.classList.add('marquee');
    } else{
        el.classList.remove('marquee');
    }
}

function updateSongInfo(title, artist) {
    if (trackTitle){
    trackTitle.textContent = title;
    setTimeout(() => applyMarquee(trackTitle), 0)
    }

    if(trackArtist) {
    trackArtist.textContent = artist;
    setTimeout(() => applyMarquee(trackTitle), 0)
    }
}


//UPDATE PROGRESS AS SONG PLAYS
audio.addEventListener("timeupdate", updateProgress);


// EVENT LISTENERS
if (playBtn) {
playBtn.addEventListener('click', playSong);
}

if (pauseBtn) {
pauseBtn.addEventListener('click', pauseSong);
}

if (prevBtn) {
prevBtn.addEventListener('click', prevSong);
}

if (nextBtn) {
nextBtn.addEventListener('click', nextSong);
}

if (shuffleBtn) {
shuffleBtn.addEventListener('click', shuffleSong);
}

if (repeatBtn) {
repeatBtn.addEventListener('click', repeatSong);
}

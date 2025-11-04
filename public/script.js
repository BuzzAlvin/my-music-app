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

let currentSongIndex = 0;
let isPlaying = false;
let songs = [];
let isRepeat = false;
let isShuffle = false;

const trendingSongsURL = 'https://discoveryprovider.audius.co/v1/tracks/search?query=afrobeats&app_name=buzzalvin_music_app';

const audio = new Audio();

//LOAD API
async function loadTrendingSongs() {
    try {
        const res = await fetch(trendingSongsURL);
        const data = await res.json();
        songs = data.data.map(track => ({
            title: track.title,
            artist: track.user.name,
            img: track.artwork['150x150'] || track.artwork['480x480'] || '../assets/img/adult-3086302_1280.jpg',
            src: `https://discoveryprovider.audius.co/v1/tracks/${track.id}/stream?app_name=buzzalvin_music_app`
        }));

        loadSong(currentSongIndex);
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

// LOAD SONG
function loadSong(track) {
    const song = songs[track];

    if (!song) return;

    trackImage.src = song.img;
    trackTitle.textContent = song.title;
    trackArtist.textContent = song.artist;
    audio.src = song.src;
    progressBar.value = 0
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '0:00';
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
/*     if (audio.readyState >= 3) {
        console.error("Error playing audio:", error);
    } else {
    } */
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
progressBar.addEventListener('input', (e) => {
    const seekTime = ( audio.duration * e.target.value) / 100;
    audio.currentTime = seekTime;
});

// WHEN THE SONG ENDS
audio.addEventListener('ended', () => {
    if (isRepeat) {
        playSong();
    } else {
        nextSong();
    }
});


//UPDATE PROGRESS AS SONG PLAYS
audio.addEventListener("timeupdate", updateProgress);


// EVENT LISTENERS
playBtn.addEventListener('click', playSong);
pauseBtn.addEventListener('click', pauseSong);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
shuffleBtn.addEventListener('click', shuffleSong);
repeatBtn.addEventListener('click', repeatSong);

// INITIAL LOAD
loadTrendingSongs();
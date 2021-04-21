
// Get DOM Elements
let musicPlayer = document.getElementById('musicPlayer');
let musicPlayerBG = document.getElementById('mpbg');
let audioElem = document.getElementById('audioElem');
let mpCoverPic = document.getElementById('musicCover');
let songName = document.getElementById('songName');
let albumName = document.getElementById('albumName');
let artistName = document.getElementById('artistName');
let prevBtn = document.getElementById('prevBtn');
let playPauseBtn = document.getElementById('playPauseBtn');
let nextBtn = document.getElementById('nextBtn');
let musicProgressContainer = document.getElementById('musicProgressContainer');
let musicProgress = document.getElementById('musicProgress');
let mpSongCT = document.getElementById('songCountableDuration');
let mpSongTD = document.getElementById('songTotalDuration');
let muteBtn = document.getElementById('muteBtn');
let loopBtn = document.getElementById('loopBtn');

// Music Player Basic Configuration / Settings.
let music_player_setting = {
    default_song_index: 0,
    audio_muted: false,
    audio_loop: false,
    music_cover_pic_path: 'public/music-data/covers',
    music_track_path: 'public/music-data/tracks',
    music_api_url: 'public/music-api/music-tracks.json'
}

// Get All Songs From API
var songData = '';
var xhReq = new XMLHttpRequest();
xhReq.open("GET",`${music_player_setting.music_api_url}`,false);
xhReq.send(null);
songData = JSON.parse( xhReq.responseText );

// Update Song Details.
var loadSong = (song) => {
    songName.innerHTML = song.song_title;
    albumName.innerHTML = song.song_album_name;
    artistName.innerHTML = song.singer_name;
    musicPlayerBG.style.backgroundImage = `url('${music_player_setting.music_cover_pic_path}/${song.song_cover_pic}')`;
    mpCoverPic.src = `${music_player_setting.music_cover_pic_path}/${song.song_cover_pic}`;
    mpSongTD.innerHTML = song.song_total_duration;
    audioElem.src = `${music_player_setting.music_track_path}/${song.song_name}.mp3`;
};

// Initially Load Song Into DOM.
loadSong(songData[music_player_setting.default_song_index]);

// Play Song Function.
var playSong = () => {
    musicPlayer.classList.add('play');
    audioElem.play();
}

// Pause Song Function.
var pauseSong = () => {
    musicPlayer.classList.remove('play');
    audioElem.pause();
}

// Mute Audio
var muteAudio = () => {
    muteBtn.classList.add('active');
    musicPlayer.classList.add('isMuted');
    audioElem.muted = true;
    music_player_setting.audio_muted = true;
}

// Unmute Audio
var unmuteAudio = () => {
    muteBtn.classList.remove('active');
    musicPlayer.classList.remove('isMuted');
    audioElem.muted = false;
    music_player_setting.audio_muted = false;
}

// Loop Audio
var loopAudio = () => {
    loopBtn.classList.add('active');
    musicPlayer.classList.add('isLooped');
    audioElem.loop = true;
    music_player_setting.audio_loop = true;
}

// Unloop Audio
var unloopAudio = () => {
    loopBtn.classList.remove('active');
    musicPlayer.classList.remove('isLooped');
    audioElem.loop = false;
    music_player_setting.audio_loop = false;
}

// Previous Song Function.
var prevSong = () => {
    music_player_setting.default_song_index--;
    if(music_player_setting.default_song_index < 0) {
        music_player_setting.default_song_index = songData.length - 1;
    }
    loadSong(songData[music_player_setting.default_song_index]);
    playSong();
}

// Next Song Function.
var nextSong = () => {
    music_player_setting.default_song_index++;
    if(music_player_setting.default_song_index > songData.length - 1) {
        music_player_setting.default_song_index = 0;
    }
    loadSong(songData[music_player_setting.default_song_index]);
    playSong();
}

// Update Song Progress Bar Function.
var updateSongProgress = (e) => {
    const {duration, currentTime} = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    musicProgress.style.width = `${progressPercent}%`;
}

// Jump On To Song Position.
var setSongProgress = (e) => {
    var width = musicProgressContainer.clientWidth;
    var clickX = e.offsetX;
    var audioDuration = audioElem.duration;
    audioElem.currentTime = (clickX / width) * audioDuration;
}

// Update Song Time Duration Status Function.
var updateSongTimeDuration = (e) => {
    var mins = Math.floor(audioElem.currentTime / 60);
    if (mins < 10) {
      mins = '0' + String(mins);
    }
    var secs = Math.floor(audioElem.currentTime % 60);
    if (secs < 10) {
      secs = '0' + String(secs);
    }
    mpSongCT.innerHTML = `${mins}:${secs}`;
}

// Previous Song Button onClick Event.
prevBtn.addEventListener('click', prevSong);

// Next Song Button onClick Event.
nextBtn.addEventListener('click', nextSong);

// Update Song Progress onTimeUpdate Event.
audioElem.addEventListener('timeupdate', updateSongProgress);

// Update Song Time Duration Status Along With Current Audio Time.
audioElem.addEventListener('timeupdate', updateSongTimeDuration);

// Jump To The Song Portion When User Clicks On Progress Bar.
musicProgressContainer.addEventListener('click', setSongProgress);

// Play / Pause onClick Event.
playPauseBtn.addEventListener('click', function(){
    var isPlaying = musicPlayer.classList.contains('play');
    if(isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

// Mute Audio onClick Event.
muteBtn.addEventListener('click', function() {
    var isAudioMuted = musicPlayer.classList.contains('isMuted');
    if(isAudioMuted) {
        unmuteAudio();
    } else {
        muteAudio();
    }
});

// Loop Audio onClick Event.
loopBtn.addEventListener('click', function() {
    var isAudioLooped = musicPlayer.classList.contains('isLooped');
    if(isAudioLooped) {
        unloopAudio();
    } else {
        loopAudio();
    }
});

// What If Audio Ended.
audioElem.addEventListener('ended', nextSong);
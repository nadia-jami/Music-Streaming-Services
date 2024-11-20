// playlist and player
const audio = document.getElementById('audio');
const songName = document.getElementById('song-name');
const songImage = document.getElementById('song-image');
const playPauseButton = document.getElementById('play-pause');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const modal = document.getElementById('playerModal');
const closeModal = document.querySelector('.close');
const minimizeButton = document.querySelector('.minimize');
const maximizeButton = document.querySelector('.maximize');

let playlist = [
    { src: '../media/musics/micheal_jackson.mp3', name: 'Micheal Jackson', img: '../images/11.webp' },
    { src: '../media/musics/Ed-Sheeran.mp3', name: 'Ed Sheeran', img: '../images/19.jpeg' },
    { src: '../media/musics/taylor.mp3', name: 'Taylor Swift', img: '../images/15.jpeg' },
    { src: '../media/musics/micheal_jackson.mp3', name: 'Micheal Jackson', img: '../images/Madona.jpg' },
    { src: '../media/musics/Ed-Sheeran.mp3', name: 'Ed Sheeran', img: '../images/14.jpeg' },
    { src: '../media/musics/taylor.mp3', name: 'Taylor Swift', img: '../images/25.jpg' },
    { src: '../media/musics/Ed-Sheeran.mp3', name: 'Ed Sheeran', img: '../images/16.jpeg' },
  
];

let currentIndex = 0;
let isMinimized = false;

// Function to load and play a song
function loadSong(song) {
    audio.src = song.src;
    songName.textContent = song.name;
    songImage.src = song.img;
    audio.play();
    playPauseButton.textContent = '❚❚';
}

// Function to show the modal
function showModal() {
    modal.style.display = 'flex';
    modal.classList.remove('minimized');
    minimizeButton.style.display = 'inline';
    maximizeButton.style.display = 'none';
    isMinimized = false;
}

// Function to hide the modal
function hideModal() {
    modal.style.display = 'none';
    audio.pause();
    playPauseButton.textContent = ' [ ▸ ]';
}

// Open the modal and play the selected song
document.querySelectorAll('.song').forEach((songElement, index) => {
    songElement.addEventListener('click', () => {
        currentIndex = index;
        loadSong(playlist[currentIndex]);
        showModal();
    });
});

// Play or Pause functionality
playPauseButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseButton.textContent = '❚❚';
    } else {
        audio.pause();
        playPauseButton.textContent = '[ ▸ ]';
    }
});

// Play the next song
nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadSong(playlist[currentIndex]);
});

// Play the previous song
prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadSong(playlist[currentIndex]);
});

// Minimize the modal
function minimizeModal() {
    modal.classList.add('minimized');
    minimizeButton.style.display = 'none';
    maximizeButton.style.display = 'inline';
    isMinimized = true;
}

// Maximize the modal
function maximizeModal() {
    modal.classList.remove('minimized');
    minimizeButton.style.display = 'inline';
    maximizeButton.style.display = 'none';
    isMinimized = false;
}

// Event listeners for minimize and maximize
minimizeButton.addEventListener('click', minimizeModal);
maximizeButton.addEventListener('click', maximizeModal);

// Close the modal when the "close" span is clicked
closeModal.addEventListener('click', hideModal);
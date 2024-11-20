document.addEventListener("DOMContentLoaded", () => {
    const musicItems = document.querySelectorAll('.f-musics .opacity');
    const modal = document.getElementById('playerModal');
    const audio = document.getElementById('audio');
    const songName = document.getElementById('song-name');
    const songImage = document.getElementById('song-image');
    const playPauseBtn = document.getElementById('play-pause');
    const closeBtn = modal.querySelector('.close');
    const minimizeBtn = modal.querySelector('.minimize');
    const maximizeBtn = modal.querySelector('.maximize');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    // Sample music data, replace these with your actual data
    const musicData = [
      {
        name: 'Micheal Jackson',
        src: './media/musics/micheal_jackson.mp3',
        image: './images/17.jpeg'
      },
      {
        name: 'Ed Sheeran',
        src: './media/musics/Ed-Sheeran.mp3',
        image: './images/9.webp'
      },
      {
        name: 'Taylor Swift',
        src: './media/musics/taylor.mp3',
        image: './images/12.webp'
      },
      {
        name: 'Madonna',
        src: './media/musics/micheal_jackson.mp3',
        image: './images/10.jpg'
      },
      {
        name: 'Freddie Mercury',
        src: './media/musics/Ed-Sheeran.mp3',
        image: './images/1.jpg'
      },
      {
        name: 'Lady Gaga',
        src: './media/musics/taylor.mp3',
        image: './images/11.webp'
      },
      {
        name: 'Justin Bieber',
        src: './media/musics/micheal_jackson.mp3',
        image: './images/15.jpeg'
      },
      {
        name: 'Ed Sheeran',
        src: './media/musics/Ed-Sheeran.mp3',
        image: './images/19.jpeg'
      },
      {
        name: 'Sofiya',
        src: './media/musics/taylor.mp3',
        image: './images/20.jpeg'
      },
      {
        name: 'Taylor Swift',
        src: './media/musics/micheal_jackson.mp3',
        image: './images/12.webp'
      },
      {
        name: 'Taylor Swift',
        src: './media/musics/Ed-Sheeran.mp3',
        image: './images/12.webp'
      },
      {
        name: 'Freddie Mercury (Queen)',
        src: './media/musics/taylor.mp3',
        image: './images/14.jpeg'
      },
      {
        name: 'Justin Bieber',
        src: './media/musics/micheal_jackson.mp3',
        image: './images/16.jpeg'
      },
      {
        name: 'Justin Bieber',
        src: './media/musics/Ed-Sheeran.mp3',
        image: './images/slider-2.jpeg'
      },
      {
        name: 'Justin Bieber',
        src: './media/musics/taylor.mp3',
        image: './images/slider-1.jpeg'
      },
      {
        name: 'Justin Bieber',
        src: './media/musics/micheal_jackson.mp3',
        image: './images/slider-2.jpeg'
      },
      // Add more songs corresponding to your elements
    ];

    let currentIndex = 0; // Variable to track the currently playing song

    // Function to open and play selected music
    function openPlayer(index) {
        currentIndex = index;
        const selectedMusic = musicData[currentIndex];
        songName.textContent = selectedMusic.name;
        songImage.src = selectedMusic.image;
        audio.src = selectedMusic.src;
        audio.play();
        playPauseBtn.textContent = '❚❚'; // Change button to pause symbol

        // Show the modal
        modal.style.display = 'block';
    }

    // Function to play the next song
    function playNext() {
        currentIndex = (currentIndex + 1) % musicData.length; // Loop back to the first song if at the end
        openPlayer(currentIndex);
    }

    // Function to play the previous song
    function playPrevious() {
        currentIndex = (currentIndex - 1 + musicData.length) % musicData.length; // Loop to the last song if at the beginning
        openPlayer(currentIndex);
    }

    // Attach click event listeners to each music item
    musicItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            openPlayer(index);
        });
    });

    // Close modal on close button click
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        audio.pause();
    });

    // Toggle play/pause
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseBtn.textContent = '❚❚'; // Pause symbol
        } else {
            audio.pause();
            playPauseBtn.textContent = '▶'; // Play symbol
        }
    });

    // Play the next song when the next button is clicked
    nextBtn.addEventListener('click', playNext);

    // Play the previous song when the previous button is clicked
    prevBtn.addEventListener('click', playPrevious);

    // Handle minimize and maximize functionality
    minimizeBtn.addEventListener('click', () => {
        modal.classList.add('minimized');
        minimizeBtn.style.display = 'none';
        maximizeBtn.style.display = 'block';
    });

    maximizeBtn.addEventListener('click', () => {
        modal.classList.remove('minimized');
        minimizeBtn.style.display = 'block';
        maximizeBtn.style.display = 'none';
    });
});


document.addEventListener("DOMContentLoaded", () => {
  // Check if there's an active song and player state stored
  const storedSongSrc = localStorage.getItem("currentSongSrc");
  const storedSongName = localStorage.getItem("currentSongName");
  const isPlaying = localStorage.getItem("isPlaying") === "true";

  const audio = document.getElementById("audio");
  const songNameElement = document.getElementById("song-name");

  if (storedSongSrc && audio) {
    // Set up the audio player with the stored song
    audio.src = storedSongSrc;
    songNameElement.textContent = storedSongName || "Unknown Song";

    if (isPlaying) {
      audio.play();
    }
  }

  // Play or pause functionality
  const playPauseButton = document.getElementById("play-pause");
  if (playPauseButton) {
    playPauseButton.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        localStorage.setItem("isPlaying", "true");
      } else {
        audio.pause();
        localStorage.setItem("isPlaying", "false");
      }
    });
  }

  // Store song information when a song is played
  const songElements = document.querySelectorAll(".song");
  songElements.forEach((songElement) => {
    songElement.addEventListener("click", () => {
      const songSrc = songElement.getAttribute("data-src");
      const songName = songElement.getAttribute("data-name");

      if (audio && songSrc) {
        audio.src = songSrc;
        songNameElement.textContent = songName;
        audio.play();

        // Save the current song info in localStorage
        localStorage.setItem("currentSongSrc", songSrc);
        localStorage.setItem("currentSongName", songName);
        localStorage.setItem("isPlaying", "true");
      }
    });
  });

  // Save player state when leaving the page
  window.addEventListener("beforeunload", () => {
    localStorage.setItem("isPlaying", !audio.paused);
  });
});

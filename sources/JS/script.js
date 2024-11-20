// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const getLS = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setLS = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// Toggle favorite status
function toggleFavorite(event) {
  const icon = event.target;
  const song = icon.closest(".song");
  const songInfo = {
    title: song.querySelector(".song-info h3").textContent,
    artist: song.querySelector(".song-info p").textContent,
    image: song.querySelector("img").src,
  };

  let favorites = getLS("favorites");
  const index = favorites.findIndex(
    (s) => s.title === songInfo.title && s.artist === songInfo.artist
  );

  if (index > -1) {
    favorites.splice(index, 1);
    icon.classList.remove("fas", "text-danger");
    icon.classList.add("fa-regular");
  } else {
    favorites.push(songInfo);
    icon.classList.remove("fa-regular");
    icon.classList.add("fas", "text-danger");
  }

  setLS("favorites", favorites);
}

// Initialize playlist
function initPlaylist() {
  const favorites = getLS("favorites");
  $$(".favorite-icon").forEach((icon) => {
    const song = icon.closest(".song");
    const songTitle = song.querySelector(".song-info h3").textContent;
    const artistName = song.querySelector(".song-info p").textContent;

    if (
      favorites.some((s) => s.title === songTitle && s.artist === artistName)
    ) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fas", "text-danger");
    } else {
      icon.classList.remove("fas", "text-danger");
      icon.classList.add("fa-regular");
    }

    icon.addEventListener("click", toggleFavorite);
  });
}

// Manage song deletion
function manageDeletions() {
  const pageId = $("body").getAttribute("data-page-id") || "defaultPage";
  let deletedSongs = getLS("deletedSongs");

  function updateDeletedSongsUI() {
    $$(".song").forEach((song) => {
      const artist = song.querySelector("h3").innerText;
      const title = song.querySelector("p").innerText;
      if (
        deletedSongs.some(
          (s) => s.page === pageId && s.artist === artist && s.title === title
        )
      ) {
        song.remove();
      }
    });
  }

  $$(".fa-trash").forEach((icon) =>
    icon.addEventListener("click", () => {
      const song = icon.closest(".song");
      const songInfo = {
        page: pageId,
        artist: song.querySelector("h3").innerText,
        title: song.querySelector("p").innerText,
      };
      if (
        !deletedSongs.some(
          (s) =>
            s.page === songInfo.page &&
            s.artist === songInfo.artist &&
            s.title === songInfo.title
        )
      ) {
        deletedSongs.push(songInfo);
        setLS("deletedSongs", deletedSongs);
        song.remove();
      }
    })
  );

  updateDeletedSongsUI();
}

// Render favorites
function renderFavorites() {
  const favorites = getLS("favorites");
  const container = $(".playlist");

  if (favorites.length === 0) {
    container.innerHTML = '<p class="text-center">No favorites added yet.</p>';
    return;
  }

  container.innerHTML = favorites
    .filter((song) => song.title && song.artist)
    .map(
      (song) => `
      <div class="song d-flex align-items-center py-3 border-bottom">
        <img src="${
          song.image || "/placeholder.svg?height=50&width=50"
        }" alt="${song.title}" class="mr-3" height="50px">
        <div class="song-info flex-grow-1">
          <h3>${song.title}</h3>
          <p>${song.artist}</p>
        </div>
        <div class="controls d-flex">
          <i class="fas fa-heart favorite-icon text-danger" aria-hidden="true"></i>
          <i class="fa fa-ellipsis-h mx-2"></i>
        </div>
      </div>
    `
    )
    .join("");

  $$(".favorite-icon").forEach((icon) =>
    icon.addEventListener("click", removeFavorite)
  );
}

// Remove favorite
function removeFavorite(event) {
  const song = event.target.closest(".song");
  const songInfo = {
    title: song.querySelector(".song-info h3").textContent,
    artist: song.querySelector(".song-info p").textContent,
  };
  let favorites = getLS("favorites").filter(
    (s) => !(s.title === songInfo.title && s.artist === songInfo.artist)
  );
  setLS("favorites", favorites);
  renderFavorites();
}

// Clear all favorites
function clearAllFavorites() {
  localStorage.removeItem("favorites");
  renderFavorites();
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  if ($(".playlist")) {
    if (window.location.pathname.includes("favorites.html")) {
      renderFavorites();
      // Add clear all favorites button
      const clearButton = document.createElement("button");
      clearButton.textContent = "Clear All Favorites";
      clearButton.className = "btn btn-danger mt-3";
      clearButton.addEventListener("click", clearAllFavorites);
      $(".container-custom").appendChild(clearButton);
    } else {
      initPlaylist();
    }
  }
  manageDeletions();
});

//search input
// Function to highlight matching text and return matches
function highlightText(searchText) {
  if (searchText.length < 1) return []; // Don't search for empty strings

  const content = document.body; // You might want to limit this to a specific container
  const regex = new RegExp(searchText, "gi");
  const walker = document.createTreeWalker(
    content,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  const matches = [];

  // Remove existing highlights
  const highlights = document.querySelectorAll("span.highlight");
  highlights.forEach((highlight) => {
    const parent = highlight.parentNode;
    parent.replaceChild(
      document.createTextNode(highlight.textContent),
      highlight
    );
    parent.normalize();
  });

  // Find matches
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue.match(regex)) {
      matches.push(node);
    }
  }

  // Highlight matches
  matches.forEach((match) => {
    const highlighted = match.nodeValue.replace(regex, function (match) {
      return `<span class="highlight">${match}</span>`;
    });
    const fragment = document
      .createRange()
      .createContextualFragment(highlighted);
    match.parentNode.replaceChild(fragment, match);
  });

  return matches;
}

// Function to navigate to the next match
function navigateToNextMatch(matches, currentIndex) {
  if (matches.length === 0) return;

  const nextIndex = (currentIndex + 1) % matches.length;
  const nextMatch = document.querySelectorAll("span.highlight")[nextIndex];

  if (nextMatch) {
    nextMatch.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    return nextIndex;
  }

  return currentIndex;
}

// Add event listeners to search input
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector('input[name="text"]');
  let matches = [];
  let currentMatchIndex = -1;

  searchInput.addEventListener("input", function () {
    matches = highlightText(this.value);
    currentMatchIndex = -1;
  });

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission if within a form
      currentMatchIndex = navigateToNextMatch(matches, currentMatchIndex);
    }
  });
});

// Email Validation
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("email-form");
  const emailInput = document.getElementById("email");

  // Create message elements dynamically
  let errorMessage = document.querySelector("#error-message");
  let successMessage = document.querySelector("#success-message");

  if (!errorMessage) {
    errorMessage = document.createElement("p");
    errorMessage.id = "error-message";
    errorMessage.style.color = "red";
    errorMessage.style.display = "none";
    form.appendChild(errorMessage);
  }

  if (!successMessage) {
    successMessage = document.createElement("p");
    successMessage.id = "success-message";
    successMessage.style.color = "green";
    successMessage.style.display = "none";
    form.appendChild(successMessage);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const email = emailInput.value.trim();

    // Check if the email input is empty
    if (email === "") {
      displayMessage("Please enter your email.", "error");
    }
    // Check if the email format is invalid
    else if (!validateEmail(email)) {
      displayMessage("Please enter a valid email.", "error");
    }
    // If the email is valid
    else {
      displayMessage("Thanks! We received your email address. 😊", "success");
      emailInput.value = ""; // Clear the input field
    }
  });

  // Function to validate email format
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Function to display the message
  function displayMessage(message, type) {
    if (type === "error") {
      errorMessage.textContent = message;
      errorMessage.style.display = "block";
      successMessage.style.display = "none"; // Hide success message
    } else if (type === "success") {
      successMessage.textContent = message;
      successMessage.style.display = "block";
      errorMessage.style.display = "none"; // Hide error message
    }
  }
});

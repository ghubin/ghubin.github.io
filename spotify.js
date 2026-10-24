// ===== Configuration =====

// Data files
const SPOTIFY_FILES = {
  week: "data/spotify.json",
  month: "data/monthlySpotify.json"
};

// Use cache to avoid reloading every time
const spotifyCache = {};

// ===== Elements for the page =====

const periodEl = document.querySelector(".spotify_period");
const heroEl = document.querySelector(".spotify_hero");
const tracklistEl = document.querySelector(".spotify_tracklist");
const artistlistEl = document.querySelector(".spotify_artistlist");
const albumlistEl = document.querySelector(".spotify_albumlist");
const genrelistEl = document.querySelector(".spotify_genrelist");
const tabs = document.querySelectorAll(".spotify_tab");
const sectionEl = document.querySelector(".spotify");
const panelEl = document.querySelector(".spotify_panel");

// ===== Useful functions =====

// Remove special caracters
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// "1 stream" singular, "2 streams" plural
function playsLabel(plays) {
  return `${plays} stream${plays > 1 ? "s" : ""}`;
}

// "2026-10-13" becomes "13 Oct"
// "T00:00:00" forces local reading, without time zone 
function formatDate(isoDate) {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-BE", {
    day: "numeric",
    month: "short"
  });
}

// "2026-10-13/2026-10-20" becomes "13 Oct → 20 Oct"
function formatPeriod(range) {
  const [start, end] = range.split("/");
  return `${formatDate(start)} → ${formatDate(end)}`;
}

// ===== Render of the 4 blocks =====

function renderTracks(tracks) {
  // N°1 as a hero
  const [first, ...others] = tracks;

  heroEl.innerHTML = first
    ? `
      <img class="spotify_hero_cover" src="${escapeHtml(first.cover)}" alt="" width="300" height="300" loading="lazy">
      <p class="spotify_hero_name" title="${escapeHtml(first.name)}">${escapeHtml(first.name)}</p>
      <p class="spotify_hero_artist">${escapeHtml(first.artist)}</p>
      <p class="spotify_hero_plays">${playsLabel(first.plays)}</p>
    `
    : "";

  tracklistEl.innerHTML = others
    .map(
      (track) => `
      <li class="spotify_track">
        <img class="spotify_track_cover" src="${escapeHtml(track.cover)}" alt="" width="40" height="40" loading="lazy">
        <div class="spotify_track_text">
          <p class="spotify_track_name" title="${escapeHtml(track.name)}">${escapeHtml(track.name)}</p>
          <p class="spotify_track_artist">${escapeHtml(track.artist)}</p>
        </div>
        <span class="spotify_plays">${track.plays}</span>
      </li>
    `
    )
    .join("");
}

function renderArtists(artists) {
  artistlistEl.innerHTML = artists
    .map(
      (artist) => `
      <li class="spotify_artist_item">
        <img class="spotify_artist_image" src="${escapeHtml(artist.image)}" alt="" width="120" height="120" loading="lazy">
        <p class="spotify_artist_name" title="${escapeHtml(artist.name)}">${escapeHtml(artist.name)}</p>
        <p class="spotify_artist_plays">${playsLabel(artist.plays)}</p>
      </li>
    `
    )
    .join("");
}

function renderAlbums(albums) {
  albumlistEl.innerHTML = albums
    .map(
      (album) => `
      <li class="spotify_album">
        <img class="spotify_album_cover" src="${escapeHtml(album.cover)}" alt="" width="200" height="200" loading="lazy">
        <p class="spotify_album_name" title="${escapeHtml(album.name)}">${escapeHtml(album.name)}</p>
        <p class="spotify_album_artist">${escapeHtml(album.artist)}</p>
        <p class="spotify_album_plays">${playsLabel(album.plays)}</p>
      </li>
    `
    )
    .join("");
}

function renderGenres(genres) {
  // Normalize genre
  // "0" in Math.max avoids -Infinity if empty list
  const max = Math.max(...genres.map((genre) => genre.plays), 0);

  genrelistEl.innerHTML = genres
    .map((genre) => {
      const value = max > 0 ? Math.round((genre.plays / max) * 100) : 0;
      return `
      <li class="spotify_genre">
        <span class="spotify_genre_name">${escapeHtml(genre.name)}</span>
        <span class="spotify_genre_bar" style="--value: ${value}"></span>
        <span class="spotify_genre_count">${genre.plays}</span>
      </li>
    `;
    })
    .join("");
}

// Fills the section with the data
// "period" is "week" or "month", same as the period key in the JSON 
function renderPeriod(data, period) {
  periodEl.textContent = formatPeriod(data[period]);
  renderTracks(data.top_tracks);
  renderArtists(data.top_artists);
  renderAlbums(data.top_albums);
  renderGenres(data.top_genres);
}

// ===== Animations =====

// Fade
function playFade() {
  panelEl.classList.remove("spotify_fade");
  void panelEl.offsetWidth;
  panelEl.classList.add("spotify_fade");
}

// ===== Data loading =====

async function loadPeriod(period) {
  try {
    // Add to cache
    if (!spotifyCache[period]) {
      const response = await fetch(SPOTIFY_FILES[period]);
      if (!response.ok) {
        throw new Error(`Réponse HTTP ${response.status}`);
      }
      spotifyCache[period] = await response.json();
    }
    renderPeriod(spotifyCache[period], period);

    if (!sectionEl.classList.contains("spotify_ready")) {
      // First load, cascading blocks
      sectionEl.classList.add("spotify_ready");
    } else {
      // Tab change, simple fade
      playFade();
    }
  } catch (error) {
    console.error("Spotify : chargement impossible", error);
    periodEl.textContent = "Données indisponibles pour le moment.";
  }
}

// ===== Week/Month Tab =====

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Cliquer sur l'onglet déjà actif ne doit pas relancer le fondu
    if (tab.classList.contains("spotify_tab_active")) return;

    tabs.forEach((other) => {
      const isActive = other === tab;
      other.classList.toggle("spotify_tab_active", isActive);
      other.setAttribute("aria-selected", isActive);
    });
    loadPeriod(tab.dataset.period);
  });
});

// When loading display week
loadPeriod("week");
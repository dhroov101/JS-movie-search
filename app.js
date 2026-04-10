const BASE_URL = 'https://api.themoviedb.org/3'
const IMG_BASE  = 'https://image.tmdb.org/t/p/w300'

const searchInput = document.querySelector('#search-input')
const resultsGrid = document.querySelector('#results')
const statusDiv   = document.querySelector('#status')

function showStatus(message) {
  statusDiv.textContent = message
  statusDiv.classList.remove('hidden')
}

function hideStatus() {
  statusDiv.classList.add('hidden')
}

async function fetchMovies(query) {
  const url = `${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&include_adult=false`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Network error: ${response.status}`)
  }

  const data = await response.json()

  if (data.results.length === 0) {
    throw new Error('No results found.')
  }

  return data.results
}

function createCard({ title, name, release_date, first_air_date, poster_path, id, media_type }) {
  const displayTitle = title ?? name
  const year = (release_date ?? first_air_date ?? '').slice(0, 4)
  const poster = poster_path
    ? `${IMG_BASE}${poster_path}`
    : null

  return `
    <div class="movie-card" data-id="${id}" data-type="${media_type}">
      ${poster
        ? `<img src="${poster}" alt="${displayTitle}" loading="lazy">`
        : `<div class="poster-placeholder">${displayTitle.slice(0, 2).toUpperCase()}</div>`
      }
      <div class="card-info">
        <p class="card-title">${displayTitle}</p>
        <div class="card-meta">
          <span class="card-year">${year || 'Unknown'}</span>
          <span class="card-type">${media_type === 'tv' ? 'TV' : 'Film'}</span>
        </div>
      </div>
    </div>
  `
}

function renderMovies(movies) {
  const filtered = movies.filter(m => m.media_type === 'movie' || m.media_type === 'tv')

  if (filtered.length === 0) {
    showStatus('No movies or shows found.')
    return
  }

  showStatus(`${filtered.length} result${filtered.length > 1 ? 's' : ''}`)

  resultsGrid.innerHTML = filtered.map(createCard).join('')
}

function showSkeletons() {
  const skeletons = Array.from({ length: 8 }, () => `
    <div class="movie-card skeleton">
      <div class="skeleton-poster"></div>
      <div class="card-info">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>
  `).join('')
  resultsGrid.innerHTML = skeletons
}

async function handleSearch(query) {
  const trimmed = query.trim()

  if (trimmed.length < 2) {
    hideStatus()
    resultsGrid.innerHTML = ''
    return
  }

  showSkeletons()
  hideStatus()

  try {
    const movies = await fetchMovies(trimmed)
    renderMovies(movies)
  } catch (error) {
    resultsGrid.innerHTML = ''
    showStatus(error.message)
  }
}

searchInput.addEventListener('input', (event) => {
  handleSearch(event.target.value)
})

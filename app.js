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

function renderMovies(movies) {
  const filtered = movies.filter(m => m.media_type === 'movie' || m.media_type === 'tv')

  const html = filtered.map(({ title, name, release_date, first_air_date, poster_path, id, media_type }) => {
    const displayTitle = title ?? name
    const year = (release_date ?? first_air_date ?? '').slice(0, 4)
    const poster = poster_path
      ? `${IMG_BASE}${poster_path}`
      : 'https://placehold.co/300x450?text=No+Poster'

    return `
      <div class="movie-card" data-id="${id}" data-type="${media_type}">
        <img src="${poster}" alt="${displayTitle}" loading="lazy">
        <div class="card-info">
          <p class="card-title">${displayTitle}</p>
          <p class="card-year">${year}</p>
        </div>
      </div>
    `
  }).join('')

  resultsGrid.innerHTML = html || '<p style="color:#888;font-size:0.9rem">No movies or shows found.</p>'
}

async function handleSearch(query) {
  const trimmed = query.trim()

  if (trimmed.length < 2) {
    hideStatus()
    resultsGrid.innerHTML = ''
    return
  }

  showStatus('Searching...')
  resultsGrid.innerHTML = ''

  try {
    const movies = await fetchMovies(trimmed)
    hideStatus()
    renderMovies(movies)
  } catch (error) {
    showStatus(error.message)
  }
}

searchInput.addEventListener('input', (event) => {
  handleSearch(event.target.value)
})

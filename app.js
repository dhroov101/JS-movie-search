const searchInput = document.querySelector('#search-input')
const resultsGrid = document.querySelector('#resuls')
const statusDiv = document.querySelector('#status')

function showStatus(message) {
  statusDiv.textContent = message
  statusDiv.classList.remove('hidden')
}

function hideStatus() {
  statusDiv.classList.add('hidden')
}

function handleSearch(query) {
  const trimmed = query.trim()

  if (trimmed.length < 2) {
    hideStatus()
    resultsGrid.innerHTML = ''
    return
  }

  showStatus(`Searching for "${trimmed}"...`)
  console.log('will search for:', trimmed)
}

searchInput.addEventListener('input', (event) => {
  handleSearch(event.target.value)
})
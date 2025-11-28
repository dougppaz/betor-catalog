const openModal = (bodyElem, torrentElem) => {
  const torrentName = torrentElem.dataset.torrentName
  const torrentMagnetUri = torrentElem.dataset.torrentMagnetUri
  const torrentFiles = torrentElem.dataset.torrentFiles ? torrentElem.dataset.torrentFiles.split(';') : []

  console.log('open model...', { torrentName, torrentMagnetUri, torrentFiles })

  // modal element
  const modalElem = document.createElement('div')
  modalElem.classList.add('modal')
  const filesContent = torrentFiles ? `
    <h2>Arquivos:</h2>
    <ul class="files">
      ${torrentFiles.map((fileName) => (`<li>${fileName}</li>`)).join('')}
    </ul>
  ` : ''
  modalElem.innerHTML = `
    <div class="close"></div>
    <div class="modal-content">
      <h1>${torrentName}</h1>
      ${filesContent}
      <div class="download">
        <a href="${torrentMagnetUri}">Download</a>
      </div>
    </div>
  `

  // close
  const closeFn = () => {
    modalElem.remove()
    document.removeEventListener('keydown', keydownListener)
  }
  const keydownListener = (event) => {
    if (event.key === 'Escape') {
      closeFn()
    }
  }
  const closeElem = document.createElement('button')
  closeElem.addEventListener('click', closeFn)
  closeElem.innerText = '✖'
  modalElem.querySelector('.close').appendChild(closeElem)
  document.addEventListener('keydown', keydownListener)

  // append
  bodyElem.appendChild(modalElem)
}

(() => {
  const bodyElem = document.querySelector('body')
  document.querySelectorAll('[data-torrent]').forEach((torrentElem) => {
    torrentElem.addEventListener('click', () => {
      openModal(bodyElem, torrentElem)
    })
    torrentElem.classList.add('cursor-pointer')
  })
})()

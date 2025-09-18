const simpleHash = (value) => {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0
  }
  return (hash >>> 0).toString(32)
}

module.exports = { simpleHash }

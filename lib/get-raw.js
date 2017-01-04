module.exports = function getRaw (docs) {
  if (!docs) return
  if (docs instanceof Array) return docs.map((doc) => doc.rawData)
  return docs.rawData
}

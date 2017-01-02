const cpy = require('cpy')

const assets = [
  {
    module: 'basscss',
    path: 'css',
    filenames: 'basscss.min.css'
  },
  {
    module: 'toastr',
    path: 'build',
    filenames: 'toastr.min.css'
  },
  {
    module: 'animate.css',
    path: '',
    filenames: 'animate.min.css'
  }
]

Promise.all(assets.map((asset) => {
  console.log(`\nCopying from ${asset.module}...`)
  const srcPaths = asset.filenames
    ? (
      asset.filenames instanceof Array
        ? asset.filenames.map((filename) => `./node_modules/${asset.module}/${asset.path}/${filename}`)
        : [`./node_modules/${asset.module}/${asset.path}/${asset.filenames}`]
    )
    : [`./node_modules/${asset.module}/${asset.path}`]
  const dest = `./static/${asset.module}/`
  return cpy(srcPaths, dest)
}))
  .then(() => cpy('./styles.css', './static/styles.css'))
  .then(() => console.log(`\nDone`))

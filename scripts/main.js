const { canvas, ctx } = createCanvasContext(innerWidth, innerHeight)
let width  = canvas.width
let height = canvas.height

let source = document.createElement('video')
const oCanvas = document.createElement('canvas') // off screen canvas
const oCtx = oCanvas.getContext('2d')            // off screen canvas' context
let resultImage

// Palette to be used in the result image
const palettes = [
  [],
]

// Use webcam as source for effect
// otherwise, use example.jpeg
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(rawData => {
    source.srcObject = rawData
    source.play()
    source.onloadeddata = () => {
      oCanvas.width  = source.videoWidth
      oCanvas.height = source.videoHeight
      draw()
    }
  }).catch(err => {
    const image = loadImage('images/example.jpeg', () => {
      source = image
      oCanvas.width  = source.width
      oCanvas.height = source.height
      draw()
    })
  })

// File upload handling
const uploadImage = document.getElementById('upload-image')
uploadImage.addEventListener('change', () => {
  const file = uploadImage.files[0]

  if (!file.type.match(/image-*/))
    return alert('Invalid format')

  const image = loadImage(URL.createObjectURL(file), () => {
    source = image
    oCanvas.width  = source.width
    oCanvas.height = source.height
  })
})

// Download handling
const downloadImage = document.getElementById('download-image')
downloadImage.addEventListener('click', () => {
  const anchor = document.createElement('a')
  anchor.download = 'image.png'
  anchor.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
  anchor.click()
})

let processor = (pixel, i, pixels) => {
  pixel[0] *= 1
  pixel[1] *= 1
  pixel[2] *= 1
  return pixel
}

async function draw() {
  useContext(oCtx)
  drawImage(source, 0, 0, oCanvas.width, oCanvas.height)

  resultImage = oCanvas
  resultImage = await iP_pixelateImage(resultImage, 200) // Change the resolution to maximum n pixels
  resultImage = await iP_decreasePalette(resultImage, 2) // Snap colors' components to a value multiple of n
  resultImage = await iP_usePalette(resultImage, palettes[0]) // Use a palette for the colors of the image
  resultImage = await iP_forEachPixelNormalized(resultImage, processor)
  // resultImage = await iP_decreasePalette(resultImage, 32)

  // Scaling canvas properly to the screen
  canvas.width  = innerWidth
  canvas.height = innerHeight
  const scale = innerWidth / oCanvas.width < innerHeight / oCanvas.height ? innerWidth / oCanvas.width : innerHeight / oCanvas.height
  canvas.width  = width  = oCanvas.width * scale
  canvas.height = height = oCanvas.height * scale

  ctx.imageSmoothingEnabled  = false
  oCtx.imageSmoothingEnabled = false

  useContext(ctx)
  background('#000')  
  drawImage(resultImage, 0, 0, width, height)

  requestAnimationFrame(draw)
}
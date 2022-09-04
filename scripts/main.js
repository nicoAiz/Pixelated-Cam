const { canvas, ctx } = createCanvasContext(innerWidth, innerHeight)
let width  = canvas.width
let height = canvas.height

let source = document.createElement('video')
const oCanvas = document.createElement('canvas')
const oCtx = oCanvas.getContext('2d')
let resultImage

// Does nothing at the moment...
const palette = new Array(256).fill([0, 0, 0]).map(i => i.map(c => random(255)))

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
      oCanvas.width  = image.width
      oCanvas.height = image.height
      draw()
    })
  })

async function draw() {
  useContext(oCtx)
  drawImage(source, 0, 0, oCanvas.width, oCanvas.height)

  resultImage = await iP_pixelateImage(oCanvas, 0.16) // Lower the resolution by 0.16
  resultImage = await iP_decreasePalette(resultImage, 48) // 'Snap' colors to a palette of size 48
  resultImage = await iP_usePalette(resultImage, []) // 'Snap' colors to a palette, currently unused

  // Scaling canvas properly to the screen
  canvas.width  = width  = innerWidth
  canvas.height = height = innerHeight
  const scale = width / oCanvas.width < height / oCanvas.height ? width / oCanvas.width : height / oCanvas.height

  ctx.imageSmoothingEnabled  = false
  oCtx.imageSmoothingEnabled = false

  useContext(ctx)
  background('#000')  
  drawImage(resultImage, (width - oCanvas.width * scale) / 2, (height - oCanvas.height * scale) / 2, oCanvas.width * scale, oCanvas.height * scale)
  draw()
}
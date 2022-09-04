const { canvas, ctx } = createCanvasContext(innerWidth, innerHeight)
const width  = canvas.width
const height = canvas.height
ctx.imageSmoothingEnabled = false

let video = document.createElement('video')
const oCanvas = document.createElement('canvas')
const oCtx = oCanvas.getContext('2d')
let resultImage

// Does nothing at the moment...
const palette = new Array(256).fill([0, 0, 0]).map(i => i.map(c => random(255)))

// Use webcam as source for effect
// otherwise, use example.jpeg
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(rawData => {
    video.srcObject = rawData
    video.play()
    video.onloadeddata = () => {
      oCanvas.width  = video.videoWidth
      oCanvas.height = video.videoHeight
      draw()
    }
  }).catch(err => {
    const image = loadImage('images/example.jpeg', () => {
      video = image
      oCanvas.width  = image.width
      oCanvas.height = image.height
      draw()
    })
  })

async function draw() {
  useContext(oCtx)
  drawImage(video, 0, 0, oCanvas.width, oCanvas.height)

  resultImage = await iP_pixelateImage(oCanvas, 0.16) // Lower the resolution by 0.16
  resultImage = await iP_decreasePalette(resultImage, 48) // 'Snap' colors to a palette of size 48
  resultImage = await iP_usePalette(resultImage, []) // 'Snap' colors to a palette, currently unused

  // Draw the result image scaled to screen
  const scale = height / oCanvas.height
  useContext(ctx)
  background('#000')  
  drawImage(resultImage, (width - oCanvas.width * scale) / 2, 0, oCanvas.width * scale, oCanvas.height * scale)
  draw()
}
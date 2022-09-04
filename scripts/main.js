const { canvas, ctx } = createCanvasContext(innerWidth, innerHeight)
const width  = canvas.width
const height = canvas.height
ctx.imageSmoothingEnabled = false

let video = document.createElement('video')
const oCanvas = document.createElement('canvas')
const oCtx = oCanvas.getContext('2d')

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

  // Lower the resolution
  let newImage = iP_pixelateImage(oCanvas, 0.16)
  newImage.onload = () => {
    // Decrease color space
    newImage = iP_decreasePalette(newImage, 48)
    newImage.onload = () => {
      // Set new palette, currently unused
      newImage = iP_usePalette(newImage, [])
      newImage.onload = () => {
        // Draw the result image scaled to screen
        const scale = height / oCanvas.height
        useContext(ctx)
        background('#000')  
        drawImage(newImage, (width - oCanvas.width * scale) / 2, 0, oCanvas.width * scale, oCanvas.height * scale)
        draw()
      }
    }
  }
}
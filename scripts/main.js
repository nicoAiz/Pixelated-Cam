const { canvas, ctx } = createCanvasContext(innerWidth, innerHeight)
const width  = canvas.width
const height = canvas.height
ctx.imageSmoothingEnabled = false

const video = document.createElement('video')
const oCanvas = document.createElement('canvas')
let oCtx

const pal = new Array(256).fill([0, 0, 0]).map(i => i.map(c => random(255)))

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(rawData => {
    video.srcObject = rawData
    video.play()
    video.onloadeddata = () => {
      oCanvas.width  = video.videoWidth
      oCanvas.height = video.videoHeight
      oCtx = oCanvas.getContext('2d')
      requestAnimationFrame(draw)
    }
  }).catch(err => console.error(err))

function draw() {
  useContext(oCtx)
  drawImage(video, 0, 0, oCanvas.width, oCanvas.height)

  let newImage = pixelateImage(oCanvas, 0.15)
  newImage.onload = () => {
    newImage = decreasePalette(newImage, 58)
    newImage.onload = () => {
      newImage = usePalette(newImage, [])
      newImage.onload = () => {
        useContext(ctx)
        background('#000')  

        const scale = height / oCanvas.height
        const pikachuCenter = getPixelsClusterCenter(newImage, 192, 192, 96, 10000)

        pikachuCenter[0] *= oCanvas.width * scale / newImage.width
        pikachuCenter[1] *= oCanvas.height * scale / newImage.height

        const offsetX = oCanvas.width * scale * 0.5 - pikachuCenter[0]
        const offsetY = oCanvas.height * scale * 0.5 - pikachuCenter[1]
        drawImage(newImage, offsetX + (width - oCanvas.width * scale) / 2, offsetY, oCanvas.width * scale, oCanvas.height * scale)

        requestAnimationFrame(draw)
      }
    }
  }
}
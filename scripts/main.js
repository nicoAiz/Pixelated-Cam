const { canvas, ctx } = createCanvasContext(innerWidth, innerHeight)
let width  = canvas.width
let height = canvas.height

let source = document.createElement('video')
source.setAttribute('autoplay', '')
source.setAttribute('muted', '')
source.setAttribute('playsinline', '')
const oCanvas = document.createElement('canvas') // off screen canvas
const oCtx = oCanvas.getContext('2d')            // off screen canvas' context
let resultImage
let fallbackImage

// Generates a random palette of n colors
function randomPalette(colors = 100) {
  return new Array(colors).fill([0, 0, 0]).map(i => i.map(c => random(255)))
}

// Palette to be used in the result image
const palettes = [
  [],
  [[222,57,95],[176,230,38],[222,45,84],[44,155,128],[37,178,72],[190,170,172],[86,139,213],[185,253,189],[85,8,63],[134,64,154],[195,232,40],[114,140,55],[115,178,74],[195,96,115],[69,69,248],[86,37,243],[43,114,134],[99,24,221],[140,228,180],[76,64,11],[164,180,37],[15,47,112],[147,130,13],[113,152,9],[197,6,244],[24,196,123],[175,254,252],[199,253,215],[98,19,241],[147,196,102],[201,202,72],[247,52,230],[167,0,68],[236,253,235],[200,115,44],[100,58,172],[63,150,222],[116,52,198],[165,12,217],[179,193,60],[144,98,129],[84,222,248],[233,133,29],[173,224,12],[108,150,11],[173,215,13],[52,39,33],[207,252,39],[85,211,198],[214,95,193],[251,177,119],[36,0,244],[151,235,139],[195,229,13],[74,91,121],[154,123,127],[142,55,130],[228,127,152],[18,83,213],[145,61,0],[199,18,117],[171,185,177],[219,187,190],[132,188,137]],
  randomPalette(),randomPalette(),randomPalette(),randomPalette(),randomPalette(),randomPalette()
]

let currentPalette = 0

document.addEventListener('dblclick', e => {
  currentPalette = (currentPalette + 1) % palettes.length
}, true)

let running = false

// Use webcam as source for effect
// otherwise, use example.jpeg
function initCamera(facing) {
  const constraints = {
    video: {
      facingMode: facing
    },
    audio: false
  }
  
  navigator.mediaDevices.getUserMedia(constraints)
    .then(rawData => {
      source.srcObject = rawData
      source.play()
      source.onloadeddata = () => {
        oCanvas.width  = source.videoWidth
        oCanvas.height = source.videoHeight
        !running && draw()
      }
    }).catch(err => {
      alert(err)
      const image = loadImage('images/example.jpeg', () => {
        fallbackImage = image
        oCanvas.width  = source.width
        oCanvas.height = source.height
        !running && draw()
      })
    })
}

let cameraFacingMode = localStorage.getItem('facingMode') || 'environment'
initCamera(cameraFacingMode)

// Switch bewteen front-back camera
const switchCamera = document.getElementById('turn-camera')
switchCamera.addEventListener('click', () => {
  localStorage.setItem('facingMode', cameraFacingMode === 'environment' ? 'user' : 'environment')
  location.reload()
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
const flash = document.querySelector('.flash')
const downloadImage = document.getElementById('download-image')
downloadImage.addEventListener('click', () => {
  const anchor = document.createElement('a')
  anchor.download = 'image.png'
  anchor.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
  anchor.click()
  flash.classList.add('take-picture')
  setTimeout(() => flash.classList.remove('take-picture'), 500)
})

let processor = (pixel, i, pixels) => {
  pixel[0] *= 1
  pixel[1] *= 1.02
  pixel[2] *= 1.07
  return pixel
}

async function draw() {
  running = true
  useContext(oCtx)
  drawImage(source ?? fallbackImage, 0, 0, oCanvas.width, oCanvas.height)

  resultImage = oCanvas
  resultImage = await iP_pixelateImage(resultImage, 100) // Change the resolution to maximum n pixels
  resultImage = await iP_decreasePalette(resultImage, 16) // Snap colors' components to a value multiple of n
  resultImage = await iP_forEachPixelNormalized(resultImage, processor)
  resultImage = await iP_usePalette(resultImage, palettes[currentPalette]) // Use a palette for the colors of the image
  // resultImage = await iP_decreasePalette(resultImage, 32)

  // Scaling canvas properly to the screen
  canvas.width  = innerWidth
  canvas.height = innerHeight
  const scale = innerHeight / oCanvas.height
  canvas.width  = width  = oCanvas.width * scale
  canvas.height = height = oCanvas.height * scale

  ctx.imageSmoothingEnabled  = false
  oCtx.imageSmoothingEnabled = false

  useContext(ctx)
  drawImage(resultImage, 0, 0, width, height)

  requestAnimationFrame(draw)
}
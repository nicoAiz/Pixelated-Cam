// Gustavo Nicoletti

// Common use functions library
// v0.1.0 [30/07/2022]
// v0.1.1 [28/08/2022]
// v0.1.2 [04/09/2022]
// - Fixed n-dimensional distance function
// - Added n-dimensional distance squared function

// Common DOM and loading functions
// Loads an image
function loadImage(src, callback = ()=>{}) {
  const img = new Image()
  img.src = src
  img.onload = () => callback(img)
  img.onerror = () => callback(img)
  return img
}

// Same as above, but async
async function loadImageAsync(src) {
  return new Promise((resolve, reject) => {
    let image = new Image()
    image.src = src
    image.decode().then(() => resolve(image))
      .catch(reject)
  })
}

// Loads a list of images
function loadImages(imagesList, callback = ()=>{}, imagesLoaded = []) {
  if (imagesList.length === 0) return callback(imagesLoaded)

  loadImage(imagesList.shift(), img => {
    imagesLoaded.push(img)
    loadImages(imagesList, callback, imagesLoaded)
  })
}

// Same as above, but async
async function loadImagesAsync(imagesList, callback = ()=>{}, imagesLoaded = []) {
  if (imagesList.length === 0) return callback(imagesLoaded)

  await loadImageAsync(imagesList.shift())
    .then(img => {
      imagesLoaded.push(img)
      loadImagesAsync(imagesList, callback, imagesLoaded)
    }, () => console.error('Image could not be loaded.'))
}

// Loads a script
function loadScript(src, callback = ()=>{}) {
  const scriptEl = document.createElement('script')
  scriptEl.src = src
  scriptEl.defer = true
  scriptEl.onload = () => callback(scriptEl)
  scriptEl.onerror = () => callback(scriptEl)
  document.head.append(scriptEl)
}

// Loads a list of scripts
function loadScripts(scriptsList, callback = ()=>{}, scriptsLoaded = []) {
  if (scriptsList.length === 0) return callback(scriptsLoaded)

  loadScript(scriptsList.shift(), script => {
    scriptsLoaded.push(script)
    loadScripts(scriptsList, callback, scriptsLoaded)
  })
}

// Deletes all event listeners from an element
function removeAllListeners(element) {
  const cloned = element.cloneNode(true)
  element.parentNode.replaceChild(cloned, element)
  element.remove()
  return cloned
}

// Creates an element
const createElement = ({ classes = ['easyJS-element'], tag = 'div'} = {}, append = false)=>{
  const element = document.createElement(tag)
  element.classList.add(...classes)
  if (append === true) document.body.append(element)
  return element
}

// Creates a Canvas element
const createCanvas = ({ classes = ['easyJS-canvas'], width = 256, height = 256} = {}, append = false)=>{
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.classList.add(...classes)
  if (append === true) document.body.append(canvas)
  return canvas
}

// Creates a Button element
const createButton = ({ classes = ['easyJS-button'], text = '', onclick = () => {console.log('Button pressed!')}} = {}, append = false)=>{
  const button = document.createElement('button')
  button.innerText = text
  button.onclick = onclick
  button.classList.add(...classes)
  if (append === true) document.body.append(button)
  return button
}

// Creates a P element
const createP = ({ classes = ['easyJS-p'], text = ''} = {}, append = false)=>{
  const p = document.createElement('p')
  p.innerText = text
  p.classList.add(...classes)
  if (append === true) document.body.append(p)
  return p
}

// Creates a Input[range] element
const createSlider = ({ classes = ['easyJS-slider'], min = 0, max = 10, value = 0} = {}, append = false)=>{
  const slider = document.createElement('input')
  slider.type = 'range'
  slider.min = min
  slider.max = max
  slider.value = value
  slider.classList.add(...classes)
  slider.oninput = () => value = slider.value
  if (append === true) document.body.append(slider)
  return {
    element: slider,
    getValue() {
      return value
    }
  }
}

// Creates a divider (spacing element)
function createDivider(parent) {
  const divider = createElement('div')
  divider.style = `
    margin: 1rem 2rem;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #444;`
  parent.append(divider)
}

function createAnchor(href) {
  const anchor = createElement('a')
  anchor.href = href
  return anchor
}

function imageDataToImage(imageData) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = imageData.width
  canvas.height = imageData.height
  ctx.putImageData(imageData, 0, 0)

  const image = new Image()
  image.src = canvas.toDataURL()
  return image
}

// Common Math functions
// Linear interpolation
function lerp(a, b, t) {
  return a + (b - a) * t
}

// Converts degree to radians
function radians(deg) {
  if (deg < 0) deg = 360 + deg
  if (deg >= 360) deg = deg - 360
  return deg * Math.PI / 180
}

// Converts radians to degree
function degree(rad) {
  return rad / Math.PI * 180
}

// Returns if a value is in a range
function inRange(value, min, max) {
  return (value >= min && value <= max)
}

// Returns the sign of a number
function sign(n) {
  return n > 0 ? 1 : -1
}

function signMin(n) {
  return n > 0 ? 0.00001 : -0.00001
}

// Clamps a value to a range
function clamp(value, min, max) {
  return value < min ? min : value > max ? max : value
}

// Maps a range to another range
function map(value, min, max, toMin, toMax) {
  return toMin + (value - min) / (max - min) * (toMax - toMin)
}

// Math constants
const PI = Math.PI
const TWO_PI = 2 * PI
const SQRT2 = Math.SQRT2
const SQRT1_2 = Math.SQRT1_2
const RADIANS_1 = radians(1)
const RADIANS_30 = radians(30)
const RADIANS_45 = radians(45)
const RADIANS_60 = radians(60)
const RADIANS_90 = radians(90)
const RADIANS_135 = radians(135)
const RADIANS_180 = radians(180)
const RADIANS_225 = radians(225)
const RADIANS_270 = radians(270)
const RADIANS_315 = radians(315)
const RADIANS_MAX = radians(359.999)

// Math functions
const abs = Math.abs
const min = Math.min
const max = Math.max
const sign2 = Math.sign
const trunc = Math.trunc
const floor = Math.floor
const round = Math.round
const ceil = Math.ceil
const cos = Math.cos
const sin = Math.sin
const tan = Math.tan
const acos = Math.acos
const asin = Math.asin
const atan = Math.atan
const atan2 = Math.atan2
const sqrt = Math.sqrt
const cbrt = Math.cbrt
const hypot = Math.hypot

// Returns the angle from one point (x1, y1) to another point (x2, y2)
function pointToDirection(x1, y1, x2, y2) {
  let theta = -atan2(y2 - y1, x2 - x1)
  return theta < 0 ? theta + TWO_PI : theta
}

// Same as above, another implementation, in degrees
function pointToDirection2(cx, cy, ex, ey) {
  let dy = ey - cy
  let dx = ex - cx
  let theta = -Math.atan2(dy, dx)
  theta *= 180 / Math.PI
  if (theta < 0) theta = 360 + theta
  return theta
}

// Same as above, another implementation, in radians
function pointToDirection3(x1, y1, x2, y2) {
  let n = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
  let w = (x2 - x1) / n
  return (Math.acos(w) * 180 / Math.PI * (y1 > y2 ? 1 : -1) || 0) * Math.PI / 180
}

// Returns the distance between two points in 2D
function distance(x1, y1, x2, y2) {
  if (['Object', 'Vector2'].includes(x1.constructor.name))
    return (y1 == null
      ? distance(0, 0, x1.x, x1.y)
      : distance(x1.x, x1.y, y1.x, y1.y))
    
  return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
}

// Same as above, but squared
function distanceSquared(x1, y1, x2, y2) {
  return (x2 - x1)**2 + (y2 - y1)**2
}

// Returns the distance between two points in N dimensions
function distanceND(p1, p2) {
  const length = p1.length
  let sum = 0
  
  for (let i = 0; i < length; i++)
    sum += (p1[i] - p2[i]) ** 2

  return Math.sqrt(sum)
}

// Same as above, but squared
function distanceNDSquared(p1, p2) {
  const length = p1.length
  let sum = 0
  
  for (let i = 0; i < length; i++)
    sum += (p1[i] - p2[i]) ** 2

  return sum
}

// Common random and array/object functions
// Creates a 2D Array
function createArray2D(cols, rows, placeholder = null) {
  const arr = []

  for (let i = 0; i < rows; i++) {
    arr[i] = []
    for (let j = 0; j < cols; j++)
      if (placeholder instanceof Function) arr[i][j] = placeholder()
      else arr[i][j] = placeholder
  }

  return arr
}

// Axis Aligned Bounding Box intersection detection
function aabb(x1, y1, w1, h1, x2, y2, w2, h2) {
  return (x1 + w1) > x2 && x1 < (x2 + w2) && (y1 + h1) > y2 && y1 < (y2 + h2)
}

// Simple helpers for miscellaneous utilities
const xy = (x,y) => ({x,y})
const getClass = object => object.constructor.name

/**
 * Compare two values/objects/arrays.
 * @param  {Any} value1 The first value.
 * @param  {Any} value2 The second value.
 * @return {Boolean} The equality between two values (casting types).
 */
 function equals(value1, value2) {
  // Handles numbers, strings and strings
  if (['Number', 'String', 'Boolean'].includes(value1.constructor.name)) return value1 == value2

  // Handles arrays
  if (value1.constructor.name === 'Array' && value2.constructor.name === 'Array') {
    if (value1.length != value2.length) return false

    for (let i in value1)
      if (!equals(value1[parseInt(i)], value2[parseInt(i)])) return false
    return true
  }

  // Handles objects
  if (value1.constructor.name != value2.constructor.name) return false
  if (Object.keys(value1).length != Object.keys(value2).length) return false

  for (let key in value1) {
    if (!value2.hasOwnProperty(key)) return false
    if (!equals(value1[key], value2[key])) return false
  }

  return true
}

function average(a, b) {
  if (typeof a != 'number') a = parseFloat(a)
  if (typeof b != 'number') b = parseFloat(b)
  return (a + b) / 2
}

function random(foo) {
  if (foo == null) return Math.random()

  if (typeof foo === 'number') {
    if (arguments.length === 2) return random(arguments[1] - arguments[0]) + arguments[0]
    return Math.random() * foo
  }

  if (typeof foo === 'string') return foo[Math.floor(Math.random() * foo.length)]

  switch (foo.constructor.name) {
    case 'Array':
      return foo[Math.floor(Math.random() * foo.length)]
      
    default:
      foo = Object.values(foo)
      return foo[Math.floor(Math.random() * foo.length)]
  }
}

function randomInt(number) {
  const r = random(number)

  if (typeof r != 'number') return 0
  if (arguments.length === 2) return floor(random(number, arguments[1]))
  return Math.floor(r)
}

function isVowel(char) {
  return VOWELS.includes(char.toLowerCase())
}

function count(str, func) {
  let counter = 0

  for (let c of str)
    if (func(c) === true) counter++
  return counter
}

function setCharAt(str, index, char) {
  if (index > str.length - 1) return str
  return str.substring(0, index) + char + str.substring(index + 1)
}

function randomColorHSL(format) {
  if (format == null) return `hsl(${randomInt(360)}, ${randomInt(100)}%, 50%)`

  let str = 'hsl('

  format.split(',').forEach((place, i) => {
    switch (place[0]) {
      case '_':
        if (i === 0) str += randomInt(360)
        else str += randomInt(100) + '%'
      break
      case '-':
        if (i === 0) str += randomInt(180)
        else str += randomInt(50) + '%'
      break
      case '[':
        const interval = place
          .substring(1, place.length - 1)
          .split('-')
          .map(i => parseInt(i))

        if (i === 0) str += clamp(randomInt(interval[0], interval[1]), 0, 360)
        else str += clamp(randomInt(interval[0], interval[1]), 0, 100) + '%'
      break
      default:
        str += place
    }

    if (i < 2) str += ','
  })

  str += ')'

  return str
}

function randomColorHSL2(format) {
  if (format == null) return [random(), random(), 0.5]

  let color = []

  format.split(',').forEach((place, i) => {
    switch (place[0]) {
      case '_':
        if (i === 0) color.push(randomInt(360))
        else color.push(randomInt(100))
      break
      case '-':
        if (i === 0) color.push(randomInt(180))
        else color.push(randomInt(50))
      break
      case '[':
        const interval = place
          .substring(1, place.length - 1)
          .split('-')
          .map(i => parseInt(i))

        if (i === 0) color.push(clamp(randomInt(interval[0], interval[1]), 0, 360))
        else color.push(clamp(randomInt(interval[0], interval[1]), 0, 100))
      break
    }
  })

  return color
}

function copyToClipboard(text, success, fail) {
  navigator.clipboard.writeText(text).then(success, fail)
}

function getMousePosition(e) {
  return {
    x: e.clientX,
    y: e.clientY
  }
}

function getScreenPosition(el) {
  return el.getBoundingClientRect()
}

function isOneOf(a, ...these) {
  return these.includes(a)
}

function anyOf(...these) {
  return random(these)
}

function everyFrame(callback) {
  requestAnimationFrame((t) => {
    callback(t)
    requestAnimationFrame(() => everyFrame(callback))
  })
}

function lastItem(arr) {
  return arr[arr.length - 1]
}
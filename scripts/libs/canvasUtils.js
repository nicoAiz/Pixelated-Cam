// Gustavo Nicoletti

// Common canvas functions library
// v0.1.0 [18/08/2022]
// v0.1.1 [18/08/2022]
// - Added "function overload" to use objects instead of x1, y1, ..., xn, yn

let _ctx = {}

const anglesCache = {
  COS45: Math.cos(45 * Math.PI / 180),
  COS135: -this.COS45,
  COS225: -this.COS45,
  COS315: this.COS45,
  SIN45: this.COS45,
  SIN135: this.COS45,
  SIN225: -this.COS45,
  SIN315: -this.COS45
}

// TODO: Rewrite this
// This code does not work as intended! sad_face_emoji
function darkenColor(c, percentage) {
  if (c.includes('rgb')) return darkenColor('#' + c.replace(/rgb|\(|\)/g, '').split(',').map(a => parseInt(floor(a), 16)).join('').padStart('0'), percentage)
  c = c.replaceAll('#', '')
  if (c.length < 5) c = `${c[0]}${c[0]}${c[1]}${c[1]}${c[2]}${c[2]}${c.length === 4 ? `${c[3]}${c[3]}` : ''}`
  let r = clamp(parseInt(c.substring(0, 2) + 1, 16) * percentage, 0, 255)
  let g = clamp(parseInt(c.substring(2, 4) + 1, 16) * percentage, 0, 255)
  let b = clamp(parseInt(c.substring(4, 6) + 1, 16) * percentage, 0, 255)
  if (c.length === 8) {
    let a = clamp(parseInt(c.substring(6), 16), 0, 255)
    return `rgba(${r},${g},${b},${a})`
  }
  return `rgb(${r},${g},${b})`
}

function useContext(context) {
  _ctx = context
}

function getOpacity() {
  return _ctx.globalAlpha
}

function resizeCanvas(w, h) {
  canvas.width = w
  canvas.height = h
}

function fill(c = 'transparent') {
  _ctx.fillStyle = c
}

function stroke(c = 'transparent') {
  _ctx.strokeStyle = c
}

function opacity(level) {
  _ctx.globalAlpha = level
}

function strokeWeight(weight = 1) {
  _ctx.lineWidth = weight
}

function clear(x, y, w, h) {
  _ctx.clearRect(x, y, w, h)
}

function background(c = '#000') {
  _ctx.fillStyle = c
  _ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function rect(x, y, w, h) {
  _ctx.fillRect(x, y, w, h)
  _ctx.strokeRect(x, y, w, h)
}

function ellipse(x, y, rX, rY, r = 0, sA = 0, eE = 2 * Math.PI, cC = false) {
  _ctx.beginPath()
  _ctx.ellipse(x, y, rX, rY, r, sA, eE, cC)
  _ctx.fill()
  _ctx.stroke()
  _ctx.closePath()
}

function circle(x, y, r) {
  _ctx.beginPath()
  _ctx.arc(x, y, r, 0, 2 * Math.PI)
  _ctx.fill()
  _ctx.stroke()
  _ctx.closePath()
}

function textMode(mode) {
  const m0 = mode.split('')[0]
  const m1 = mode.split('')[1]
  _ctx.textBaseline = (m0 === 'c' || m0 === 'm') ? 'middle' : m0 === 't' ? 'top' : m0 === 'a' ? 'alphabetic' : m0 === 'h' ? 'hanging' : 'ideographic'
  _ctx.textAlign = m1 === 'c' ? 'center' : m1 === 'l' ? 'left' : m1 === 'r' ? 'right' : m1 === 's' ? 'start' : 'end'
}

function textSize(size) {
  _ctx.font = `${size}px ${_ctx.font.split(' ').slice(1)}`
}

function text(str, x, y, maxWidth) {
  _ctx.fillText(str, x, y, maxWidth)
  _ctx.strokeText(str, x, y, maxWidth)
}

function triangle(x1, y1, x2, y2, x3, y3) {
  _ctx.beginPath()
  _ctx.moveTo(x1, y1)
  _ctx.lineTo(x2, y2)
  _ctx.lineTo(x3, y3)
  _ctx.fill()
  _ctx.closePath()
}

function line(x1, y1, x2, y2) {
  _ctx.beginPath()
  _ctx.moveTo(x1, y1)
  _ctx.lineTo(x2, y2)
  _ctx.stroke()
}

function line2(p1, p2) {
  _ctx.beginPath()
  _ctx.moveTo(p1.x, p1.y)
  _ctx.lineTo(p2.x, p2.y)
  _ctx.stroke()
}

function drawImage(...args) {
  _ctx.drawImage(...args)
}

function beginPath() {
  _ctx.beginPath()
}

function closePath() {
  _ctx.fill()
  _ctx.stroke()
  _ctx.closePath()
}

function vertex(x, y) {
  _ctx.lineTo(x, y)
}

function arrow(x1, y1, x2, y2, tipLength, tipDeviation) {
  let a = -pointToDirection(x1, y1, x2, y2)
  let o = radians(tipDeviation)
  line(x1, y1, x2, y2, _ctx)
  line(x2, y2,
    x2 - Math.cos(a - o) * tipLength,
    y2 - Math.sin(a - o) * tipLength)
  line(x2, y2,
    x2 - Math.cos(a + o) * tipLength,
    y2 - Math.sin(a + o) * tipLength)
}

function arrow2(x, y, angle, length, tipLength, tipDeviation) {
  arrow(x, y, x + cos(angle) * length, y - sin(angle) * length, tipLength, tipDeviation)
}

function crosshair(x, y, size, gap) {
  const halfGap = gap * 0.5
  line(x - size - halfGap, y, x - halfGap, y)
  line(x + size + halfGap, y, x + halfGap, y)
  line(x, y - size - halfGap, x, y - halfGap)
  line(x, y + size + halfGap, x, y + halfGap)
}

function crosshair2(x, y, size, gap) {
  const halfGap = gap * 0.5
  const totalSize = halfGap + size
  line(
    x + anglesCache.COS45 * halfGap, y + anglesCache.SIN45 * halfGap,
    x + anglesCache.COS45 * (totalSize), y + anglesCache.SIN45 * (totalSize))
  line(
    x + anglesCache.COS135 * halfGap, y + anglesCache.SIN135 * halfGap,
    x + anglesCache.COS135 * (totalSize), y + anglesCache.SIN135 * (totalSize))
  line(
    x + anglesCache.COS225 * halfGap, y + anglesCache.SIN225 * halfGap,
    x + anglesCache.COS225 * (totalSize), y + anglesCache.SIN225 * (totalSize))
  line(
    x + anglesCache.COS315 * halfGap, y + anglesCache.SIN315 * halfGap,
    x + anglesCache.COS315 * (totalSize), y + anglesCache.SIN315 * (totalSize))
}

function arcField(x, y, r, direction, deviation) {
  const d = deviation * 0.5
  
  _ctx.beginPath()
  _ctx.arc(x, y, r, direction - d, direction + d)
  _ctx.fill()
  _ctx.closePath()
  triangle(
    x, y,
    Math.cos(direction - d) * r, Math.sin(direction - d) * r,
    Math.cos(direction + d) * r, Math.sin(direction + d) * r)
}

function imageScaledToWidth(image, x, y, width, mode = 't') {
  const s = width / image.width
  const w = s * image.width
  const h = s * image.height
  _ctx.drawImage(image, x, y - (mode === 'c' ? h * 0.5 : mode === 'b' ? h : 0), w, h)
}

function fitCanvasToScreen(canvas, width, height) {
  if (innerWidth / innerHeight > width / height) {
    canvas.height = innerHeight
    canvas.width = floor(innerHeight / height * width)
  } else {
    canvas.width = innerWidth
    canvas.height = floor(innerWidth / width * height)
  }
}

function createCanvasContext(width, height, parent = document.body) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height
  canvas.oncontextmenu = e => e.preventDefault()
  parent.append(canvas)
  return { canvas, ctx }
}
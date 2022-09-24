// Gustavo Nicoletti

// Experiment image manipulation library
// v0.0.1 [03/09/2022]
// - Initial state
// v0.0.2 [04/09/2022]
// - Switched to async functions

async function iP_forEachPixel(image, callback) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let d = imageData.data
  let dd = d.slice()

  for (let i = 0; i < d.length; i += 4)
    [d[i], d[i + 1], d[i + 2], d[i + 3]] = callback([d[i], d[i + 1], d[i + 2], d[i + 3]], i, dd)

  ctx.putImageData(imageData, 0, 0)
  
  return new Promise((resolve, reject) => {
    const image = loadImage(canvas.toDataURL(), () => {
      resolve(image)
    })
  })
}

async function iP_forEachPixelNormalized(image, callback) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let d = imageData.data
  let dd = d.slice()

  for (let i = 0; i < d.length; i += 4)
    [d[i], d[i + 1], d[i + 2], d[i + 3]] = callback([d[i] / 255, d[i + 1] / 255, d[i + 2] / 255, d[i + 3] / 255], i, dd).map(c => c * 255) ?? [d[i], d[i + 1], d[i + 2], d[i + 3]]

  ctx.putImageData(imageData, 0, 0)
  
  return new Promise((resolve, reject) => {
    const image = loadImage(canvas.toDataURL(), () => {
      resolve(image)
    })
  })
}

async function iP_pixelateImage(image, resolution) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const scale = resolution / max(image.width, image.height)
  canvas.width = image.width * scale
  canvas.height = image.height * scale
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  ctx.putImageData(imageData, 0, 0)

  return new Promise((resolve, reject) => {
    const newImage = loadImage(canvas.toDataURL(), () => {
      resolve(newImage)
    })
  })
}

async function iP_removeColor(image, r = 0, g = 255, b = 0, threshold = 10) {
  const thresholdSquared = threshold * threshold

  return iP_forEachPixel(image, p => {
    if ((p[0] - r)**2 + (p[1] - g)**2 + (p[2] - b)**2 <= thresholdSquared)
      p[3] = 0
    return p
  })
}

async function iP_decreasePalette(image, colors) {
  return iP_forEachPixel(image, p => {
    p[0] = Math.floor(p[0] / colors) * colors
    p[1] = Math.floor(p[1] / colors) * colors
    p[2] = Math.floor(p[2] / colors) * colors
    return p
  })
}

function iP_multiply(image, amount) {
  return iP_forEachPixel(image, p => {
    p[0] *= amount
    p[1] *= amount
    p[2] *= amount
    return p
  })
}

async function iP_usePalette(image, palette) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let d = imageData.data

  for (let i = 0; i < d.length; i += 4) {
    let closestColor = null
    let closestDistance = 999999

    for (let color of palette) {
      const dist = distanceNDSquared(color, [d[i], d[i+1], d[i+2]])
      if (dist < closestDistance) {
        closestDistance = dist
        closestColor = color
      }
    }

    if (closestColor) {
      d[i]   = closestColor[0]
      d[i+1] = closestColor[1]
      d[i+2] = closestColor[2]
    }
  }

  ctx.putImageData(imageData, 0, 0)
  
  return new Promise((resolve, reject) => {
    const image = loadImage(canvas.toDataURL(), () => {
      resolve(image)
    })
  })

  return iP_forEachPixel(image, p => {
    let closestColor = null
    let closestDistance = 999999

    for (let color of palette) {
      const d = distanceNDSquared(color, [p[0], p[1], p[2]])
      if (d < closestDistance) {
        closestDistance = d
        closestColor = color
      }
    }

    if (closestColor) {
      p[0] = closestColor[0]
      p[1] = closestColor[1]
      p[2] = closestColor[2]
    }
    
    return p
  })
}

function iP_getPixelsCluster(image, r, g, b, threshold) {
  const pixelsFound = []
  const thresholdSquared = threshold * threshold

  iP_forEachPixel(image, (p, i) => {
    if ((p[0] - r)**2 + (p[1] - g)**2 + (p[2] - b)**2 <= thresholdSquared)
      pixelsFound.push([(i / 4) % image.width, floor(i / 4 / image.width)])
    return p
  })

  return pixelsFound
}

function iP_getPixelsClusterCenter(image, r, g, b, threshold) {
  const pixelsCluster = getPixelsCluster(image, r, g, b, threshold)
  const center = [0, 0]
  for (let p of pixelsCluster) {
    center[0] += p[0]
    center[1] += p[1]
  }

  center[0] /= pixelsCluster.length
  center[1] /= pixelsCluster.length
  return center
}
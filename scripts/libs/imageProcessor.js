// Gustavo Nicoletti

// Experiment image manipulation library
// v0.0.1 [03/09/2022]
// - Initial state

function iP_forEachPixel(img, callback) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = img.width
  canvas.height = img.height
  ctx.drawImage(img, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let d = imageData.data

  for (let i = 0; i < d.length; i += 4)
    [d[i], d[i + 1], d[i + 2], d[i + 3]] = callback([d[i], d[i + 1], d[i + 2], d[i + 3]], i)

  ctx.putImageData(imageData, 0, 0)
  return loadImage(canvas.toDataURL())
}

function pixelateImage(img, rez) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = img.width * rez
  canvas.height = img.height * rez
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  ctx.putImageData(imgData, 0, 0)
  const newImg = loadImage(canvas.toDataURL())
  return newImg
}

function removeColor(img, r = 0, g = 255, b = 0, threshold = 10) {
  const thresholdSquared = threshold * threshold
  return iP_forEachPixel(img, p => {
    if ((p[0] - r)**2 + (p[1] - g)**2 + (p[2] - b)**2 <= thresholdSquared)
      p[3] = 0
    return p
  })
}

function decreasePalette(img, colors) {
  return iP_forEachPixel(img, p => {
    p[0] = Math.floor(p[0] / colors) * colors
    p[1] = Math.floor(p[1] / colors) * colors
    p[2] = Math.floor(p[2] / colors) * colors
    return p
  })
}

function usePalette(img, palette) {
  return iP_forEachPixel(img, p => {
    let closestColor = null
    let closestDistance = 999999

    for (let color of palette) {
      const d = distanceND(color, p)
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

function getPixelsCluster(img, r, g, b, threshold) {
  const pixelsFound = []
  const thresholdSquared = threshold * threshold
  iP_forEachPixel(img, (p, i) => {
    if ((p[0] - r)**2 + (p[1] - g)**2 + (p[2] - b)**2 <= thresholdSquared)
      pixelsFound.push([(i / 4) % img.width, floor(i / 4 / img.width)])
    return p
  })

  return pixelsFound
}

function getPixelsClusterCenter(img, r, g, b, threshold) {
  const pixelsCluster = getPixelsCluster(img, r, g, b, threshold)
  const center = [0, 0]
  for (let p of pixelsCluster) {
    center[0] += p[0]
    center[1] += p[1]
  }

  center[0] /= pixelsCluster.length
  center[1] /= pixelsCluster.length
  return center
}
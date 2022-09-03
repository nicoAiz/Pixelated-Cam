function removeColor(img, r = 0, g = 255, b = 0, threshold = 10) {
  const thresholdSquared = threshold * threshold
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = img.width
  canvas.height = img.height
  try {
    ctx.drawImage(img, 0, 0)
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < imgData.data.length; i += 4) {
      let pR = imgData.data[i]
      let pG = imgData.data[i + 1]
      let pB = imgData.data[i + 2]
      
      if ((pR - r)**2 + (pG - g)**2 + (pB - b)**2 <= thresholdSquared)
        imgData.data[i + 3] = 0
    }

    ctx.putImageData(imgData, 0, 0)
    let newImg = loadImage(canvas.toDataURL())
    return newImg
  } catch(err) { console.error(err) }
}

function pixelateImage(img, rez) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = img.width * rez
  canvas.height = img.height * rez
  try {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    // Do whatever here...

    ctx.putImageData(imgData, 0, 0)
    let newImg = loadImage(canvas.toDataURL())
    return newImg
  } catch(err) { console.error(err) }
}

function decreasePalette(img, colors) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = img.width
  canvas.height = img.height
  try {
    ctx.drawImage(img, 0, 0)
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i]     = Math.floor(imgData.data[i] / colors) * colors
      imgData.data[i + 1] = Math.floor(imgData.data[i + 1] / colors) * colors
      imgData.data[i + 2] = Math.floor(imgData.data[i + 2] / colors) * colors
    }

    ctx.putImageData(imgData, 0, 0)
    let newImg = loadImage(canvas.toDataURL())
    return newImg
  } catch(err) { console.error(err) }
}

function usePalette(img, palette) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = img.width
  canvas.height = img.height
  try {
    ctx.drawImage(img, 0, 0)
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < imgData.data.length; i += 4) {
      let pR = imgData.data[i]
      let pG = imgData.data[i + 1]
      let pB = imgData.data[i + 2]

      let closestColor = null
      let closestDistance = 999999

      for (let color of palette) {
        const d = distanceND(color, [pR, pG, pB])
        if (d < closestDistance) {
          closestDistance = d
          closestColor = color
        }
      }

      if (!closestColor) continue

      imgData.data[i]     = closestColor[0]
      imgData.data[i + 1] = closestColor[1]
      imgData.data[i + 2] = closestColor[2]
    }

    ctx.putImageData(imgData, 0, 0)
    let newImg = loadImage(canvas.toDataURL())
    return newImg
  } catch(err) { console.error(err) }
}

function getPixelsCluster(img, r, g, b, threshold) {
  const thresholdSquared = threshold * threshold
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = img.width
  canvas.height = img.height
  const pixelsFound = []
  try {
    ctx.drawImage(img, 0, 0)
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < imgData.data.length; i += 4) {
      let pR = imgData.data[i]
      let pG = imgData.data[i + 1]
      let pB = imgData.data[i + 2]
      
      if ((pR - r)**2 + (pG - g)**2 + (pB - b)**2 <= thresholdSquared) {
        const x = (i / 4) % canvas.width
        const y = floor(i / 4 / canvas.width)
        pixelsFound.push([x, y])
      }
    }

    return pixelsFound
  } catch(err) { console.error(err) }
}

function getPixelsClusterCenter(img, r, g, b, threshold) {
  const pixelsCluster = getPixelsCluster(img, r, g, b, threshold)
  let center = [0, 0]
  for (let p of pixelsCluster) {
    center[0] += p[0]
    center[1] += p[1]
  }

  center[0] /= pixelsCluster.length
  center[1] /= pixelsCluster.length
  
  return center
}
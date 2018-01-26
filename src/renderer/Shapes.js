
export function diamond(diameter) {

  const radius = Math.round(diameter/2)

  const shape = function(ctx, x, y) {
    ctx.moveTo(x+radius, y)
    ctx.lineTo(x, y+radius)
    ctx.lineTo(x-radius, y)
    ctx.lineTo(x, y-radius)
    ctx.lineTo(x+radius, y)
  }

  shape.contains = function(relX, relY) {
    return Math.abs(relX) <= radius && Math.abs(relY) <= radius
  }

  return shape
}

export function triangleUp(width, height) {

  const halfWidth = Math.round(width/2)

  const shape = function(ctx, x, y) {
    ctx.moveTo(x+halfWidth, y)
    ctx.lineTo(x, y-height)
    ctx.lineTo(x-halfWidth, y)
    ctx.lineTo(x+halfWidth, y)
  }

  shape.contains = function(relX, relY) {
    return Math.abs(relX) <= halfWidth && relY >= 0 && relY <= height
  }

  return shape
}

export function triangleDown(width, height) {

  const halfWidth = Math.round(width/2)

  const shape = function(ctx, x, y) {
    ctx.moveTo(x+halfWidth, y)
    ctx.lineTo(x, y+height)
    ctx.lineTo(x-halfWidth, y)
    ctx.lineTo(x+halfWidth, y)
  }

  shape.contains = function(relX, relY) {
    return Math.abs(relX) <= halfWidth && relY <= 0 && relY >= -height
  }

  return shape
}

export function flatTriangleUp(width) {
  return triangleUp(width, Math.round(width*0.55))
}

export function flatTriangleDown(width) {
  return triangleDown(width, Math.round(width*0.55))
}

export function equilateralTriangleUp(width) {
  return triangleUp(width, Math.round(width*0.865))
}

export function equilateralTriangleDown(width) {
  return triangleDown(width, Math.round(width*0.865))
}

export const exports = {
  diamond: diamond,
  triangleUp: triangleUp,
  triangleDown: triangleDown,
  flatTriangleUp: flatTriangleUp,
  flatTriangleDown: flatTriangleDown,
  equilateralTriangleUp: equilateralTriangleUp,
  equilateralTriangleDown: equilateralTriangleDown,
}
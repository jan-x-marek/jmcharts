export function round3(x) {
  return Math.round(x * 1000) / 1000
}

export function round6(x) {
  return Math.round(x * 1000000) / 1000000
}

export function round9(x) {
  return Math.round(x * 1000000000) / 1000000000
}

export function isNullOrNaN(x) {
  return x == null || isNaN(x)
}

export function isNumber(x) {
  return !isNullOrNaN(x)
}

export function minmax(min, max, x) {
  return Math.max(min, Math.min(max, x))
}

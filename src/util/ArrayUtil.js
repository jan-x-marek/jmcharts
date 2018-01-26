
export function binarySearch(a, x, comparator = numberComparator) {
  let start = 0
  let end = a.length - 1
  while (start <= end) {
    let k = (end + start) >> 1
    let cmp = comparator(x, a[k])
    if (cmp > 0) {
      start = k + 1
    }
    else if(cmp < 0) {
      end = k - 1
    }
    else {
      return k
    }
  }
  return -start - 1
}

export function numberComparator(x, y) {
  return x - y
}

export function binarySearchLE(a, x, comparator = numberComparator) {
  const i = binarySearch(a, x, comparator)
  if (i < 0) {
    return -i - 2
  }
  else {
    return i
  }
}

export function binarySearchGE(a, x, comparator = numberComparator) {
  const i = binarySearch(a, x, comparator)
  if (i < 0) {
    if (i === -a.length - 1) {
      return -1
    } else {
      return -i - 1
    }
  }
  else {
    return i
  }
}

export function isArray(o) {
  return o !== null && o !== undefined && o.constructor === Array
}

export function concatValues(o1, o2) {
  const result = {}
  for(let k in o1) {
    const v = o1[k]
    const va = isArray(v) ? v : [v]
    result[k] = va
  }
  for(let k in o2) {
    const v = o2[k]
    const va = isArray(v) ? v : [v]
    if (result.hasOwnProperty(k)) {
      result[k] = result[k].concat(va)
    } else {
      result[k] = va
    }
  }
  return result
}

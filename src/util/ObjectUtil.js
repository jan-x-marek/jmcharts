import * as _ from 'underscore'

export function addFluentProperty(object, propName, initialValue) {

  const dataFieldName = '_' + propName

  object[dataFieldName] = initialValue

  object[propName] = function(...p) {
    if (p.length === 0) {
      return object[dataFieldName]
    } else {
      object[dataFieldName] = p[0]
      return object
    }
  }

  return object
}

export function addFluentArray(object, propName) {

  const dataFieldName = propName.length === 0 ? '_fluentArray' : '_' + propName
  object[dataFieldName] = []

  const appendMethodName = propName.length === 0 ? 'append' :
    'append' + propName.slice(0,1).toUpperCase() + propName.slice(1)

  object[appendMethodName] = function(p) {
    object[dataFieldName].push(p)
    return p
  }

  const getAllMethodName = propName.length === 0 ? 'items' : propName+'s'
  object[getAllMethodName] = function() {
    return object[dataFieldName]
  }

  const getOneMethodName = propName.length === 0 ? 'item' : propName
  object[getOneMethodName] = function(i) {
    return object[dataFieldName][i]
  }

  const lengthMethodName = propName.length === 0 ? 'length' : propName+'sLength'
  object[lengthMethodName] = function() {
    return object[dataFieldName].length
  }

  return object
}

export function hasMethod(o, methodName) {
  return typeof o[methodName] === 'function'
}

export function max(array, valueProvider, filter = x => true) {
  return array.filter(filter)
    .reduce((acc, x) => Math.max(acc, valueProvider(x)), Number.NEGATIVE_INFINITY)
}

export function min(array, valueProvider, filter = x => true) {
  return array.filter(filter)
    .reduce((acc, x) => Math.min(acc, valueProvider(x)), Number.POSITIVE_INFINITY)
}

export function minMax(array, valueProvider, filter = x => true) {
  return [min(array, valueProvider, filter), max(array, valueProvider, filter)]
}

export function toString(o) {
  return _.pairs(o)
    .map(p => p[0]+':'+p[1])
    .join(', ')
}

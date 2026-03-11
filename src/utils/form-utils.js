export function pair(value) {
  if (Array.isArray(value)) { // Array type
    return { 
      initial: [...value], 
      value: [...value] 
    }
  } else if (value !== null && typeof value === 'object') { // Object type, but not null(considered an object)
    return { 
      initial: JSON.parse(JSON.stringify(value)),
      value: JSON.parse(JSON.stringify(value)) 
    }
  } else { // Primitive
    return {
      initial: value,
      value: value
    }
  }
}

export function updatePair(pair, value) {
  if (Array.isArray(value)) { // Array type
    pair.initial = [...value]
    pair.value = [...value] 
  } else if (value !== null && typeof value === 'object') { // Object type, but not null(considered an object)
    pair.initial = JSON.parse(JSON.stringify(value))
    pair.value = JSON.parse(JSON.stringify(value)) 
  } else { // Primitive
    pair.initial = value
    pair.value = value
  }
}
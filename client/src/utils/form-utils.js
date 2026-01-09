export function pair(value) {
  return { initial: value, value: value };
}

export function updatePair(pair, value) {
  pair.initial = value;
  pair.value = value;
}
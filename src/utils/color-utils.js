const colorMap = {
  'R': { id: 0, code: 'R', name: 'Red', value: 'red-darken-3', hex: '#C62828' },
  'G': { id: 1, code: 'G', name: 'Green', value: 'green-darken-3', hex: '#2E7D32' },
  'U': { id: 2, code: 'U', name: 'Blue', value: 'blue-darken-3', hex: '#1565C0' },
  'P': { id: 3, code: 'P', name: 'Purple', value: 'purple-darken-3', hex: '#6A1B9A' },
  'B': { id: 4, code: 'B', name: 'Black', value: 'gray-darken-3', hex: '#212121' },
  'Y': { id: 5, code: 'Y', name: 'Yellow', value: 'yellow-darken-3', hex: '#F9A825' },
};

export const getColorOptions = () => Object.values(colorMap);
export const getColor = (color) => colorMap?.[color]?.hex ?? '#757575';
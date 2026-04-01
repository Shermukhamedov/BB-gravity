export const SHAPES = [
  // 1x1 Dot
  [[1]],
  // 2x1 Lines
  [[1, 1]],
  [[1], [1]],
  // 3x1 Lines
  [[1, 1, 1]],
  [[1], [1], [1]],
  // 4x1 Lines
  [[1, 1, 1, 1]],
  [[1], [1], [1], [1]],
  // 5x1 Lines
  [[1, 1, 1, 1, 1]],
  [[1], [1], [1], [1], [1]],
  // 2x2 Square
  [[1, 1], [1, 1]],
  // 3x3 Square
  [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
  // Small L
  [[1, 0], [1, 1]],
  [[0, 1], [1, 1]],
  [[1, 1], [1, 0]],
  [[1, 1], [0, 1]],
  // Big L
  [[1, 0, 0], [1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [0, 0, 1], [1, 1, 1]],
  [[1, 1, 1], [1, 0, 0], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1], [0, 0, 1]],
  // T shape
  [[1, 1, 1], [0, 1, 0]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0], [1, 1], [1, 0]],
  [[0, 1], [1, 1], [0, 1]],
  // Z/S shape
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 0], [1, 1], [0, 1]],
  [[0, 1], [1, 1], [1, 0]],
];

export const getRandomShape = () => {
  const randomIndex = Math.floor(Math.random() * SHAPES.length);
  return SHAPES[randomIndex];
};

export const generateDockShapes = () => {
  return [
    { id: crypto.randomUUID(), shape: getRandomShape(), isPlaced: false },
    { id: crypto.randomUUID(), shape: getRandomShape(), isPlaced: false },
    { id: crypto.randomUUID(), shape: getRandomShape(), isPlaced: false },
  ];
};

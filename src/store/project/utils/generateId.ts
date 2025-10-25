export const generateId = (): string =>
  `node_${Math.random().toString(36).substr(2, 9)}`

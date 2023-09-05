export function switchBit(input: number, bit: number, state: 0 | 1) {
  if (state === 0) {
    return input & ~(1 << bit);
  } else {
    return input | (1 << bit);
  }
}

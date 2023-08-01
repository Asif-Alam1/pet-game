export const TICK_RATE = 3000;
export const ICONS = ["fish", "poop", "weather"];
export function getNextHungerTime(clock) {
  return Math.floor(Math.random() * 3) + 5 + clock;
}
export function getNextDieTime(clock) {
  return Math.floor(Math.random() * 2) + 3 + clock;
}

export function getNextPoopTime(clock) {
  return Math.floor(Math.random() * 3) + 4 + clock;
}

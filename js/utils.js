export const rand = (min, max) => Math.random() * (max - min) + min;
export const randInt = (min, max) => Math.floor(rand(min, max + 1));
export const pick = (arr) => arr[randInt(0, arr.length - 1)];
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function el(tag, className, parent) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (parent) parent.appendChild(node);
  return node;
}

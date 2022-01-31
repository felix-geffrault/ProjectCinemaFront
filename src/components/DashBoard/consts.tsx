const angle = 30*Math.PI/180;
const angleReversed = 60*Math.PI/180;
const wI = 160;
const hI = 240;
const w = wI + 15; // width + margin of a movie poster = 160 + 15
const h = hI + 15; // height of one + margin = 240 + 15
const nbRows = 8;
const nbPostersShown = 100;
const xVectors = {w: Math.cos(angle) * w, h: Math.cos(angleReversed) * h }; // w: | A -> B | on x, h: | A -> C | on x
const yVectors = {w: - w * Math.sin(angle), h: h * Math.sin(angleReversed)}; // w: -| A -> B | on x, h: | A -> C | on y
const xyVectors = {w: w, h: h} // w = | A -> B |, h = |A -> D |

export {angle, angleReversed, h, w, nbRows, hI, wI, yVectors, xVectors, xyVectors, nbPostersShown}
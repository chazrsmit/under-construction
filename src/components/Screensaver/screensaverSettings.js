export const screensaverSettings = {
  mode: "constellation", // "constellation" or "erosion"
  idleDelay: 30000,
  fadeInDuration: 1500,
  fadeOutDuration: 800,
  background: "#f5f5f5",
  frameRate: 30,
  constellation: { count: 85, minSize: 12, maxSize: 55, speed: 12, lifetime: 12 },
  erosion: { strips: 48, cycleSeconds: 16, imageWidth: 0.58, displacement: 0.35 },
};

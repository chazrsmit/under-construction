
export const compositionSettings = {
  imageWidth: 17.2, // Percentage of viewport width
  imageAspectRatio: 2.04,

  // Autonomous movement
  movementSpeed: 100, // Pixels per second
  trailSpacing: 15, // Distance between traces
  directionChangeInterval: 1800,
  directionSmoothness: 1.5,

  // Cursor
  cursorSize: 10,
};

export const compositionProjects = [
  {
    id: "a-day-in-brussels",
    number: "01",
    name: "A Day in Brussels",
    categories: "PHOTOGRAPHY, CREATIVE CODING",
    image: "aday1.png",
    position: { x: 39.6, y: 49.6 },
    numberPosition: { bottom: -22, right: 10 },
    zIndex: 3,
  },
  {
    id: "agendive",
    number: "02",
    name: "Agendive",
    categories: "UX/UI, DEVELOPMENT",
    image: "agendive1.png",
    position: { x: 52.3, y: 37 },
    numberPosition: { top: -22, right: 0 },
    zIndex: 6,
  },
  {
    id: "attuned",
    number: "03",
    name: "Attuned",
    categories: "VISUAL IDENTITY, WEB DESIGN",
    image: "Attuned1.png",
    position: { x: 20.2, y: 30 },
    numberPosition: { top: -20, left: 0 },
    zIndex: 5,
  },
  {
    id: "la-coeh",
    number: "04",
    name: "La CoEh",
    categories: "WEB DESIGN, VISUAL IDENTITY",
    image: "lacoeh1.png",
    position: { x: 25.8, y: 60.8 },
    numberPosition: { bottom: -22, left: 0 },
    zIndex: 2,
  },
  {
    id: "litteria",
    number: "05",
    name: "Litteria",
    categories: "UX/UI, DEVELOPMENT",
    image: "litteria1.png",
    position: { x: 62.7, y: 57.1 },
    numberPosition: { bottom: -22, right: 0 },
    zIndex: 7,
  },
  {
    id: "napolinapoli",
    number: "06",
    name: "Napolinapoli",
    categories: "ART DIRECTION, DEVELOPMENT",
    image: "napoli2.png",
    position: { x: 35.7, y: 35.3 },
    numberPosition: { top: -20, right: 0 },
    zIndex: 4,
  },
  {
    id: "oh-word",
    number: "07",
    name: "Oh Word",
    categories: "WEB DESIGN, DEVELOPMENT",
    image: "Ohword1.png",
    position: { x: 61.1, y: 47.2 },
    numberPosition: { top: -20, right: 0 },
    zIndex: 1,
  },
];

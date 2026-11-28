export default function constellationSketch(p, urls, settings) {
  const cfg = settings.constellation;
  let images = [], particles = [];
  function particle(age = 0) {
    return { x: p.random(p.width), y: p.random(p.height), size: p.random(cfg.minSize,cfg.maxSize), angle: p.random(p.TWO_PI), age, life: cfg.lifetime*p.random(.65,1.35), image: p.floor(p.random(images.length)) };
  }
  p.setup = () => {
    p.createCanvas(p.windowWidth,p.windowHeight);
    p.pixelDensity(1);
    p.frameRate(settings.frameRate);
    images = urls.map(url => p.loadImage(url, () => {}, () => {}));
    particles = Array.from({length:cfg.count}, () => particle(p.random(cfg.lifetime)));
  };
  p.draw = () => {
    p.background(settings.background);
    const dt = Math.min(p.deltaTime/1000,.1);
    for (let i=0;i<particles.length;i++) {
      let q=particles[i];
      q.age+=dt;
      if(q.age>=q.life) q=particles[i]=particle();
      q.angle += (p.noise(i,q.age*.15)-.5)*dt;
      q.x=(q.x+Math.cos(q.angle)*cfg.speed*dt+p.width)%p.width;
      q.y=(q.y+Math.sin(q.angle)*cfg.speed*dt+p.height)%p.height;
      const img=images[q.image];
      if(!img?.width || img.width===1) continue;
      const alpha=Math.min(1,q.age/2,(q.life-q.age)/2);
      const side=Math.min(img.width,img.height);
      p.tint(255,255*Math.max(0,alpha));
      p.image(img,q.x,q.y,q.size,q.size,(img.width-side)/2,(img.height-side)/2,side,side);
    }
    p.noTint();
  };
  p.windowResized=()=>p.resizeCanvas(p.windowWidth,p.windowHeight);
}

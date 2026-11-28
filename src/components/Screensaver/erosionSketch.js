export default function erosionSketch(p, urls, settings) {
  const cfg=settings.erosion;
  let images=[], elapsed=0;
  p.setup=()=>{
    p.createCanvas(p.windowWidth,p.windowHeight);
    p.pixelDensity(1);
    p.frameRate(settings.frameRate);
    images=urls.map(url=>p.loadImage(url,()=>{},()=>{}));
  };
  p.draw=()=>{
    p.background(settings.background);
    elapsed+=Math.min(p.deltaTime/1000,.1);
    const cycle=Math.floor(elapsed/cfg.cycleSeconds);
    const t=(elapsed%cfg.cycleSeconds)/cfg.cycleSeconds;
    const img=images[cycle%images.length];
    if(!img?.width || img.width===1) return;
    const w=Math.min(p.width*cfg.imageWidth,p.height*.65*img.width/img.height);
    const h=w*img.height/img.width;
    const x=(p.width-w)/2,y=(p.height-h)/2;
    const amount=p.smoothstep ? p.smoothstep(.25,.9,t) : Math.pow(Math.max(0,Math.min(1,(t-.25)/.65)),2);
    const opacity=Math.min(1,t/.15,(1-t)/.15);
    p.tint(255,255*opacity);
    for(let i=0;i<cfg.strips;i++) {
      const offset=(p.noise(i*.31,cycle*7+t*.7)-.5)*2;
      const dx=offset*p.width*cfg.displacement*amount;
      const dy=(p.noise(i*.17+100,cycle+t)-.5)*p.height*.35*amount;
      p.image(img,x+dx,y+i*h/cfg.strips+dy,w,h/cfg.strips+.5,0,i*img.height/cfg.strips,img.width,img.height/cfg.strips);
    }
    p.noTint();
  };
  p.windowResized=()=>p.resizeCanvas(p.windowWidth,p.windowHeight);
}

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { compositionProjects } from "../compositionData";
import { screensaverSettings as settings } from "./screensaverSettings";
import constellationSketch from "./constellationSketch";
import erosionSketch from "./erosionSketch";
import "./screensaver.css";

function Sketch({ mode }) {
  const host=useRef(null);
  useEffect(()=>{
    let cancelled=false, instance;
    const urls=compositionProjects.map(p=>`${import.meta.env.BASE_URL}images/${mode === "erosion" ? p.image : p.indexImage || p.image}`);
    import("p5").then(({default:P5})=>{
      if(cancelled) return;
      instance=new P5(p=>(mode === "erosion" ? erosionSketch : constellationSketch)(p,urls,settings),host.current);
    }).catch(console.error);
    return ()=>{cancelled=true;instance?.remove();};
  },[mode]);
  return <div ref={host} className="screensaver-canvas" />;
}

export default function Screensaver({ enabled }) {
  const [active,setActive]=useState(false);
  const [mode,setMode]=useState(settings.mode);
  useEffect(()=>{
    if(!enabled){setActive(false);return;}
    let timer;
    const media=matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)");
    const reduced=matchMedia("(prefers-reduced-motion: reduce)");
    function reset(){
      clearTimeout(timer);setActive(false);
      if(media.matches && !reduced.matches && !document.hidden) timer=setTimeout(()=>setActive(true),settings.idleDelay);
    }
    function key(e){
      if(e.altKey && e.shiftKey && e.code === "KeyS" && !e.repeat){
        e.preventDefault();setMode(m=>m === "erosion" ? "constellation" : "erosion");
        clearTimeout(timer);if(media.matches && !reduced.matches && !document.hidden) setActive(true);
      } else reset();
    }
    const events=["pointermove","pointerdown","wheel","focus","blur"];
    events.forEach(event=>window.addEventListener(event,reset));
    window.addEventListener("keydown",key);
    document.addEventListener("visibilitychange",reset);
    media.addEventListener("change",reset);reduced.addEventListener("change",reset);
    reset();
    return ()=>{clearTimeout(timer);events.forEach(event=>window.removeEventListener(event,reset));window.removeEventListener("keydown",key);document.removeEventListener("visibilitychange",reset);media.removeEventListener("change",reset);reduced.removeEventListener("change",reset);};
  },[enabled]);
  return createPortal(<AnimatePresence>{enabled && active && <motion.div className="portfolio-screensaver" aria-hidden="true" style={{background:settings.background}} initial={{opacity:0}} animate={{opacity:1,transition:{duration:settings.fadeInDuration/1000}}} exit={{opacity:0,transition:{duration:settings.fadeOutDuration/1000}}}><Sketch mode={mode}/></motion.div>}</AnimatePresence>,document.body);
}

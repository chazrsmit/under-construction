import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { compositionProjects, compositionSettings as settings } from './compositionData';
import NavigationOverlay from './NavigationOverlay';
import ProjectHoverLabels from './ProjectHoverLabels';

const introDuration = 5.8;
export function TableNavigation({ isDetail, onHome }) {
    const [overlay, setOverlay] = useState(false);
    return <><header className={'table-nav ' + (isDetail ? 'compact' : '')}>
        <button onClick={onHome}>Charlotte Smit</button>
        <div className="table-about" tabIndex={0} data-link-cursor>Hi, I’m a web designer<br />and developer<span className="table-ellipsis"> (...)</span><div className="table-more"> with a background in cultural communications working at the intersection of arts and socially-driven projects.<p>This website is iteration 1.1, constantly shapeshifting as my work evolves.</p>{!isDetail && <button className="table-experiments" onClick={() => setOverlay(true)}>Some visual experiments.</button>}</div></div>
        <div className="table-contact" tabIndex={0} data-link-cursor>Let’s talk!<div className="table-more"><a href="mailto:hello@charlottesmit.com">hello@charlottesmit.com</a><a href="https://instagram.com/char__smit" target="_blank" rel="noreferrer">@char__smit</a><a href="https://github.com/chazrsmit" target="_blank" rel="noreferrer">github</a></div></div>
    </header><AnimatePresence>{overlay && <NavigationOverlay section="visual-experiments" onClose={() => setOverlay(false)} />}</AnimatePresence></>;
}
export function ProjectIntroduction({ title }) { return <motion.div aria-hidden="true" className="table-project-intro" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 2.8, times: [0, .25, .55, 1] }}>{title}</motion.div> }
function Photographs({ hovered, running, started, clearKey }) {
    const canvas = useRef(null); const state = useRef({ hovered, running, started }); state.current = { hovered, running, started };
    useEffect(() => {
        const c = canvas.current, ctx = c.getContext('2d'); let frame, last = 0, items = new Map(), w, h; const images = new Map();
        for (const p of compositionProjects) { const img = new Image(); img.src = `${import.meta.env.BASE_URL}images/${p.image}`; images.set(p.id, img) }
        function resize() { w = c.clientWidth; h = c.clientHeight; c.width = w; c.height = h; items.clear() }; resize(); window.addEventListener('resize', resize);
        function draw(t) {
            const dt = Math.min((t - last) / 1000, .05); last = t; ctx.clearRect(0, 0, w, h); const { hovered, running, started } = state.current; const iw = w * settings.imageWidth / 100, ih = iw / settings.imageAspectRatio; const mx = Math.max(0, w - iw), my = Math.max(0, h - ih);
            for (const p of compositionProjects) { const wanted = started || hovered === p.id; const moving = started ? (running && hovered !== p.id) : hovered === p.id; let a = items.get(p.id); if (wanted && !a) { a = { x: Math.random() * mx, y: Math.random() * my, d: Math.random() * Math.PI * 2, target: 0, elapsed: 0, alpha: 0, stamps: [] }; a.target = a.d; items.set(p.id, a) } if (!a) continue; if (!wanted) { items.delete(p.id); continue } a.alpha = Math.max(0, Math.min(1, a.alpha + dt * (wanted ? 5 : -2.5))); if (!wanted && a.alpha === 0) { items.delete(p.id); continue } if (moving) { a.elapsed += dt * 1000; if (a.elapsed >= settings.directionChangeInterval) { a.target += (Math.random() - .5) * Math.PI * 1.5; a.elapsed = 0 } a.d += Math.atan2(Math.sin(a.target - a.d), Math.cos(a.target - a.d)) * (1 - Math.exp(-settings.directionSmoothness * dt)); a.x += Math.cos(a.d) * settings.movementSpeed * dt; a.y += Math.sin(a.d) * settings.movementSpeed * dt; if (a.x < 0 || a.x > mx) { a.d = Math.PI - a.d; a.target = a.d } if (a.y < 0 || a.y > my) { a.d = -a.d; a.target = a.d } a.x = Math.max(0, Math.min(mx, a.x)); a.y = Math.max(0, Math.min(my, a.y)); const prev = a.stamps.at(-1); if (!prev || Math.hypot(a.x - prev.x, a.y - prev.y) >= settings.trailSpacing) a.stamps.push({ x: a.x, y: a.y }); if (a.stamps.length > 500) a.stamps.shift() } }
            const order = [...items.entries()].sort(([id], [other]) => Number(id === hovered) - Number(other === hovered)); for (const [id, a] of order) { const img = images.get(id); if (!img.complete || !img.naturalWidth) continue; ctx.globalAlpha = a.alpha; for (const pos of [...a.stamps, a]) ctx.drawImage(img, pos.x, pos.y, iw, ih) } ctx.globalAlpha = 1; frame = requestAnimationFrame(draw)
        } frame = requestAnimationFrame(draw); return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize) };
    }, [clearKey]); return <canvas className="table-photos" ref={canvas} aria-hidden="true" />;
}
// Independent random motion; CSS handles the introductory height animation.
function MovingRectangle({ hovered, playingIntro }) {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    useEffect(() => {
        if (!hovered || playingIntro || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setOffset({ x: 0, y: 0 }); return; }
        const move = () => setOffset({
            x: 0,
            y: 0
        });
        move(); const timer = setInterval(move, 1600); return () => clearInterval(timer);
    }, [hovered, playingIntro]);
    return <motion.div className="table-rectangle" animate={offset} transition={{ duration: 1.6, ease: [.22, 1, .36, 1] }} />;
}
const capitalizeWords = (value = '') => value.replace(/(^|[\s,])([a-z])/g, (_, space, letter) => space + letter.toUpperCase());
export default function TableHomepage({ projects, hovered, setHovered, onClick, intro, onIntroEnd }) {
    const [playingIntro, setPlayingIntro] = useState(intro); const [running, setRunning] = useState(false); const [started, setStarted] = useState(false); const [clearKey, setClearKey] = useState(0);
    useEffect(() => { if (!playingIntro) return; const timer = setTimeout(() => { setPlayingIntro(false); onIntroEnd() }, introDuration * 1000); return () => clearTimeout(timer) }, [playingIntro]);
    return <div className={'table-home ' + (playingIntro ? 'table-intro-playing' : '') + (started ? ' table-animation-started' : '')}>
        <MovingRectangle hovered={hovered} playingIntro={playingIntro} /><div className="table-big-title" aria-hidden="true"><span>Charlotte Smit</span></div>
        <div className="table-projects" role="table" aria-label="Projects"><div className="table-heading table-grid" role="row"><span>PROJECT</span><span>TYPE</span><span>STATUS</span></div>
            {projects.map((p, i) => { const active = hovered === p.id; const status = p.id === 'litteria' ? 'Completed' : 'Ongoing'; return <button key={p.id} style={{ '--row-index': i }} className={'table-project-row table-grid ' + (active ? 'active' : '')} data-link-cursor onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(p.id)} onBlur={() => setHovered(null)} onClick={() => onClick(p)}><span className="table-cell table-name"><span className="table-base-name">{p.title}</span><span className="table-number"><span>{p.number}</span><span className="table-reveal"><span>{p.title}</span></span></span></span><span className="table-cell"><span className="table-base">{capitalizeWords(p.categories || "")}</span><span className="table-cover"><span>{capitalizeWords(Array.isArray(p.technologies) ? p.technologies.join(', ') : (p.technologies || ''))}</span></span></span><span className="table-cell"><span className="table-base">{status}</span><span className="table-cover"><span>{status}</span></span></span></button> })}</div>
        <Photographs
            hovered={hovered}
            running={running}
            started={started}
            clearKey={clearKey}
        />

        <ProjectHoverLabels
            project={projects.find(p => p.id === hovered)}
        />

        <div className="table-controls">
            <button
                onClick={() => {
                    setStarted(true);
                    setRunning(v => !v);
                }}
            >
                {running ? 'Stop animation' : 'Start animation'}
            </button>

            <button
                onClick={() => {
                    setRunning(false);
                    setStarted(false);
                    setHovered(null);
                    setClearKey(v => v + 1);
                }}
            >
                Clear animation
            </button>
        </div>
    </div>

}

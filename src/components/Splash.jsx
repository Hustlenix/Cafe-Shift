import { useState } from "react";

export default function Splash({ onDone }) {
    const [fading, setFading] = useState(false)

    const enter = () => {
        if (fading) return
        setFading(true)
        // With reduced motion the fade is instant, so there is no reason to
        // hold the user on a blank screen for a second afterwards.
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        setTimeout(onDone, reduce ? 0 : 1100)
    }

    return (
        <div className={fading ? 'splash fade' : 'splash'} onClick={enter} role="dialog" aria-modal="true" aria-labelledby="splash-title">
            <img className="icon splash-icon" src="/icons/Croissant.png" alt="" width="96" height="96"/>
            <h1 id="splash-title">CAFE<br />SHIFT</h1>
            <p className="byline">by hustlenix</p>
            {/* A real button, so Enter and Space work natively. The click
                bubbles up to the splash, so clicking anywhere still enters. */}
            <button type="button" className="enter blink">click to enter</button>
        </div>
    )
}

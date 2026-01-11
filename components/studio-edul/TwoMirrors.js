import { useEffect, useState, useRef } from 'react';
import styles from '../../styles/StudioEdul.module.css';

export default function TwoMirrors({ visible }) {
    const [opened, setOpened] = useState(false);
    const containerRef = useRef(null);

    // Trigger opening animation on mount or visibility change
    useEffect(() => {
        if (visible) {
            // Small delay to ensure render
            const timer = setTimeout(() => {
                setOpened(true);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setOpened(false);
        }
    }, [visible]);

    // Mouse Interaction
    useEffect(() => {
        if (!visible) return;

        const handleMouseMove = (e) => {
            if (!containerRef.current) return;

            const { innerWidth, innerHeight } = window;
            const x = e.clientX;
            const y = e.clientY;

            const pX = (x / innerWidth) * 100;
            const pY = (y / innerHeight) * 100;

            containerRef.current.style.perspectiveOrigin = `${pX}% ${pY}%`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [visible]);

    // Generate recursive tunnel frames
    const frameCount = 20;
    const frames = Array.from({ length: frameCount }, (_, i) => i);

    if (!visible) return null;

    return (
        <div className={styles.container} ref={containerRef}>

            {/* Mirrors: Start at center, open to sides */}
            <div className={`${styles.mirror} ${styles.mirrorLeft} ${opened ? styles.opened : ''}`}></div>
            <div className={`${styles.mirror} ${styles.mirrorRight} ${opened ? styles.opened : ''}`}></div>

            {/* The Tunnel: Appears between mirrors */}
            <div className={`${styles.tunnelScene} ${opened ? styles.visible : ''}`}>
                {frames.map((i) => (
                    <div
                        key={i}
                        className={styles.tunnelFrame}
                        style={{
                            transform: `translateZ(-${i * 150}px)`, // Deep tunnel
                            zIndex: frameCount - i,
                            opacity: 1 - (i / frameCount) * 0.9 // Fade out deeper
                        }}
                    >
                    </div>
                ))}
            </div>

        </div>
    );
}

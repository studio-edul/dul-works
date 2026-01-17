import { useEffect, useRef, useState } from 'react';

const NoiseEraser = ({ children }) => {
    // [DISABLED] Interaction logic preserved for future use
    /*
    const containerRef = useRef(null);
    const circleRef = useRef(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const handleMouseMove = (e) => {
            if (circleRef.current && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                circleRef.current.setAttribute('cx', x);
                circleRef.current.setAttribute('cy', y);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    if (!isMounted) return <>{children}</>;
    */

    // Currently just returning children to disable the effect
    return <>{children}</>;

    /*
    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
            }}
        >
            <svg
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    opacity: 0,
                    zIndex: -1,
                }}
            >
                <defs>
                    <filter id="noiseFilter">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.05"
                            numOctaves="3"
                            result="turbulence"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="turbulence"
                            scale="50"
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                    
                    <mask id="eraserMask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <circle
                            ref={circleRef}
                            cx="50%"
                            cy="50%"
                            r="80"
                            fill="black"
                            filter="url(#noiseFilter)"
                        />
                    </mask>
                </defs>
            </svg>

            <div
                style={{
                    mask: 'url(#eraserMask)',
                    WebkitMask: 'url(#eraserMask)',
                }}
            >
                {children}
            </div>
        </div>
    );
    */
};

export default NoiseEraser;

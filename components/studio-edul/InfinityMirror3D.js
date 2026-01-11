import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

function TunnelFrame({ position, rotation, scale, color, opacity = 1 }) {
    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* Outer Glow Frame */}
            <mesh>
                <boxGeometry args={[4, 3, 0.1]} />
                <meshBasicMaterial color={color} transparent opacity={opacity * 0.1} wireframe={false} blending={THREE.AdditiveBlending} />
            </mesh>
            {/* Wireframe Edge */}
            <mesh>
                <boxGeometry args={[4, 3, 0.1]} />
                <meshBasicMaterial color={color} wireframe transparent opacity={opacity * 0.8} />
            </mesh>
        </group>
    );
}

function TechSymbol({ type, position, color }) {
    // Simple geometric abstractions
    return (
        <group position={position}>
            {type === 'code' && (
                // Brackets <>
                <group>
                    <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
                        <boxGeometry args={[0.1, 1, 0.1]} />
                        <meshBasicMaterial color={color} />
                    </mesh>
                    <mesh position={[-0.5, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                        <boxGeometry args={[0.1, 1, 0.1]} />
                        <meshBasicMaterial color={color} />
                    </mesh>
                </group>
            )}
            {type === 'wave' && (
                // Simple Line
                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.05, 0.05, 2]} />
                    <meshBasicMaterial color={color} />
                </mesh>
            )}
        </group>
    )
}

function InfiniteTunnel() {
    const group = useRef();
    const { mouse } = useThree();

    useFrame((state) => {
        // Parallax Effect
        // Move the tunnel opposite to mouse to simulate looking into it
        // Or rotate the group
        if (group.current) {
            group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouse.y * 0.1, 0.1);
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouse.x * 0.1, 0.1);
        }
    });

    // Create a series of frames
    const frames = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => {
            const z = -i * 2;
            const scale = 1;
            // Alternating colors
            const color = i % 2 === 0 ? '#00ffff' : '#ff00ff'; // Cyan / Magenta
            return { z, scale, color, id: i };
        });
    }, []);

    return (
        <group ref={group}>
            {frames.map((f) => (
                <TunnelFrame
                    key={f.id}
                    position={[0, 0, f.z]}
                    color={f.color}
                    opacity={1 - (f.id / 30)}
                />
            ))}

            {/* Floating Symbols randomly placed in tunnel */}
            <TechSymbol type="code" position={[1.5, 0.5, -5]} color="#00ffff" />
            <TechSymbol type="wave" position={[-1.5, -0.5, -10]} color="#ff00ff" />
            <TechSymbol type="code" position={[1.2, -0.8, -15]} color="#00ffff" />
        </group>
    );
}

export default function InfinityMirror3D({ visible }) {
    if (!visible) return null;

    return (
        <div style={{ width: '100%', height: 'calc(100vh - 360px)', background: '#050505' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <color attach="background" args={['#050505']} />
                <fog attach="fog" args={['#050505', 5, 20]} />

                <ambientLight intensity={0.5} />

                <InfiniteTunnel />

                {/* Post Processing for Glow */}
                {/* <EffectComposer>
                  <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={2.0} />
                </EffectComposer> */}
            </Canvas>
        </div>
    );
}

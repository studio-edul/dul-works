import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import TwoMirrors from '../components/studio-edul/TwoMirrors';
import InfinityMirror3D from '../components/studio-edul/InfinityMirror3D';
import styles from '../styles/StudioEdul.module.css';

export default function StudioEdul() {
  const [currentAnimation, setCurrentAnimation] = useState('two-mirrors');

  return (
    <Layout title="Portfolio - Studio Edul">

      {/* Animation Container */}
      <div style={{ position: 'relative', width: '100%' }}>

        <TwoMirrors visible={currentAnimation === 'two-mirrors'} />
        <InfinityMirror3D visible={currentAnimation === 'infinity-3d'} />

        {/* Switcher UI */}
        <div className={styles.switcher}>
          <button
            className={`${styles.switchBtn} ${currentAnimation === 'two-mirrors' ? styles.active : ''}`}
            onClick={() => setCurrentAnimation('two-mirrors')}
          >
            2D Mirrors
          </button>
          <button
            className={`${styles.switchBtn} ${currentAnimation === 'infinity-3d' ? styles.active : ''}`}
            onClick={() => setCurrentAnimation('infinity-3d')}
          >
            3D Infinity
          </button>
        </div>

      </div>

    </Layout>
  );
}

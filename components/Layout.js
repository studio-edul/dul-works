import Head from 'next/head';
import React from 'react';
import Navigation from './Navigation';

export default function Layout({ children, title = 'Portfolio' }) {
  /*
  const [windowWidth, setWindowWidth] = React.useState(0);

  React.useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  */

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="preconnect" href="https://www.notion.so" />
        <link rel="dns-prefetch" href="https://www.notion.so" />
        <link rel="icon" href="data:;base64,iVBORw0KGgo=" />
      </Head>
      {/* <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 9999, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '12px' }}>
        Width: {windowWidth}px
      </div> */}
      <Navigation />
      {children}
    </>
  );
}


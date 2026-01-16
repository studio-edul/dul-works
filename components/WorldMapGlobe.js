import React, { useRef, useState, useEffect } from 'react';

// 더 정확한 세계 지도 좌표 데이터 (라인 아트 스타일)
const WORLD_COASTLINES = [
  // 북미 서부 해안
  [-168, 65, -140, 60, -130, 55, -125, 49, -123, 48, -120, 46, -118, 45, -115, 43, -110, 40, -105, 35, -100, 30, -95, 25, -90, 20, -85, 15, -80, 10],
  // 북미 동부 해안
  [-80, 10, -75, 15, -70, 20, -65, 25, -60, 30, -55, 35, -50, 40, -45, 45, -40, 50, -35, 55, -30, 60, -25, 65],
  // 남미 서부 해안
  [-80, 10, -78, 5, -76, 0, -75, -5, -73, -10, -71, -15, -70, -20, -70, -25, -71, -30, -73, -35, -75, -40, -73, -45, -70, -50, -68, -55],
  // 남미 동부 해안
  [-68, -55, -60, -50, -50, -45, -40, -40, -35, -35, -30, -30, -25, -25, -20, -20, -15, -15, -10, -10, -5, -5, 0, 0, 5, 5, 10, 10],
  // 유럽 서부 해안
  [-10, 60, -5, 55, 0, 50, 5, 45, 10, 40, 15, 35, 20, 30],
  // 아프리카 서부 해안
  [-15, 15, -10, 10, -5, 5, 0, 0, 5, -5, 10, -10, 15, -15, 20, -20, 25, -25, 30, -30, 35, -35],
  // 아프리카 동부 해안
  [35, -35, 40, -30, 45, -25, 50, -20, 45, -15, 40, -10, 35, -5, 30, 0, 25, 5, 20, 10, 15, 15, 10, 20, 5, 25, 0, 30, -5, 35],
  // 아시아 동부 해안
  [120, 25, 125, 30, 130, 35, 135, 40, 140, 45, 145, 50, 150, 55, 155, 60],
  // 호주
  [115, -20, 120, -18, 125, -20, 130, -22, 135, -25, 140, -28, 145, -30, 150, -32, 155, -35, 150, -38, 145, -40, 140, -38, 135, -35, 130, -32, 125, -30, 120, -28, 115, -25, 115, -20],
  // 일본
  [130, 35, 135, 38, 140, 40, 142, 38, 140, 35, 135, 33, 130, 35],
  // 영국
  [-5, 50, -2, 52, 0, 54, 2, 55, 5, 54, 2, 52, -2, 50, -5, 50],
];

function WorldMapCanvas() {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const drawMap = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 위경도를 캔버스 좌표로 변환하는 함수 (Mercator 투영)
      const project = (lon, lat) => {
        const x = ((lon + 180) / 360) * width;
        const y = ((90 - lat) / 180) * height;
        return { x, y };
      };

      // 각 대륙의 해안선 그리기
      WORLD_COASTLINES.forEach((coastline) => {
        ctx.beginPath();
        let isFirst = true;
        
        for (let i = 0; i < coastline.length; i += 2) {
          const lon = coastline[i];
          const lat = coastline[i + 1];
          const projected = project(lon, lat);
          
          if (isFirst) {
            ctx.moveTo(projected.x, projected.y);
            isFirst = false;
          } else {
            ctx.lineTo(projected.x, projected.y);
          }
        }
        
        ctx.stroke();
      });

      // 위도/경도 그리드 (옅게)
      ctx.strokeStyle = '#000000';
      ctx.globalAlpha = 0.08;
      ctx.lineWidth = 0.5;
      
      // 경도선
      for (let lon = -180; lon <= 180; lon += 30) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 2) {
          const projected = project(lon, lat);
          if (lat === -90) {
            ctx.moveTo(projected.x, projected.y);
          } else {
            ctx.lineTo(projected.x, projected.y);
          }
        }
        ctx.stroke();
      }
      
      // 위도선
      for (let lat = -90; lat <= 90; lat += 30) {
        ctx.beginPath();
        for (let lon = -180; lon <= 180; lon += 2) {
          const projected = project(lon, lat);
          if (lon === -180) {
            ctx.moveTo(projected.x, projected.y);
          } else {
            ctx.lineTo(projected.x, projected.y);
          }
        }
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;
    };

    drawMap();
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = canvasRef.current.getBoundingClientRect();
    setLastPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const deltaX = currentX - lastPos.x;
    const deltaY = currentY - lastPos.y;
    
    setRotation(prev => ({
      x: Math.max(-Math.PI / 2, Math.min(Math.PI / 2, prev.x + deltaY * 0.01)),
      y: prev.y + deltaX * 0.01
    }));
    
    setLastPos({ x: currentX, y: currentY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, lastPos]);

  return (
    <canvas
      ref={canvasRef}
      width={1240}
      height={620}
      onMouseDown={handleMouseDown}
      style={{
        width: '100%',
        height: '100%',
        cursor: isDragging ? 'grabbing' : 'grab',
        display: 'block'
      }}
    />
  );
}

export default function WorldMapGlobe() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '310px', position: 'relative' }}>
      <WorldMapCanvas />
    </div>
  );
}

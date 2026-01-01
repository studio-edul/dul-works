import Layout from '../../components/Layout';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { getArtworkBySlug, getAllArtworkSlugs } from '../../lib/artwork-detail-processor';

export default function ArtworkDetail({ artwork }) {
  const textColumnRef = useRef(null);
  const state = useRef({
    currentY: 0,
    targetY: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 초기 위치 설정: nav 메뉴 아래 위치 고려
    const navOffset = 0; // nav margin-bottom(120px) + body padding-top(120px) = 240px, 하지만 실제로는 120px 정도면 충분
    state.current.currentY = navOffset;
    state.current.targetY = navOffset;

    let rafId;

    const handleScroll = () => {
      // 목표 위치: nav 메뉴 아래 위치 고려
      state.current.targetY = window.scrollY;
    };

    // 그리드 첫 번째 열 너비 계산 및 적용
    const updateTextColumnWidth = () => {
      if (textColumnRef.current) {
        const container = textColumnRef.current.parentElement;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const containerWidth = containerRect.width;
          const padding = 30; // 15px * 2
          
          // 반응형 너비 계산
          let columnWidth;
          if (containerWidth < 640) {
            // 640px 미만: 1열 레이아웃
            columnWidth = containerWidth - padding;
          } else if (containerWidth < 1024) {
            // 1024px 미만: 2열 레이아웃
            const gap = 10;
            columnWidth = (containerWidth - padding - gap) / 2;
          } else {
            // 1024px 이상: 3열 레이아웃
            const gap = 20; // gap 10px * 2
            columnWidth = (containerWidth - padding - gap) / 3;
          }
          
          textColumnRef.current.style.width = `${columnWidth}px`;
          textColumnRef.current.style.maxWidth = `${columnWidth}px`;
        }
      }
    };

    const animate = () => {
      const { currentY, targetY } = state.current;

      // Lerp (Linear Interpolation) 적용: 현재 위치를 목표 위치로 부드럽게 이동
      const ease = 0.15;
      const nextY = currentY + (targetY - currentY) * ease;

      state.current.currentY = nextY;

      if (textColumnRef.current) {
        // transform을 사용하여 GPU 가속 활용
        textColumnRef.current.style.transform = `translateY(${nextY}px)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      handleScroll();
      updateTextColumnWidth();
    });

    // 초기 너비 설정
    updateTextColumnWidth();

    // 애니메이션 루프 시작
    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!artwork) {
    return (
      <Layout title="Portfolio - Work Detail">
        <div>작품을 찾을 수 없습니다.</div>
      </Layout>
    );
  }

  // 이미지를 열별로 그룹화
  const column1Images = (artwork.images || []).filter(img => img.column === 1);
  const column2Images = (artwork.images || []).filter(img => img.column === 2);
  // 2열 레이아웃을 위해 모든 이미지 합치기
  const allImages = [...column1Images, ...column2Images];

  return (
    <Layout title={`Portfolio - ${artwork.name}`}>
      <div className="artwork-detail-container">
        {/* 1번째 열: 텍스트 정보 (absolute로 배치) */}
        <div ref={textColumnRef} className="artwork-detail-text-column">
          <div className="artwork-detail-name">{artwork.name}</div>
          {(artwork.artist || artwork.timeline || artwork.caption) && (
            <div className="artwork-detail-metadata">
              {artwork.artist && (
                <div className="artwork-detail-artist">{artwork.artist}</div>
              )}
              {artwork.timeline && (
                <div className="artwork-detail-timeline">{artwork.timeline}</div>
              )}
              {artwork.caption && (
                <div className="artwork-detail-caption">{artwork.caption}</div>
              )}
            </div>
          )}
          {artwork.pageText && (
            <div className="artwork-detail-page-text">
              {Array.isArray(artwork.pageText) ? (
                artwork.pageText.map((paragraph, idx) => {
                  if (paragraph === null) {
                    // 문단 구분 (작은 간격)
                    return <div key={idx} className="artwork-detail-paragraph-break"></div>;
                  }
                  return <p key={idx} className="artwork-detail-paragraph">{paragraph}</p>;
                })
              ) : (
                <div>{artwork.pageText}</div>
              )}
            </div>
          )}
        </div>
        
        {/* 1번째 열 placeholder (그리드 레이아웃 유지) */}
        <div className="artwork-detail-column-placeholder"></div>
        
        {/* 2번째 열: column이 1인 이미지들 */}
        <div className="artwork-detail-column artwork-detail-column-1">
          {column1Images.map((image, idx) => (
            <div key={idx} className="artwork-detail-image-wrapper">
              <Image
                src={image.path}
                alt={`${artwork.name} - Image ${image.row}`}
                width={500}
                height={500}
                className="artwork-detail-image"
                loading="lazy"
                quality={90}
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </div>
          ))}
        </div>
        
        {/* 3번째 열: column이 2인 이미지들 */}
        <div className="artwork-detail-column artwork-detail-column-2">
          {column2Images.map((image, idx) => (
            <div key={idx} className="artwork-detail-image-wrapper">
              <Image
                src={image.path}
                alt={`${artwork.name} - Image ${image.row}`}
                width={500}
                height={500}
                className="artwork-detail-image"
                loading="lazy"
                quality={90}
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </div>
          ))}
        </div>
        
        {/* 반응형: 2열 레이아웃용 이미지 컬럼 (1024px 미만) */}
        <div className="artwork-detail-column artwork-detail-column-responsive">
          {allImages.map((image, idx) => (
            <div key={idx} className="artwork-detail-image-wrapper">
              <Image
                src={image.path}
                alt={`${artwork.name} - Image ${image.row}`}
                width={500}
                height={500}
                className="artwork-detail-image"
                loading="lazy"
                quality={90}
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  try {
    const slugs = await getAllArtworkSlugs();
    
    return {
      paths: slugs.map(slug => ({
        params: { slug }
      })),
      fallback: 'blocking' // 새로운 slug는 빌드 시 생성, 없으면 404
    };
  } catch (error) {
    console.error('getStaticPaths 오류:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const artwork = await getArtworkBySlug(params.slug);
    
    if (!artwork) {
      return {
        notFound: true
      };
    }
    
    return {
      props: {
        artwork
      },
      revalidate: 60 // ISR: 60초마다 재생성
    };
  } catch (error) {
    console.error('getStaticProps 오류:', error);
    return {
      notFound: true
    };
  }
}


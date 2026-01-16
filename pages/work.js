import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import WorkContent from '../components/WorkContent';
import SideMenu from '../components/SideMenu';

export default function Work({ projects, artworkMap, exhibitions, timelines, timelineImageMap }) {
  const router = useRouter();
  const [currentView, setCurrentView] = useState('project');

  // URL 쿼리에 따른 뷰 모드 설정 (뒤로 가기 대응)
  useEffect(() => {
    if (router.isReady) {
      const { view } = router.query;
      if (view && ['project', 'exhibition', 'timeline'].includes(view)) {
        setCurrentView(view);
      } else {
        // 쿼리가 없으면 디폴트로 project
        setCurrentView('project');
      }
    }
  }, [router.isReady, router.query]);

  const handleViewChange = (newView) => {
    if (newView === currentView) return;

    // 현재 URL의 뷰와 동일하면 이동하지 않음 (런타임 에러 방지)
    const currentQueryView = router.query.view || 'project'; // 쿼리가 없으면 project로 간주
    if (newView === currentQueryView) return;

    // URL을 업데이트하여 뒤로 가기 시 상태를 유지함
    router.push(
      { pathname: '/work', query: { view: newView } },
      undefined,
      { shallow: true }
    );
  };

  const viewOptions = [
    { id: 'project', label: 'PROJECT' },
    { id: 'exhibition', label: 'EXHIBITION' },
    { id: 'timeline', label: 'TIMELINE' },
  ];

  return (
    <Layout title="Portfolio - Work">
      <SideMenu
        options={viewOptions}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      <WorkContent view={currentView} projects={projects} artworkMap={artworkMap} exhibitions={exhibitions} timelines={timelines} timelineImageMap={timelineImageMap} />
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const { getWORKDataServer, getARTWORKDataServer } = await import('../lib/notion-api-server');
    const { processWorkData } = await import('../lib/work-processor');
    const { processExhibitionData } = await import('../lib/exhibition-processor');
    const { processTimelineData } = await import('../lib/timeline-processor');
    const { preloadAllArtworkImages, preloadAllTimelineImages } = await import('../lib/artwork-processor');

    const [workData, artworkData] = await Promise.all([
      getWORKDataServer(),
      getARTWORKDataServer()
    ]);

    const projects = processWorkData(workData);
    const exhibitions = await processExhibitionData(workData);
    const timelines = processTimelineData(workData);
    const artworkMap = await preloadAllArtworkImages(workData, artworkData);
    const timelineImageMap = await preloadAllTimelineImages(timelines, artworkData);

    return {
      props: {
        projects,
        artworkMap,
        exhibitions,
        timelines,
        timelineImageMap
      },
      revalidate: 60 // ISR: 60초마다 재생성
    };
  } catch (error) {
    console.error('Work 데이터 로드 오류:', error);
    return {
      props: {
        projects: [],
        artworkMap: {},
        exhibitions: [],
        timelines: [],
        timelineImageMap: {}
      }
    };
  }
}

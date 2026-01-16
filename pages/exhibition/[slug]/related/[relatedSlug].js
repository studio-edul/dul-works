import Layout from '../../../../components/Layout';
import { getExhibitionBasicBySlug, getExhibitionSecondaryData, getAllExhibitionSlugs, getRelatedTextPage } from '../../../../lib/exhibition-detail-processor';
import { createSlug } from '../../../../lib/slug-utils';

export default function ExhibitionRelatedText({ exhibition, relatedText, relatedTextSlug }) {
  if (!exhibition || !relatedText) {
    return (
      <Layout title="Portfolio - Related Text">
        <div>관련 텍스트를 찾을 수 없습니다.</div>
      </Layout>
    );
  }

  return (
    <Layout title={`Portfolio - ${relatedText.title || 'Related Text'}`}>
      <div className="related-text-page-container">
        <h1 className="related-text-page-title">{relatedText.title || 'Related Text'}</h1>

        {relatedText.content && (
          <div className="related-text-page-content">
            {Array.isArray(relatedText.content) ? (
              relatedText.content.map((paragraph, idx) => {
                if (paragraph === null) {
                  return <div key={idx} className="artwork-detail-paragraph-break"></div>;
                }

                if (Array.isArray(paragraph)) {
                  return (
                    <p key={idx} className="artwork-detail-paragraph">
                      {paragraph.map((textItem, textIdx) => {
                        const text = textItem.plain_text || '';
                        const annotations = textItem.annotations || {};

                        if (annotations.bold) {
                          return <strong key={textIdx}>{text}</strong>;
                        }
                        return <span key={textIdx}>{text}</span>;
                      })}
                    </p>
                  );
                }

                return <p key={idx} className="artwork-detail-paragraph">{paragraph}</p>;
              })
            ) : (
              <div>{relatedText.content}</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  try {
    console.log('[RelatedText] getStaticPaths 시작');
    const exhibitionSlugs = await getAllExhibitionSlugs();
    console.log(`[RelatedText] 전시 slug 개수: ${exhibitionSlugs.length}`);
    const paths = [];

    // 각 전시의 Related Text들을 가져와서 경로 생성
    for (const slug of exhibitionSlugs) {
      try {
        // getStaticPaths에서는 Basic 데이터만 있어도 Related Text 정보 추출 가능 (Secondary Data 사용)
        const { relatedTexts } = await getExhibitionSecondaryData(slug);
        if (relatedTexts && relatedTexts.length > 0) {
          console.log(`[RelatedText] 전시 "${slug}"에서 ${relatedTexts.length}개의 관련 텍스트 발견`);
          for (const relatedText of relatedTexts) {
            const relatedSlug = createSlug(relatedText.title);
            paths.push({
              params: {
                slug: slug,
                relatedSlug: relatedSlug
              }
            });
          }
        }
      } catch (innerError) {
        console.error(`[RelatedText] 전시 "${slug}" 처리 중 오류:`, innerError);
      }
    }

    console.log(`[RelatedText] 총 생성된 경로 개수: ${paths.length}`);
    return {
      paths,
      fallback: 'blocking'
    };
  } catch (error) {
    console.error('[RelatedText] getStaticPaths 전체 오류:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    console.log(`[RelatedText] getStaticProps 시작 - slug: ${params.slug}, relatedSlug: ${params.relatedSlug}`);

    // 병렬로 데이터 가져오기 (Exhibition 기본 정보 + Related/Artwork 정보)
    const [exhibitionBasic, secondaryData] = await Promise.all([
      getExhibitionBasicBySlug(params.slug),
      getExhibitionSecondaryData(params.slug)
    ]);

    const exhibition = { ...exhibitionBasic, ...secondaryData };

    if (!exhibition) {
      console.error(`[RelatedText] 전시를 찾을 수 없음: ${params.slug}`);
      return {
        notFound: true
      };
    }

    // Related Text 찾기
    const relatedText = exhibition.relatedTexts?.find(rt => {
      const rtSlug = createSlug(rt.title);
      return rtSlug === params.relatedSlug;
    });

    if (!relatedText) {
      console.error(`[RelatedText] 관련 텍스트를 찾을 수 없음: ${params.relatedSlug} in ${params.slug}`);
      console.log(`[RelatedText] 사용 가능한 관련 텍스트:`, exhibition.relatedTexts?.map(rt => createSlug(rt.title)));
      return {
        notFound: true
      };
    }

    // Related Text 페이지 내용 가져오기
    const relatedTextContent = await getRelatedTextPage(relatedText.pageId);

    return {
      props: {
        exhibition,
        relatedText: {
          ...relatedText,
          content: relatedTextContent?.content || []
        },
        relatedTextSlug: params.relatedSlug
      },
      revalidate: 60
    };
  } catch (error) {
    console.error(`[RelatedText] getStaticProps 오류 (${params.slug}/${params.relatedSlug}):`, error);
    return {
      notFound: true
    };
  }
}


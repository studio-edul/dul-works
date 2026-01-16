// Exhibition 데이터 처리 유틸리티

import { extractText, extractDate, extractNumber, findProperty } from './notion-utils.js';

/**
 * Exhibition 항목에서 이미지 URL 추출 (Image 필드에서 파일명 읽기)
 */
function extractImageFromExhibition(item) {
  const properties = item.properties || {};

  // 1. Thumbnail 필드 확인 (우선순위)
  const thumbnailProperty = findProperty(
    properties,
    'Thumbnail', 'thumbnail', 'THUMBNAIL'
  );

  if (thumbnailProperty) {
    const thumbnailText = extractText(thumbnailProperty);
    if (thumbnailText && thumbnailText.trim() !== '') {
      const filename = thumbnailText.trim();
      // /assets/images/파일명 형식으로 반환 (확장자 체크 등은 필요시 추가)
      return `/assets/images/${filename}`;
    }
  }

  // 2. Image 필드 확인 (Fallback)
  const imageProperty = findProperty(
    properties,
    'Image', 'image', 'IMAGE'
  );

  if (!imageProperty) {
    return null;
  }

  // Image 필드에서 텍스트 추출
  const imageText = extractText(imageProperty);

  if (!imageText || imageText.trim() === '') {
    return null;
  }

  // 줄바꿈으로 분리하고 첫 번째 파일명만 사용
  const filenames = imageText.split('\n').map(f => f.trim()).filter(f => f !== '');

  if (filenames.length === 0) {
    return null;
  }

  // 첫 번째 파일명 사용 (소문자로 변환하여 일관성 유지)
  const firstFilename = filenames[0].toLowerCase();

  // /assets/images/파일명 형식으로 경로 생성
  return `/assets/images/${firstFilename}`;
}

/**
 * Exhibition 항목에서 데이터 추출
 */
export async function extractExhibitionData(item) {
  try {
    const properties = item.properties || {};

    const nameProperty = findProperty(
      properties,
      'Name', 'name', 'NAME',
      'Title', 'title', 'TITLE'
    );
    const name = extractText(nameProperty);

    const indexProperty = findProperty(
      properties,
      'Index', 'index', 'INDEX',
      'Order', 'order', 'ORDER',
      'Position', 'position', 'POSITION'
    );
    const index = extractNumber(indexProperty); // 정수 하나

    const periodProperty = findProperty(
      properties,
      'Period', 'period', 'PERIOD',
      'Date', 'date', 'DATE',
      'Year', 'year', 'YEAR',
      'Time', 'time', 'TIME'
    );
    const period = extractDate(periodProperty);

    const descriptionProperty = findProperty(
      properties,
      'Description EN', 'description en', 'Description En', 'Description en',
      'DESCRIPTION EN', 'DescriptionEN', 'descriptionEN',
      'Description', 'description', 'DESCRIPTION'
    );
    const description = extractText(descriptionProperty);

    // Image 필드에서 이미지 파일명 읽기
    const imageUrl = extractImageFromExhibition(item);

    // Class 정보 추출
    const classProperty = findProperty(
      properties,
      'Class', 'class', 'CLASS',
      'Type', 'type', 'TYPE',
      'Category', 'category', 'CATEGORY'
    );
    const classValue = extractText(classProperty);
    const normalizedClass = classValue ? classValue.toUpperCase().trim() : '';

    return {
      name: name || null,
      index: index !== null && !isNaN(index) ? index : null,
      period: period || '',
      description: description || '',
      imageUrl: imageUrl || null,
      classType: normalizedClass // SOLO EXHIBITION 또는 GROUP EXHIBITION
    };
  } catch (error) {
    console.error('Exhibition 데이터 추출 오류:', error);
    return null;
  }
}

/**
 * Work 데이터에서 EXHIBITION 클래스 항목만 필터링 및 정렬
 */
export async function processExhibitionData(workData) {
  try {
    if (!workData || workData.length === 0) {
      return [];
    }

    // EXHIBITION 클래스 필터링 (SOLO EXHIBITION, GROUP EXHIBITION)
    const exhibitionFiltered = workData.filter(item => {
      const properties = item.properties || {};
      const classProperty = findProperty(
        properties,
        'Class', 'class', 'CLASS',
        'Type', 'type', 'TYPE',
        'Category', 'category', 'CATEGORY'
      );

      if (!classProperty) {
        return false;
      }

      const classValue = extractText(classProperty);
      const normalizedClass = classValue.toUpperCase().trim();

      // SOLO EXHIBITION 또는 GROUP EXHIBITION인지 확인
      return normalizedClass === 'SOLO EXHIBITION' || normalizedClass === 'GROUP EXHIBITION';
    });

    if (exhibitionFiltered.length === 0) {
      return [];
    }

    const exhibitionItems = await Promise.all(
      exhibitionFiltered.map(extractExhibitionData)
    );

    const filteredItems = exhibitionItems.filter(item => item !== null && item.name !== null);

    // SOLO EXHIBITION과 GROUP EXHIBITION 분리
    const soloExhibitions = filteredItems.filter(item => item.classType === 'SOLO EXHIBITION');
    const groupExhibitions = filteredItems.filter(item => item.classType === 'GROUP EXHIBITION');

    // 각각 Index 기준으로 오름차순 정렬 (1, 2, 3... 순서)
    // Index가 없는 항목은 맨 뒤로
    const sortByIndex = (a, b) => {
      if (a.index === null && b.index === null) return 0;
      if (a.index === null) return 1;
      if (b.index === null) return -1;
      return a.index - b.index;
    };

    soloExhibitions.sort(sortByIndex);
    groupExhibitions.sort(sortByIndex);

    // SOLO 먼저, GROUP 나중에 합치기
    const sortedItems = [...soloExhibitions, ...groupExhibitions];

    return sortedItems;
  } catch (error) {
    console.error('[Exhibition] 데이터 처리 오류:', error);
    console.error('[Exhibition] 에러 스택:', error.stack);
    return [];
  }
}

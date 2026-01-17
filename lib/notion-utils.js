// Notion 데이터 파싱 유틸리티 함수들

/**
 * Notion property에서 텍스트 추출
 */
export function extractText(property) {
  if (!property) return '';

  if (property.title && property.title.length > 0) {
    return property.title.map(t => t.plain_text).join('');
  }
  if (property.rich_text && property.rich_text.length > 0) {
    return property.rich_text.map(t => t.plain_text).join('');
  }
  if (property.select) {
    return property.select.name || '';
  }
  if (property.date) {
    const date = property.date;
    if (date.start) {
      return date.end ? `${date.start} - ${date.end}` : date.start;
    }
  }
  if (typeof property.number === 'number') {
    return property.number.toString();
  }

  if (property.url) {
    return property.url;
  }

  return '';
}

/**
 * Notion property에서 날짜 추출
 */
export function extractDate(property) {
  if (!property) return '';

  if (property.date) {
    const date = property.date;
    if (date.start) {
      return date.end ? `${date.start} - ${date.end}` : date.start;
    }
  }
  if (property.rich_text && property.rich_text.length > 0) {
    return property.rich_text.map(t => t.plain_text).join('');
  }
  if (property.title && property.title.length > 0) {
    return property.title.map(t => t.plain_text).join('');
  }
  if (property.select) {
    return property.select.name || '';
  }

  return '';
}

/**
 * Notion property에서 숫자 추출
 */
export function extractNumber(property) {
  if (!property) return null;

  if (typeof property.number === 'number') {
    return property.number;
  }
  if (property.rich_text && property.rich_text.length > 0) {
    const text = property.rich_text[0].plain_text || '';
    const num = parseInt(text, 10);
    return isNaN(num) ? null : num;
  }
  if (property.title && property.title.length > 0) {
    const text = property.title[0].plain_text || '';
    const num = parseInt(text, 10);
    return isNaN(num) ? null : num;
  }

  return null;
}

/**
 * Notion property에서 인덱스 문자열 추출 (예: "2,3" 또는 "full")
 */
export function extractIndex(property) {
  if (!property) return null;

  if (property.rich_text && property.rich_text.length > 0) {
    return property.rich_text.map(t => t.plain_text).join('').trim() || null;
  }
  if (property.title && property.title.length > 0) {
    return property.title.map(t => t.plain_text).join('').trim() || null;
  }
  if (typeof property.number === 'number') {
    return property.number.toString();
  }
  if (property.select) {
    return property.select.name ? property.select.name.trim() : null;
  }
  if (property.formula) {
    if (property.formula.string) {
      return property.formula.string.trim();
    }
    if (property.formula.number) {
      return property.formula.number.toString();
    }
  }

  return null;
}

/**
 * Notion property에서 relation 추출 (ID 배열 반환)
 */
export function extractRelation(property) {
  if (!property || property.type !== 'relation' || !property.relation) return [];

  return property.relation.map(item => item.id);
}

/**
 * Notion property에서 타입이 title인 속성 찾기
 */
export function findTitleProperty(properties) {
  if (!properties) return null;
  for (const key in properties) {
    if (properties[key].type === 'title') {
      return properties[key];
    }
  }
  return null;
}

/**
 * Notion property에서 다양한 필드명으로 값 찾기
 */
export function findProperty(properties, ...fieldNames) {
  for (const fieldName of fieldNames) {
    const property = properties[fieldName];
    if (property) return property;
  }
  return null;
}

/**
 * Notion Page Cover 이미지에서 파일명 추출
 */
export function extractCoverImageFilename(item) {
  if (!item || !item.cover) return null;

  let url;
  if (item.cover.type === 'file') {
    url = item.cover.file.url;
  } else if (item.cover.type === 'external') {
    url = item.cover.external.url;
  }

  if (!url) return null;

  try {
    // URL 객체를 사용하여 경로 파싱
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    // URL 디코딩 (%20 -> 공백 등)
    const decodedPath = decodeURIComponent(pathname);
    // 경로의 마지막 부분이 파일명
    const filename = decodedPath.split('/').pop();
    return filename;
  } catch (e) {
    console.warn('URL parsing failed, trying simple split:', e);
    try {
      // URL 파싱 실패 시 단순 문자열 처리 시도
      const path = url.split('?')[0];
      const decoded = decodeURIComponent(path);
      return decoded.split('/').pop();
    } catch (e2) {
      console.error('Filename extraction failed:', e2);
      return null;
    }
  }
}


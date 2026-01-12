// URL slug 유틸리티 함수

/**
 * 프로젝트 이름을 URL-safe slug로 변환
 */
export function createSlug(name) {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}



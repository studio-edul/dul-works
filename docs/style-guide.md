# 스타일 가이드 (Style Guide)

이 문서는 프로젝트의 스타일 통합 작업을 바탕으로 작성된 스타일 적용 가이드입니다. 새로운 스타일을 추가하거나 기존 스타일을 수정할 때 이 가이드를 참고하세요.

## 목차

1. [CSS 변수 사용](#css-변수-사용)
2. [공통 클래스](#공통-클래스)
3. [전역 헤딩 스타일](#전역-헤딩-스타일)
4. [네이밍 컨벤션](#네이밍-컨벤션)
5. [미디어 쿼리 표준화](#미디어-쿼리-표준화)
6. [예시 코드](#예시-코드)

---

## CSS 변수 사용

모든 하드코딩된 값 대신 CSS 변수를 사용하여 일관성과 유지보수성을 확보합니다.

### Spacing 변수

마진, 패딩 등 간격 값은 반드시 다음 변수를 사용하세요:

```css
:root {
  --spacing-xs: 5px;    /* 매우 작은 간격 */
  --spacing-sm: 10px;   /* 작은 간격 */
  --spacing-md: 15px;   /* 중간 간격 */
  --spacing-lg: 30px;   /* 큰 간격 */
  --spacing-xl: 50px;   /* 매우 큰 간격 */
  --spacing-xxl: 100px; /* 가장 큰 간격 */
}
```

**사용 예시:**

```css
/* ❌ 잘못된 방법 */
.my-element {
  margin-bottom: 15px;
  padding: 10px;
}

/* ✅ 올바른 방법 */
.my-element {
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm);
}
```

**매핑 가이드:**
- `5px` → `var(--spacing-xs)`
- `10px` → `var(--spacing-sm)`
- `15px` → `var(--spacing-md)`
- `20px` → `var(--spacing-lg)` (30px로 통일)
- `30px` → `var(--spacing-lg)`
- `50px` → `var(--spacing-xl)`
- `100px` → `var(--spacing-xxl)`

### Opacity 변수

투명도 값은 다음 변수를 사용하세요:

```css
:root {
  --opacity-inactive: 0.3;  /* 비활성 상태 */
  --opacity-active: 1;      /* 활성 상태 */
}
```

**사용 예시:**

```css
/* ❌ 잘못된 방법 */
.inactive-text {
  opacity: 0.3;
}

/* ✅ 올바른 방법 */
.inactive-text {
  opacity: var(--opacity-inactive);
}
```

### Breakpoint 변수

미디어 쿼리에서 사용하는 브레이크포인트는 다음 변수를 사용하세요:

```css
:root {
  --breakpoint-mobile: 640px;
  --breakpoint-tablet: 1024px;
}
```

**사용 예시:**

```css
/* ❌ 잘못된 방법 */
@media (max-width: 1024px) {
  .responsive-element {
    display: none;
  }
}

/* ✅ 올바른 방법 */
@media (max-width: var(--breakpoint-tablet)) {
  .responsive-element {
    display: none;
  }
}

/* calc()를 사용한 경우 */
@media (max-width: calc(var(--breakpoint-tablet) - 1px)) {
  .responsive-element {
    display: none;
  }
}
```

### Column 변수

레이아웃 관련 변수:

```css
:root {
  --column-width: 595px;
  --column-gap: 10px;
  --full-width-image: calc(var(--column-width) * 2 + var(--column-gap));
}
```

---

## 공통 클래스

반복적으로 사용되는 스타일 패턴은 공통 클래스로 정의하여 재사용합니다.

### `.left-border`

왼쪽 패딩과 테두리를 함께 적용하는 클래스입니다.

```css
.left-border {
  padding-left: 10px;
  border-left: 1px solid black;
}
```

**사용 예시:**

```css
/* ❌ 잘못된 방법 */
.metadata {
  padding-left: 10px;
  border-left: 1px solid black;
}

.version-column {
  padding-left: 10px;
  border-left: 1px solid black;
}

/* ✅ 올바른 방법 */
.metadata {
  @apply left-border;
}

.version-column {
  @apply left-border;
}
```

**적용 위치:**
- 메타데이터 블록
- 버전 정보 컬럼
- 리스트 래퍼
- 관련 링크 래퍼

---

## 전역 헤딩 스타일

모든 페이지에서 일관된 헤딩 스타일을 사용하기 위해 전역 스타일이 정의되어 있습니다.

### 헤딩 태그 사용

```css
h1 {
  font-size: 30px;
  font-weight: bold;
}

h2 {
  font-size: 20px;
  font-weight: bold;
}

h3 {
  font-size: 16px;
  font-weight: bold;
}

h4 {
  font-size: 14px;
  font-weight: bold;
}
```

**사용 가이드:**

| 태그 | 크기 | 사용 예시 |
|------|------|-----------|
| `h1` | 30px | 페이지 메인 타이틀, 프로젝트 이름 |
| `h2` | 20px | 섹션 제목, 전시명 |
| `h3` | 16px | 서브 섹션 제목, 버전 정보 |
| `h4` | 14px | 작은 제목, 라벨 |

**사용 예시:**

```jsx
/* ❌ 잘못된 방법 */
<div className="project-title">신생공NEWBORN SPACE</div>
<div className="section-title">PROJECT OVERVIEW</div>

/* ✅ 올바른 방법 */
<h1 className="project-title">신생공NEWBORN SPACE</h1>
<h2 className="section-title">PROJECT OVERVIEW</h2>
```

**주의사항:**
- 헤딩 태그에 `font-size`나 `font-weight: bold`를 직접 지정하지 마세요. 전역 스타일이 자동으로 적용됩니다.
- 필요시 클래스명만 추가하여 다른 스타일(마진, 색상 등)을 적용할 수 있습니다.

---

## 네이밍 컨벤션

일관된 클래스 네이밍을 위해 다음 패턴을 따르세요.

### 프로젝트 상세 페이지 (`project-detail-newborn-*`)

현재 구조를 유지하되, 일관성 있게 네이밍합니다:

```
project-detail-newborn-[block-name]-[element-name]-[modifier]
```

**예시:**
- `.project-detail-newborn-section` - 블록
- `.project-detail-newborn-section-wrapper` - 블록의 래퍼
- `.project-detail-newborn-workflow-content` - 워크플로우 콘텐츠
- `.project-detail-newborn-workflow-row` - 워크플로우 행
- `.project-detail-newborn-version-item-active` - 활성 버전 아이템

**네이밍 규칙:**
- Block: `project-detail-newborn-[block-name]`
- Element: `project-detail-newborn-[block-name]-[element-name]`
- Modifier: `project-detail-newborn-[block-name]-[element-name]-[modifier]`

---

## 미디어 쿼리 표준화

모든 미디어 쿼리는 CSS 변수를 사용하여 표준화합니다.

### 표준 브레이크포인트

```css
/* Mobile */
@media (max-width: var(--breakpoint-mobile)) {
  /* 모바일 스타일 */
}

/* Tablet 이하 */
@media (max-width: var(--breakpoint-tablet)) {
  /* 태블릿 이하 스타일 */
}

/* Tablet 이상 */
@media (min-width: var(--breakpoint-tablet)) {
  /* 태블릿 이상 스타일 */
}

/* calc()를 사용한 정확한 브레이크포인트 */
@media (max-width: calc(var(--breakpoint-tablet) - 1px)) {
  /* 태블릿 미만 스타일 */
}
```

---

## 예시 코드

### 완전한 예시: 새로운 섹션 추가

```jsx
// 컴포넌트
<section className="project-detail-newborn-section">
  <h2 className="project-detail-newborn-title">NEW SECTION</h2>
  <div className="project-detail-newborn-content">
    <p className="project-detail-newborn-paragraph">
      섹션 내용입니다.
    </p>
    <div className="project-detail-newborn-metadata">
      <h4 className="project-detail-newborn-label">Label</h4>
      <div className="project-detail-newborn-value">
        Value
      </div>
    </div>
  </div>
</section>
```

```css
/* 스타일 */
.project-detail-newborn-section {
  margin-bottom: var(--spacing-xxl);
}

.project-detail-newborn-content {
  margin-top: var(--spacing-lg);
}

.project-detail-newborn-metadata {
  margin-top: var(--spacing-md);
}

.project-detail-newborn-value {
  @apply left-border;
  margin-top: var(--spacing-xs);
  opacity: var(--opacity-inactive);
}

/* 반응형 */
@media (max-width: var(--breakpoint-tablet)) {
  .project-detail-newborn-section {
    margin-bottom: var(--spacing-xl);
  }
}
```

### 예시: 리스트 아이템 스타일

```css
.my-list-item {
  @apply left-border;
  margin-bottom: var(--spacing-sm);
  font-size: 14px;
}

.my-list-item:last-child {
  margin-bottom: 0;
}

.my-list-item.inactive {
  opacity: var(--opacity-inactive);
}
```

---

## 체크리스트

새로운 스타일을 추가할 때 다음을 확인하세요:

- [ ] 하드코딩된 `margin-bottom`, `padding` 값 대신 spacing 변수 사용
- [ ] 하드코딩된 `opacity` 값 대신 opacity 변수 사용
- [ ] 하드코딩된 브레이크포인트 대신 breakpoint 변수 사용
- [ ] 왼쪽 패딩 + 테두리 패턴은 `.left-border` 클래스 사용
- [ ] 제목은 적절한 헤딩 태그(`h1`, `h2`, `h3`, `h4`) 사용
- [ ] 헤딩 태그에 `font-size`, `font-weight: bold` 직접 지정하지 않음
- [ ] 클래스 네이밍이 일관된 패턴을 따름
- [ ] 미디어 쿼리는 CSS 변수 사용

---

## 참고 파일

- `styles/globals.css` - 모든 스타일 정의
- `components/` - 컴포넌트별 스타일 사용 예시
- `pages/` - 페이지별 스타일 사용 예시

---

## 업데이트 이력

- 2024-XX-XX: 초기 문서 작성 (스타일 통합 작업 완료 후)

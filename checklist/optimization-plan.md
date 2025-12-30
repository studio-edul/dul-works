# Optimization and Refactoring Plan

This document outlines the tasks for optimizing and refactoring the Next.js + Notion API portfolio project.

## 1. Architecture & Code Structure

- [ ] **Review Data Fetching Strategy**:
    - Analyze the relationship between `lib/notion-api.js` (client-side) and `lib/notion-api-server.js` (server-side).
    - Ensure `pages/api/notion.js` correctly utilizes shared logic to avoid duplication.
    - Suggest or implement a unified entry point if applicable.
- [ ] **Standardize Imports**:
    - Check if path aliases (e.g., `@/components`) are configured in `jsconfig.json` or `tsconfig.json`. If not, propose adding them for cleaner imports.
- [ ] **Clean Up Unused Files**:
    - Identify any unused components or library files.

## 2. Component Optimization & Performance

- [ ] **`ExhibitionImage.js` Optimization**:
    - Review the `useEffect` based column width calculation.
    - Investigate if this can be replaced with CSS/consumer-based styling to prevent Cumulative Layout Shift (CLS) and reduce JS execution.
- [ ] **Image Optimization Audit**:
    - Verify `next/image` is used correctly in all components `ExhibitionItem.js`, `WorkContent.js`, etc.
    - Check `sizes` prop usage for responsiveness.
- [ ] **Font Loading**:
    - Verify `pages/_app.js` or `layout` for font loading strategy (currently using Google Fonts via Head).
    - Consider using `next/font` for better performance and zero layout shift.

## 3. Notion Integration & Data Processing

- [ ] **Script Efficiency**:
    - Review `scripts/download-images.js`. Ensure it handles errors gracefully and avoids re-downloading unchanged images if possible (caching mechanism).
- [ ] **Data Processing**:
    - Review `*-processor.js` files in `lib/` for robustness and type safety (even in JS).

## 4. Styling (Tailwind CSS)

- [ ] **Configuration Check**:
    - Review `tailwind.config.js` for correct content paths to ensure tree-shaking works.
    - Check for complex class strings and consider extracting to components or using `class-variance-authority` if complexity grows (though likely overkill here, good to check).

## 5. Documentation & Readability

- [ ] **JSDoc/Comments**:
    - Add JSDoc to core functions in `lib/notion-api-server.js` and processors.
    - Document the flow of data from Notion -> Script -> Frontend.
- [ ] **README Update**:
    - Ensure `README.md` reflects the current architecture and setup instructions.

## 6. Execution Order

1.  Standardize imports and clean up.
2.  Refactor `ExhibitionImage.js` and image handling.
3.  Add improved documentation.
4.  Optimize `download-images.js` if needed.

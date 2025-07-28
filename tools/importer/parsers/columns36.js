/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid with the two columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  const cols = Array.from(grid.children);
  if (cols.length < 2) return;

  // LEFT COLUMN: All content (heading, para, ctas)
  const leftCol = cols[0];

  // RIGHT COLUMN: All images in nested grid
  let rightColImages = [];
  const nestedImageGrid = cols[1].querySelector('.grid-layout');
  if (nestedImageGrid) {
    rightColImages = Array.from(nestedImageGrid.querySelectorAll('img'));
  } else {
    rightColImages = Array.from(cols[1].querySelectorAll('img'));
  }

  // Compose the block table
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns36)'],      // Header row: EXACTLY one cell
    [leftCol, rightColImages]     // Content row: one cell per column
  ], document);

  element.replaceWith(table);
}

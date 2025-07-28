/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout that holds the columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  // Get all direct children of the grid (no deep query for resilience)
  const columns = Array.from(grid.children);

  // For this block, there are 3 columns: text, list, image
  // Reference the actual elements from the DOM to preserve all content
  const leftCol = columns[0] || document.createElement('div');
  const midCol = columns[1] || document.createElement('div');
  const rightCol = columns[2] || document.createElement('div');

  // Table header should be a SINGLE cell (one column), matching the example
  const headerRow = ['Columns (columns18)'];
  // Table content row: three columns (as in the example)
  const contentRow = [leftCol, midCol, rightCol];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}

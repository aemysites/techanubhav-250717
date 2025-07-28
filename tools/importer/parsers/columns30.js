/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout inside the section
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all direct children (columns)
  const columns = Array.from(grid.children);
  // Defensive: if there are less than 2, not a real columns block
  if (columns.length < 2) return;

  // Compose the table cells
  // HEADER ROW: one cell only, must match example exactly
  const cells = [
    ['Columns (columns30)'],
    columns
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

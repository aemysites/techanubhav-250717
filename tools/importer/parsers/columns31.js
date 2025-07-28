/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid-layout containing the columns
  let grid = element.querySelector('.grid-layout');
  if (!grid) {
    if (element.classList.contains('grid-layout')) {
      grid = element;
    } else {
      grid = element;
    }
  }
  // Get immediate column children
  const columns = Array.from(grid.children);
  if (!columns.length) return;
  // Build the block table: header (single cell), content row (one cell per column)
  const cells = [
    ['Columns (columns31)'],
    columns,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

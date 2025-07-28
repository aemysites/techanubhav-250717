/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid-layout (columns container)
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get the direct children (the columns)
  const columns = Array.from(grid.children).filter(col => col && (col.textContent.trim() || col.querySelector('img,a,video,iframe')));
  if (!columns.length) return;

  // Build the header row: exactly one cell
  const headerRow = ['Columns (columns31)'];

  // Build the content row: one cell per column
  const contentRow = columns;

  // Assemble table rows: header row (1 cell), then content row (N cells)
  const cells = [
    headerRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

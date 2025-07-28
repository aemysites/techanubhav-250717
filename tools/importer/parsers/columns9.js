/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the .container, then the grid inside it
  const container = element.querySelector('.container');
  if (!container) return;
  const grid = container.querySelector('.w-layout-grid');
  if (!grid) return;

  // Each direct child of the grid is a column cell
  const columns = Array.from(grid.children);
  if (!columns.length) return;

  // Header row: exactly one column with the specified text
  const headerRow = ['Columns (columns9)'];
  // Content row: one cell per column
  const contentRow = columns;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}

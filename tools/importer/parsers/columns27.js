/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout containing the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get each column (direct children of grid)
  const columns = Array.from(grid.children);
  if (columns.length === 0) return;

  // The header row must be a single cell/column, regardless of content columns
  const rows = [
    ['Columns (columns27)'], // header row: always one cell
    columns, // content row: one cell per column
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Fix the header row: merge the header <th> across all columns using colspan
  // WebImporter.DOMUtils.createTable doesn't support colspan directly, so patch it here
  const th = table.querySelector('tr:first-child th');
  if (th && columns.length > 1) {
    th.setAttribute('colspan', columns.length);
    // Remove any extra th created in the header row
    let nextTh = th.nextElementSibling;
    while (nextTh) {
      let remove = nextTh;
      nextTh = nextTh.nextElementSibling;
      remove.parentNode.removeChild(remove);
    }
  }

  // Replace the original element with the new block table
  element.replaceWith(table);
}

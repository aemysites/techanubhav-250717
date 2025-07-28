/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid element containing columns
  const grid = element.querySelector('.w-layout-grid');
  let colElements = [];
  if (grid) {
    colElements = Array.from(grid.children);
  } else {
    colElements = Array.from(element.children);
  }
  // Remove empty columns, just in case
  colElements = colElements.filter(col => {
    return col.textContent.trim() !== '' || col.children.length > 0;
  });
  // Table header: exactly one cell, as per spec
  const headerRow = ['Columns (columns7)'];
  // Content row: as many cells as columns in grid
  const contentRow = colElements;
  // Build the table: header is always a single cell, content row matches columns
  const cells = [
    headerRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

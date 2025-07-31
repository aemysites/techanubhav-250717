/* global WebImporter */
export default function parse(element, { document }) {
  // Find all the columns in the block
  let columns = [];
  const slList = element.querySelector('.sl-list');
  if (slList) {
    columns = Array.from(slList.children);
  }

  // For each column, use the <section> inside the .sl-item, or the .sl-item itself if no section
  const columnCells = columns.map(col => {
    const section = col.querySelector('section') || col;
    return section;
  });

  // Header row: single cell as in the example
  const headerRow = ['Columns (columns4)'];

  // Build the table: header row (single cell), then content row (one cell per column)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnCells
  ], document);
  
  element.replaceWith(table);
}

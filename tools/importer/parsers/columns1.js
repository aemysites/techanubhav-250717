/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid layout holding the columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  // Get direct children of the grid (columns)
  const columns = Array.from(grid.children);
  // Per the HTML, first column is image, second is content (h1, p, buttons)

  // Reference existing DOM elements (do not clone!)
  const imageCol = columns[0];
  const contentCol = columns[1];
  if (!imageCol || !contentCol) return;

  // Compose the columns row: [image, text/button content]
  const columnsRow = [imageCol, contentCol];
  // Header row as per requirements
  const headerRow = ['Columns (columns1)'];
  // Compose the cells for the table
  const cells = [headerRow, columnsRow];
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the table
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main grid (contains the two columns)
  const grid = element.querySelector('.w-layout-grid.grid-layout.tablet-1-column');
  if (!grid) return;

  // Get the two main columns in the grid
  // First: text column, Second: images column
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;
  const leftCol = columns[0];
  const rightCol = columns[1];

  // LEFT CELL: should contain heading, subheading (p), and button group
  // Collect elements if they exist
  const leftCellContent = [];
  const leftH1 = leftCol.querySelector('h1');
  if (leftH1) leftCellContent.push(leftH1);
  const leftP = leftCol.querySelector('p');
  if (leftP) leftCellContent.push(leftP);
  const btnGroup = leftCol.querySelector('.button-group');
  if (btnGroup) leftCellContent.push(btnGroup);

  // RIGHT CELL: images, all from the nested grid within rightCol
  // This grid is likely the only child of rightCol
  let rightImages = [];
  const innerGrid = rightCol.querySelector('.w-layout-grid');
  if (innerGrid) {
    rightImages = Array.from(innerGrid.querySelectorAll('img'));
  }
  // If not found, try immediate children
  if (rightImages.length === 0) {
    rightImages = Array.from(rightCol.querySelectorAll('img'));
  }

  // Compose the table structure
  // First row: single header cell
  // Second row: two columns (left: text/buttons, right: images)
  const cells = [
    ['Columns (columns36)'],
    [leftCellContent, rightImages]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

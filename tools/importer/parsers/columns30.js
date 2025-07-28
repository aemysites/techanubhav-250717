/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout containing the 3 columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  const gridChildren = Array.from(grid.children);
  if (gridChildren.length < 4) return;

  // Create the header row with EXACTLY the string specified (no <strong>, just plain text)
  const headerRow = ['Columns (columns30)'];

  // Rows: 3 columns in the content row
  // 1st column: Name (Taylor Brooks)
  const col1 = gridChildren[0];

  // 2nd column: tags
  const tagsWrapper = document.createElement('div');
  tagsWrapper.appendChild(gridChildren[1]);

  // 3rd column: heading and description
  const rightWrapper = document.createElement('div');
  rightWrapper.appendChild(gridChildren[2]);
  rightWrapper.appendChild(gridChildren[3]);

  const row2 = [col1, tagsWrapper, rightWrapper];

  const cells = [headerRow, row2];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

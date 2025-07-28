/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container with the grid layout containing columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all immediate children of the grid; should be 2 for this layout
  const gridChildren = Array.from(grid.children);
  // Expecting: [leftCol (content), rightCol (img)]
  let leftCol = null;
  let rightCol = null;
  for (const child of gridChildren) {
    if (!leftCol && child.tagName !== 'IMG') {
      leftCol = child;
    } else if (!rightCol && child.tagName === 'IMG') {
      rightCol = child;
    }
  }

  // Build table
  const headerRow = ['Columns (columns27)'];
  const colsRow = [leftCol, rightCol].filter(Boolean); // Only add columns that exist
  const cells = [headerRow, colsRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

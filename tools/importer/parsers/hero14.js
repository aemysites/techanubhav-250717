/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name as specified
  const headerRow = ['Hero (hero14)'];

  // 2. Background image row (row 2): find the background image on the left grid column
  let imageCell = '';
  const grid = element.querySelector('.grid-layout');
  if (grid && grid.children.length > 0) {
    const leftCol = grid.children[0];
    const backgroundImg = leftCol.querySelector('img');
    if (backgroundImg) {
      imageCell = backgroundImg;
    }
  }

  // 3. Content row: heading, subheading, cta etc (right grid column)
  let contentCell = '';
  if (grid && grid.children.length > 1) {
    const rightCol = grid.children[1];
    // The content is typically inside a main container, but fallback to the column
    const contentContainer = rightCol.querySelector('.utility-margin-bottom-6rem') || rightCol;
    contentCell = contentContainer;
  }

  // Build the table cells as per spec: 1 col, 3 rows
  const cells = [
    headerRow,
    [imageCell],
    [contentCell],
  ];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

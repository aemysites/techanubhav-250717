/* global WebImporter */
export default function parse(element, { document }) {
  // Get the grid container (columns)
  const grid = element.querySelector(':scope > .container > .grid-layout');
  if (!grid) return;

  // Get all direct children of grid, which are the columns
  const cols = Array.from(grid.children);
  if (cols.length < 2) return;

  // The expectation is: first col = image, second col = text/buttons
  // Reference the actual column elements directly to preserve all content/structure
  const firstCol = cols[0];
  const secondCol = cols[1];

  // Compose the header row exactly as in the example
  const headerRow = ['Columns (columns1)'];

  // Compose the table rows per the structure
  const tableRows = [
    headerRow,
    [firstCol, secondCol],
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}

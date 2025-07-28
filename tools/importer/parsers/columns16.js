/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main column groupings in the layout
  const mainGrids = element.querySelectorAll(':scope > .container > .w-layout-grid');
  if (!mainGrids || mainGrids.length < 2) return;

  // --- First grid (headline/text/button on left, description/author/button on right) ---
  const firstGridDivs = mainGrids[0].querySelectorAll(':scope > div');
  if (firstGridDivs.length < 2) return;
  const leftCol = firstGridDivs[0]; // headline etc
  const rightCol = firstGridDivs[1]; // description, author, button

  // --- Second grid (two images) ---
  const secondGridDivs = mainGrids[1].querySelectorAll(':scope > .utility-aspect-1x1');
  if (secondGridDivs.length < 2) return;
  const img1Div = secondGridDivs[0];
  const img2Div = secondGridDivs[1];

  // Content for columns
  // Left column: leftCol and rightCol (as in the design example, both together)
  // Right column: both images stacked
  const leftCell = [leftCol, rightCol];
  const rightCell = [img1Div, img2Div];

  // Build the columns block table
  const cells = [
    ['Columns (columns16)'],
    [leftCell, rightCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

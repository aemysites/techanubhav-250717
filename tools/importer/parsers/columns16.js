/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function directChildren(parent, selector) {
    return Array.from(parent.children).filter(child => child.matches(selector));
  }

  // Find the two main column grids for this layout
  const container = element.querySelector(':scope > .container');
  if (!container) return;

  // The first grid contains the text and author side (two columns)
  const mainGrids = container.querySelectorAll(':scope > .w-layout-grid');
  const firstGrid = mainGrids[0];
  if (!firstGrid) return;

  // The two columns of the first grid
  const colDivs = directChildren(firstGrid, 'div, .flex-horizontal, .flex-vertical');
  const leftCol = colDivs[0];
  const rightCol = colDivs[1];

  // The second grid contains the images (two columns)
  // It may be the next .w-layout-grid (with mobile-portrait-1-column class)
  const galleryGrid = container.querySelector('.w-layout-grid.mobile-portrait-1-column');
  let leftImgCol = null, rightImgCol = null;
  if (galleryGrid) {
    const imgCols = directChildren(galleryGrid, 'div');
    leftImgCol = imgCols[0];
    rightImgCol = imgCols[1];
  }

  // Build table: header, first content row, second image row
  const headerRow = ['Columns (columns16)'];
  const firstRow = [leftCol, rightCol];
  const secondRow = [leftImgCol, rightImgCol];

  // Remove any undefined cells for edge cases
  const rows = [headerRow];
  if (leftCol || rightCol) rows.push([leftCol, rightCol]);
  if (leftImgCol || rightImgCol) rows.push([leftImgCol, rightImgCol]);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

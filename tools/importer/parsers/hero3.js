/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, must match the example exactly
  const headerRow = ['Hero (hero3)'];

  // Get the two main columns from the grid layout
  const gridDivs = element.querySelectorAll(':scope > .w-layout-grid > div');

  // Extract background image element (first grid child, img inside)
  let bgImgEl = null;
  if (gridDivs.length > 0) {
    bgImgEl = gridDivs[0].querySelector('img');
  }
  const imageRow = [bgImgEl ? bgImgEl : ''];

  // Extract content block (second grid child, .card inside)
  let contentBlock = null;
  if (gridDivs.length > 1) {
    // The first .card inside the content area
    contentBlock = gridDivs[1].querySelector('.card');
  }
  const contentRow = [contentBlock ? contentBlock : ''];

  // Compose table: 1 col, 3 rows (header, image, content)
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

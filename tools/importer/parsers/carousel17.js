/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the images
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all container divs for slides (immediate children of the grid)
  const slideDivs = Array.from(grid.children);

  // Prepare table rows
  const cells = [];
  // Header row: exactly one cell as in the example
  cells.push(['Carousel']);

  // Each slide: first cell is the image, second cell is text (none in this HTML)
  slideDivs.forEach(div => {
    const img = div.querySelector('img');
    // Only add row if image present
    if (img) {
      cells.push([img, '']); // Two columns: image, empty text
    }
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

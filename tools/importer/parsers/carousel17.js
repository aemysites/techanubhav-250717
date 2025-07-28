/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the carousel slides
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  const slides = Array.from(grid.children);

  // Build rows for the carousel block
  // Header row: single cell, as in the markdown example
  const rows = [['Carousel']];

  // All data rows must have two columns, even if the second is empty
  slides.forEach(slide => {
    const img = slide.querySelector('img');
    if (img) {
      rows.push([img, '']);
    }
  });

  // Now, ensure that the header row is truly a single cell,
  // but all subsequent rows are arrays of two cells.
  // WebImporter.DOMUtils.createTable will handle colspan automatically.
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

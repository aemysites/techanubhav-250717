/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name, as in example
  const headerRow = ['Hero (hero20)'];

  // Row 2: background image grid
  // Find the .ix-hero-scale-3x-to-1x .grid-layout div, which contains all the <img> for the background montage
  let bgImagesDiv = null;
  const scaleDiv = element.querySelector('.ix-hero-scale-3x-to-1x');
  if (scaleDiv) {
    const grid = scaleDiv.querySelector('.grid-layout');
    if (grid) {
      bgImagesDiv = grid;
    }
  }
  // Fallback if not found
  const bgImageRow = [bgImagesDiv ? bgImagesDiv : ''];

  // Row 3: content (heading, subheading, CTAs)
  // Find .ix-hero-scale-3x-to-1x-content .container (includes h1, p, and button group)
  let contentDiv = null;
  const contentSection = element.querySelector('.ix-hero-scale-3x-to-1x-content');
  if (contentSection) {
    const container = contentSection.querySelector('.container');
    if (container) {
      contentDiv = container;
    }
  }
  const contentRow = [contentDiv ? contentDiv : ''];

  // Assemble table block
  const cells = [
    headerRow,
    bgImageRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(table);
}

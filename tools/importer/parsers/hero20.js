/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches the block name
  const headerRow = ['Hero (hero20)'];

  // 2. Extract the background image collage (all <img> elements inside the large grid)
  const grid = element.querySelector('.ix-hero-scale-3x-to-1x .grid-layout');
  let bgDiv = null;
  if (grid) {
    // Get all images that are direct children of utility-position-relative
    const images = Array.from(grid.querySelectorAll(':scope > .utility-position-relative > img'));
    if (images.length) {
      bgDiv = document.createElement('div');
      images.forEach(img => bgDiv.appendChild(img));
      // Also add overlay if present
      const overlay = element.querySelector('.ix-hero-scale-3x-to-1x-overlay');
      if (overlay) bgDiv.appendChild(overlay);
    }
  }

  // 3. Extract the content: heading, subheading, and CTA(s)
  const contentContainer = element.querySelector('.ix-hero-scale-3x-to-1x-content .container');
  let contentDiv = null;
  if (contentContainer) {
    const contentNodes = [];
    // h1 heading (optional)
    const h1 = contentContainer.querySelector('h1');
    if (h1) contentNodes.push(h1);
    // subheading (could be .subheading or first <p>)
    let subheading = contentContainer.querySelector('.subheading');
    if (!subheading) subheading = contentContainer.querySelector('p');
    if (subheading) contentNodes.push(subheading);
    // CTA buttons (could be in .button-group)
    const buttonGroup = contentContainer.querySelector('.button-group');
    if (buttonGroup) contentNodes.push(buttonGroup);
    // Compose all into a div
    if (contentNodes.length) {
      contentDiv = document.createElement('div');
      contentNodes.forEach(node => contentDiv.appendChild(node));
    }
  }

  // 4. Compose the rows for the block
  const rows = [
    headerRow,
    [bgDiv || ''],
    [contentDiv || '']
  ];

  // 5. Create only one table, as in the markdown example, no Section Metadata block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

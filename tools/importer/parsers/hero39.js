/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row - use exact block name
  const headerRow = ['Hero (hero39)'];

  // 2. Background image row
  // Find the first <img> used as a background (not decorative overlays)
  let bgImg = null;
  // Try to find the main section grid (there may be nested grids)
  let innerGrids = element.querySelectorAll(':scope > div, :scope > .w-layout-grid, :scope > .grid-layout');
  // The first grid typically contains the image and overlay
  if (innerGrids.length > 0) {
    // In the first grid div, look for an img
    bgImg = innerGrids[0].querySelector('img');
  }
  // Fallback: any direct child img
  if (!bgImg) {
    bgImg = element.querySelector('img');
  }
  const bgImageRow = [bgImg ? bgImg : '']; // Reference the actual element if found

  // 3. Content row (headline, subheading, CTA)
  // Find the cell that contains headings/paragraphs/buttons -- it's typically the second grid div
  let contentCell = null;
  if (innerGrids.length > 1) {
    contentCell = innerGrids[1];
  } else {
    // Fallback: sometimes only one grid, so look for container
    contentCell = element.querySelector('.container');
  }
  // The content is a grid that has an h1, p, and button(s)
  let rowContent = [];
  if (contentCell) {
    // The grid cell may itself have sub-grids, but we want the main heading and everything beneath.
    // Get the inner grid or just use all children
    let innerContent = contentCell.querySelector('.w-layout-grid, .grid-layout, .y-bottom');
    if (innerContent) {
      // collect all direct children (so heading, then flex-vertical div)
      Array.from(innerContent.children).forEach((child) => {
        rowContent.push(child);
      });
    } else {
      // fallback: push all children of the contentCell
      Array.from(contentCell.children).forEach((child) => {
        rowContent.push(child);
      });
    }
  }
  if (!rowContent.length) rowContent = [''];

  // Compose the table
  const cells = [
    headerRow,
    bgImageRow,
    [rowContent]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

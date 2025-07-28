/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct descendant by class
  function findDescendantByClass(el, className) {
    for (const child of el.children) {
      if (child.classList && child.classList.contains(className)) return child;
      const found = findDescendantByClass(child, className);
      if (found) return found;
    }
    return null;
  }

  // 1. Find the image (row 2)
  let image = null;
  // Traverse to the deepest img in the element
  image = element.querySelector('img');

  // 2. Find the title/heading (row 3)
  // Try to find a heading element (h1/h2/h3/h4/etc.) or .h4-heading
  let heading = element.querySelector('.h4-heading, h1, h2, h3, h4, h5, h6');

  // If no image or heading found, handle gracefully
  // (use null in the table cell, which will render an empty cell)

  // Table rows
  const rows = [
    ['Hero (hero21)'],
    [image || ''],
    [heading || '']
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}

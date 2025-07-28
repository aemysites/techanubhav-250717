/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns
  const grid = element.querySelector('.w-layout-grid, [class*="grid-layout"]');
  if (!grid) return;
  
  // Get direct children of the grid - each is a column
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;

  // First column: image, use the img directly (not wrapping div)
  const img = columns[0].tagName === 'IMG' ? columns[0] : columns[0].querySelector('img');

  // Second column: the entire content block
  const contentCol = columns[1];

  // Build the table header and content row
  const headerRow = ['Columns (columns32)'];
  const contentRow = [img, contentCol];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace the original element
  element.replaceWith(table);
}

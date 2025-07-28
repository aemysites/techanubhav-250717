/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container holding the columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  
  // Get immediate children of the grid (the actual columns)
  const columns = Array.from(grid.children);
  if (!columns.length) return;

  // The header row should have exactly one cell, per the example
  const headerRow = ['Columns (columns7)'];
  // The content row contains one cell per column
  const contentRow = columns;

  // Build the block table
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new block
  element.replaceWith(block);
}

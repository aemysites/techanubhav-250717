/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid that contains the columns (multi-column content)
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  // Get the immediate children of the grid: these are the columns
  const columns = Array.from(grid.children);
  if (columns.length === 0) return;

  // Table header must match the block name with variant
  const headerRow = ['Columns (columns32)'];

  // Content row: one cell per column, referencing the actual element
  // Do not clone or create new elements, use as-is
  const contentRow = columns;

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the whole original element with our new table
  element.replaceWith(table);
}

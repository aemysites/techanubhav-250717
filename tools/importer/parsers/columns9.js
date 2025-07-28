/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid-layout div which contains the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Get all direct children of grid (each is a column)
  const cols = Array.from(grid.children);
  // The header row must contain exactly one cell, matching the spec
  const cells = [['Columns (columns9)']];
  // The second row must have as many columns as there are column blocks in the grid
  // Each column is a single cell, referencing the original column element
  if (cols.length > 0) {
    cells.push(cols);
  }
  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}

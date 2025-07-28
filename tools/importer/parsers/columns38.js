/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child divs (each representing a column)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // The header row should be a single cell, regardless of column count
  const headerRow = ['Columns (columns38)'];

  // The content row has one cell for each column
  const contentRow = columns;

  // Build the table structure: headerRow, then contentRow
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
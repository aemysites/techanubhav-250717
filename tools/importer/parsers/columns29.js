/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child divs, which are the columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Header row: block name in first cell, rest are empty strings, matching columns length
  const headerRow = ['Columns (columns29)', ...Array(columns.length - 1).fill('')];
  // Content row: one cell per column
  const contentRow = columns;
  // Create the table rows
  const cells = [headerRow, contentRow];
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
/* global WebImporter */
export default function parse(element, { document }) {
  // Find all the .sl-item > section elements (the columns)
  const sections = Array.from(element.querySelectorAll('.sl-item > section'));
  // Build the table: header = ['Columns (columns4)'], next row = columns
  // The header row must be a single cell array
  const cells = [
    ['Columns (columns4)'],
    sections
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

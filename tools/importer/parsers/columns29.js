/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child divs (each column)
  const columnDivs = element.querySelectorAll(':scope > div');
  // Prepare header row: exactly one column as in the example
  const headerRow = ['Columns (columns29)'];
  // Prepare columns row: one cell per column div
  const columnsRow = Array.from(columnDivs);
  const cells = [
    headerRow,  // first row: single header cell
    columnsRow  // second row: one cell for each column
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

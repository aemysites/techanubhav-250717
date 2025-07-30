/* global WebImporter */
export default function parse(element, { document }) {
  // Get all product-key-rate-items (columns)
  const productKeyRates = element.querySelector('.product-key-rates');
  const columnDivs = productKeyRates ? Array.from(productKeyRates.children) : [];

  // For each column, combine the img, key-value-text, and key-top-text in order, preserving structure
  const columnsRow = columnDivs.map((col) => {
    const parts = [];
    const img = col.querySelector('img');
    if (img) parts.push(img);
    const title = col.querySelector('.key-value-text');
    if (title) parts.push(title);
    const sub = col.querySelector('.key-top-text');
    if (sub) parts.push(sub);
    return parts;
  });

  // Create the table manually so we can specify colspan on the <th>
  const table = document.createElement('table');

  // Header row: one <th> with colspan = number of columns
  const trHeader = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns9)';
  th.setAttribute('colspan', Math.max(1, columnsRow.length));
  trHeader.appendChild(th);
  table.appendChild(trHeader);

  // Columns/content row
  const trCols = document.createElement('tr');
  columnsRow.forEach(cellContent => {
    const td = document.createElement('td');
    if (Array.isArray(cellContent)) {
      cellContent.forEach(el => td.appendChild(el));
    } else if (cellContent) {
      td.appendChild(cellContent);
    }
    trCols.appendChild(td);
  });
  table.appendChild(trCols);

  element.replaceWith(table);
}

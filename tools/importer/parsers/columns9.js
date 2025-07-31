/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container for the columns
  const productKeyRates = element.querySelector('.product-key-rates');
  const container = productKeyRates || element;

  // Get all direct children .product-key-rate-item as columns
  const columns = Array.from(container.querySelectorAll('.product-key-rate-item'));

  // For each column, gather its contents as a fragment
  const cellElements = columns.map((col) => {
    const frag = document.createDocumentFragment();
    Array.from(col.childNodes).forEach((node) => {
      frag.appendChild(node);
    });
    return frag;
  });

  // Custom table creation to allow correct header spanning
  const table = document.createElement('table');
  // Header row: one th with colspan = number of columns
  const headerTr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns9)';
  th.colSpan = Math.max(1, cellElements.length);
  headerTr.appendChild(th);
  table.appendChild(headerTr);
  // Content row
  const contentTr = document.createElement('tr');
  cellElements.forEach(cell => {
    const td = document.createElement('td');
    td.appendChild(cell);
    contentTr.appendChild(td);
  });
  table.appendChild(contentTr);

  element.replaceWith(table);
}

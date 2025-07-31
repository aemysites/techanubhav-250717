/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must be a single cell as per the example
  const headerRow = ['Columns (columns9)'];

  // Find all columns (product-key-rate-item)
  const items = Array.from(element.querySelectorAll('.product-key-rate-item'));

  // Each column = one cell in the row
  const columnsRow = items.map(item => {
    const content = [];
    const img = item.querySelector('img');
    if (img) content.push(img);
    const valueText = item.querySelector('.key-value-text');
    if (valueText) content.push(valueText);
    const topText = item.querySelector('.key-top-text');
    if (topText) content.push(topText);
    return content;
  });

  // Compose table structure: header row (single cell), followed by row of columns
  const cells = [
    headerRow,
    columnsRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

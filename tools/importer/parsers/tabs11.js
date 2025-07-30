/* global WebImporter */
export default function parse(element, { document }) {
  // Header: single cell with the block name, as required
  const headerRow = ['Tabs (tabs11)'];
  // Extract tab labels from nav (content is not present, so empty string for content cell)
  const ul = element.querySelector('ul');
  const rows = [];
  if (ul) {
    Array.from(ul.children).forEach((li) => {
      const labelSpan = li.querySelector('.tab-label');
      const label = labelSpan ? labelSpan.textContent.trim() : '';
      rows.push([label, '']);
    });
  }
  // Assemble table: first row is header, then each tab (label, content)
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
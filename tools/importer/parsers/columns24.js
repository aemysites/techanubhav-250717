/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .sl-list containing the column items
  const slList = element.querySelector('.sl-list');
  let col1 = null;
  let col2 = null;

  if (slList) {
    const items = slList.querySelectorAll(':scope > .sl-item');
    if (items.length >= 2) {
      // First column: use the first .cm-rich-text if available, else the sl-item
      const candidate1 = items[0].querySelector('.cm-rich-text');
      col1 = candidate1 ? candidate1 : items[0];
      // Second column: use the links section if available, else the sl-item
      const candidate2 = items[1].querySelector('section.cm-links');
      col2 = candidate2 ? candidate2 : items[1];
    }
  }

  // Fallbacks in case elements are missing
  if (!col1) {
    col1 = document.createElement('div');
    col1.textContent = '';
  }
  if (!col2) {
    col2 = document.createElement('div');
    col2.textContent = '';
  }

  // The first row is a single column header, the second row has two columns
  const cells = [
    ['Columns (columns24)'],
    [col1, col2]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

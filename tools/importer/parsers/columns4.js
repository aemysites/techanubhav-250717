/* global WebImporter */
export default function parse(element, { document }) {
  // Header row should be a single column (array with one string)
  const headerRow = ['Columns (columns4)'];

  // Find the sl-list container holding the columns
  const slList = element.querySelector('.sl-list');
  let columns = [];
  if (slList) {
    const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
    columns = slItems.map(item => {
      // Each sl-item's section contains the relevant block for the column
      const section = item.querySelector('section');
      return section || item;
    });
  }
  // If no columns found, fallback to an empty cell for robustness
  if (columns.length === 0) {
    columns = [''];
  }

  // Compose the table: first row (header) is single column, second row has N columns
  const rows = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

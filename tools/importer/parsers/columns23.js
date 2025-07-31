/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with exact name as required
  const headerRow = ['Columns (columns23)'];

  // Find the columns wrapper; exit if not present
  const columnsWrapper = element.querySelector('.sl-list.has-2-items');
  if (!columnsWrapper) return;

  // Get each .sl-item as a column
  const columnNodes = Array.from(columnsWrapper.children).filter(n => n.classList.contains('sl-item'));
  if (columnNodes.length === 0) return;

  // For each .sl-item, wrap all its section children in a div (referencing, not cloning)
  const columnCells = columnNodes.map(col => {
    const wrapper = document.createElement('div');
    Array.from(col.children).forEach(child => {
      wrapper.appendChild(child);
    });
    return wrapper;
  });

  // Table rows: header + columns
  const rows = [headerRow, columnCells];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with the block
  element.replaceWith(table);
}

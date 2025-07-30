/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row exactly as in the instructions
  const headerRow = ['Columns (columns25)'];

  // Find the columns container (.sl-list or closest matching)
  let columnsWrapper = element.querySelector('.sl-list');
  if (!columnsWrapper) {
    // fallback to first direct child
    columnsWrapper = element.firstElementChild;
  }
  // Get all columns
  const columnEls = Array.from(columnsWrapper.querySelectorAll(':scope > .sl-item'));

  // For each column, extract its main content block (image or text)
  const columns = columnEls.map(col => {
    // Look for an image figure section
    const figure = col.querySelector('figure');
    if (figure) return figure;
    // Otherwise look for a rich text content module
    const content = col.querySelector('.module__content');
    if (content) return content;
    // Last resort: include the whole column if neither present
    return col;
  });

  // Build rows for the block table (header + column row)
  const table = [headerRow, columns];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(table, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}

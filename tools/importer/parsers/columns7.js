/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns container
  const columnsWrapper = element.querySelector('.sl-list');
  if (!columnsWrapper) return;

  // Get the immediate '.sl-item' children (columns)
  const columnEls = Array.from(columnsWrapper.querySelectorAll(':scope > .sl-item'));

  // Defensive: If there are less than 2 columns, do not proceed
  if (columnEls.length < 2) return;

  // Compose table header as in the example
  const headerRow = ['Columns (columns7)'];

  // For each column, get the main block of content
  const columns = columnEls.map((colEl) => {
    // If the column contains a .cm-image or figure with img (image column)
    const imageSection = colEl.querySelector('.cm-image') || colEl.querySelector('figure');
    if (imageSection) {
      return imageSection;
    }
    // If the column contains a .cm-rich-text (text, heading, downloads)
    const richTextSection = colEl.querySelector('.cm-rich-text');
    if (richTextSection) {
      return richTextSection;
    }
    // Fallback: use all content inside this column
    return colEl;
  });

  // Build the block table: header, then columns
  const tableCells = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element with the generated table
  element.replaceWith(table);
}

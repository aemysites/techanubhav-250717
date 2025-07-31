/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns container
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // The actual columns are .sl-item inside .sl-list
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;

  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (slItems.length === 0) return;

  // For each sl-item, collect its full content as a cell
  const colCells = slItems.map((item) => {
    const children = Array.from(item.childNodes).filter(n => {
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim() !== '';
      return true;
    });
    return children.length === 1 ? children[0] : children;
  });

  // Header row MUST be a single cell matching the example
  const headerRow = ['Columns (columns1)'];
  // The second row is the columns row
  const tableRows = [headerRow, colCells];
  
  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}

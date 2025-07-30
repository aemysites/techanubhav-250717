/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main column container
  const columnContainer = element.querySelector('.column-container');
  if (!columnContainer) return;

  // Find the .sl-list which represents the columns
  const slList = columnContainer.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (slItems.length < 2) return;

  // For each .sl-item, gather all non-empty child nodes (to include text nodes and elements)
  const getCellContent = (slItem) => {
    const nodes = [];
    slItem.childNodes.forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) {
        nodes.push(n);
      } else if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = n.textContent;
        nodes.push(span);
      }
    });
    return nodes.length === 1 ? nodes[0] : nodes;
  };

  // Prepare content for each column
  const columnsContent = slItems.map(getCellContent);

  // Build the correct table structure: header row is a single column, second row has columns
  const headerRow = ['Columns (columns1)'];
  const contentRow = columnsContent;

  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the element with the new block
  element.replaceWith(block);
}

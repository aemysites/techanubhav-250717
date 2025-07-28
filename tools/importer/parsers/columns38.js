/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name only, single cell, per spec
  const headerRow = ['Columns (columns38)'];
  // Get all direct child divs (columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // For each column, include all of its content (not just images)
  const columnCells = columns.map(col => {
    // Gather all child nodes with actual content
    const nodes = Array.from(col.childNodes).filter(node => {
      if (node.nodeType === 3) {
        // Text node, only keep if not empty
        return node.textContent.trim().length > 0;
      }
      // Element node
      return true;
    });
    // If only one content node, use it directly; if more, as array
    if (nodes.length === 1) {
      return nodes[0];
    } else if (nodes.length > 1) {
      return nodes;
    } else {
      return ' ';
    }
  });
  const rows = [
    headerRow,
    columnCells
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

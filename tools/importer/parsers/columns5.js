/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match the example exactly
  const headerRow = ['Columns (columns5)'];

  // Each immediate child div is a column - collect all of its content (not just images)
  const columns = Array.from(element.children);

  // For each column, collect all of its children as content (so we get images, text, or anything else)
  const contentRow = columns.map((col) => {
    // If the column has more than one child, return an array of all child elements
    // If the column is empty, return empty string
    // If only one child, return that node directly
    const nodes = Array.from(col.childNodes).filter(node => {
      // Ignore empty text nodes
      return node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== '';
    });
    if (nodes.length === 0) return '';
    if (nodes.length === 1) return nodes[0];
    return nodes;
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}

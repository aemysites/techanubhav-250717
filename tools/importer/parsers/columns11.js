/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: Must match exactly
  const headerRow = ['Columns (columns11)'];

  // Get top-level columns: nav > ul > li (direct children)
  const navUl = element.querySelector('ul.nav-footer');
  if (!navUl) return;
  const columnLis = Array.from(navUl.children);

  // For each column <li>, gather its content as an array of actual references (not clones)
  const cells = columnLis.map((colLi) => {
    // We want to return the children of each li as a single cell content array
    return Array.from(colLi.childNodes).filter(node => {
      // Only include elements and text with non-whitespace
      return (node.nodeType === 1) || (node.nodeType === 3 && node.textContent.trim() !== '');
    });
  });

  // The table structure: [header], [col1, col2, col3]
  const tableCells = [headerRow, cells];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  element.replaceWith(table);
}

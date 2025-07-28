/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main grid with columns inside the given element
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all top-level (direct) children of the grid as columns
  const columnDivs = Array.from(grid.children);
  
  // For each column, gather all its children (to preserve structure)
  const contentCells = columnDivs.map((col) => {
    const items = Array.from(col.childNodes).filter(
      node => !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim())
    );
    // If only one child, return the element directly; else, use array for multiple content pieces
    if (items.length === 1) {
      return items[0];
    } else {
      return items;
    }
  });

  // Assemble the table structure: header row, then one row with all columns
  const cells = [
    ['Columns (columns4)'],
    contentCells
  ];
  
  // Create the table block and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

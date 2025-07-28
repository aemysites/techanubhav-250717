/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout within the section
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all direct children of the grid - these are the columns
  const columns = Array.from(grid.children);

  // Each column may contain multiple blocks (e.g., heading, paragraph, button)
  // For each column, we want to include ALL of its direct children in the cell
  // If a column has only one element, just reference it; if multiple, wrap in an array
  const contentRow = columns.map(col => {
    // If column has multiple children, group them in array to preserve order
    const inner = Array.from(col.childNodes).filter(
      node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())
    );
    if (inner.length === 1) return inner[0];
    if (inner.length > 1) return inner;
    // fallback to referencing column itself if it's a single block
    return col;
  });

  const headerRow = ['Columns (columns4)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}

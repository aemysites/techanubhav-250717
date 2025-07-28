/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main 3-column grid inside the section
  const container = element.querySelector('.container');
  if (!container) return;
  const grid = container.querySelector('.grid-layout');
  if (!grid) return;
  const gridChildren = Array.from(grid.children); // generally 3: left, middle, right

  // Edge case: if not 3, bail
  if (gridChildren.length < 3) return;

  // LEFT COLUMN: single main feature (just reference its block)
  const leftCol = gridChildren[0];
  // MIDDLE COLUMN: vertical block of two links with images (reference both in an array)
  const middleCol = gridChildren[1];
  const middleLinks = Array.from(middleCol.querySelectorAll(':scope > a'));
  // RIGHT COLUMN: stack of link blocks separated by dividers (reference all except the dividers)
  const rightCol = gridChildren[2];
  // We'll preserve the divider elements visually by referencing all children as-is
  const rightColNodes = Array.from(rightCol.childNodes).filter(node => {
    // retain <a> blocks and .divider divs
    return (node.nodeType === 1 && (node.matches('a') || node.classList.contains('divider')));
  });

  // Helper: wrap nodes in a div for context
  function wrapContent(nodes) {
    const div = document.createElement('div');
    if (Array.isArray(nodes)) {
      nodes.forEach(n => div.appendChild(n));
    } else if (nodes) {
      div.appendChild(nodes);
    }
    return div;
  }

  // Build table cells referencing document elements directly
  const leftCell = wrapContent(leftCol);
  const middleCell = wrapContent(middleLinks);
  const rightCell = wrapContent(rightColNodes);

  // 2. Table header row - MUST be block name from assignment, match exactly. No variant for this block.
  const headerRow = ['Columns (columns2)'];
  // 3. Data row: each column is a cell
  const dataRow = [leftCell, middleCell, rightCell];

  // 4. Build and replace
  const cells = [headerRow, dataRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

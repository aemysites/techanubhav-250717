/* global WebImporter */
export default function parse(element, { document }) {
  // Get the grid with two columns (left: content, right: image)
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  const gridChildren = Array.from(grid.children);
  if (gridChildren.length < 2) return;

  // Find the left and right columns
  let leftCol = null;
  let rightCol = null;
  gridChildren.forEach(child => {
    if (!leftCol && child.querySelector('h1')) leftCol = child;
    if (!rightCol && child.tagName.toLowerCase() === 'img') rightCol = child;
  });
  // Fallback
  if (!leftCol) leftCol = gridChildren[0];
  if (!rightCol) rightCol = gridChildren[1];

  // Instead of cloning, reference the actual children nodes of left column
  // Collect all elements (h1, p, div, etc) inside leftCol, except empty text nodes
  const leftContentNodes = Array.from(leftCol.childNodes).filter(
    node => {
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return true;
      return false;
    }
  );
  // If only one node, put it directly, otherwise as an array
  const leftContent = leftContentNodes.length === 1 ? leftContentNodes[0] : leftContentNodes;

  // Use the actual image node for right column
  const rightContent = rightCol;

  const cells = [
    ['Columns (columns15)'],
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

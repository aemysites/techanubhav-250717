/* global WebImporter */
export default function parse(element, { document }) {
  // Find grid-layout in the section
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  const gridChildren = Array.from(grid.children);

  // Identify three expected parts: left (headings), center (contact info), right (image)
  let leftCol = null, centerCol = null, rightCol = null;
  for (const child of gridChildren) {
    if (!leftCol && child.tagName === 'DIV') leftCol = child;
    else if (!centerCol && child.tagName === 'UL') centerCol = child;
    else if (!rightCol && child.tagName === 'IMG') rightCol = child;
  }
  if (!leftCol) leftCol = gridChildren.find(el => el.tagName === 'DIV');
  if (!centerCol) centerCol = gridChildren.find(el => el.tagName === 'UL');
  if (!rightCol) rightCol = gridChildren.find(el => el.tagName === 'IMG');

  // Compose left column content
  let leftColContent = [];
  if (leftCol) leftColContent = Array.from(leftCol.childNodes).filter(node => {
    if (node.nodeType === Node.ELEMENT_NODE) return true;
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return true;
    return false;
  });
  if (leftColContent.length === 0 && leftCol) leftColContent = [leftCol];

  // Compose center and right columns
  const centerColContent = centerCol ? [centerCol] : [];
  const rightColContent = rightCol ? [rightCol] : [];

  // Prepare the cells with single header cell (fix for critical header row issue)
  const cells = [
    ['Columns (columns18)'], // Single cell for the header row
    [leftColContent, centerColContent, rightColContent] // One cell per column for content row
  ];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

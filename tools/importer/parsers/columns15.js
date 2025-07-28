/* global WebImporter */
export default function parse(element, { document }) {
  // Find grid layout inside the header (contains the two columns)
  let grid = element.querySelector('.w-layout-grid');
  if (!grid) grid = element;
  let columns = Array.from(grid.children);

  // Try to find the text (left) and image (right) columns
  // Left col should have heading or paragraph, right col should have img
  let leftCol = columns.find(col =>
    col.querySelector('h1, h2, h3, h4, h5, h6, p, .button-group')
  );
  let rightCol = columns.find(col => col.querySelector('img'));

  // Fallback if not found
  if (!leftCol) leftCol = columns[0] || document.createElement('div');
  if (!rightCol) rightCol = columns[1] || document.createElement('div');

  // To ensure all text is included, grab all child nodes for each col
  function contentArray(node) {
    // Only get meaningful nodes (skip empty text nodes)
    const arr = [];
    node.childNodes.forEach(n => {
      if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
        arr.push(document.createTextNode(n.textContent));
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        arr.push(n);
      }
    });
    // If nothing, still reference node itself for robustness
    return arr.length ? arr : [node];
  }

  const leftContent = contentArray(leftCol);
  const rightContent = contentArray(rightCol);

  // Build the table cells
  const cells = [
    ['Columns (columns15)'],
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Make header span two columns
  const headerTr = table.querySelector('tr');
  if (headerTr && headerTr.children.length === 1) {
    headerTr.children[0].setAttribute('colspan', 2);
  }
  element.replaceWith(table);
}

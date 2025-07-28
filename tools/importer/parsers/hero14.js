/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row as in the example
  const headerRow = ['Hero (hero14)'];

  // Get main grid
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  const gridChildren = grid.querySelectorAll(':scope > div');

  // Background image (row 2): first grid child should have the background image
  let bgImage = '';
  if (gridChildren.length > 0) {
    const img = gridChildren[0].querySelector('img.cover-image');
    if (img) bgImage = img;
  }

  // Content (row 3): second grid child has the content
  let content = '';
  if (gridChildren.length > 1) {
    const textContainer = gridChildren[1];
    // Usually the text is inside utility-margin-bottom-6rem, but fallback to all children
    const mainContent = textContainer.querySelector('.utility-margin-bottom-6rem');
    if (mainContent) {
      content = mainContent;
    } else {
      // fallback: include all children
      const frag = document.createDocumentFragment();
      Array.from(textContainer.children).forEach(child => frag.appendChild(child));
      content = frag;
    }
  }

  // Compose block table as 1col x 3rows
  const rows = [
    headerRow,
    [bgImage],
    [content]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

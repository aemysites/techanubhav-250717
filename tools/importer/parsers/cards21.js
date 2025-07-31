/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cards21)'];
  const cells = [headerRow];

  // Get all card items (direct children of .sl-list)
  const cardItems = element.querySelectorAll(':scope > .sl-list > .sl-item');

  cardItems.forEach((card) => {
    // Each card has a section.cm-content-tile
    const section = card.querySelector('section.cm-content-tile');
    if (!section) return;
    const link = section.querySelector('a.cm-image-block-link');
    if (!link) return;
    const imageDiv = link.querySelector('.image');
    const img = imageDiv ? imageDiv.querySelector('img') : null;
    const contentDiv = link.querySelector('.content');
    const header = contentDiv ? contentDiv.querySelector('.header') : null;
    // Left cell: reference the <img> element directly if present
    const leftCell = img || '';
    // Right cell: title as heading (h2) with link (if present)
    let rightCell = '';
    if (header) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = header.textContent;
      const h2 = document.createElement('h2');
      h2.appendChild(a);
      rightCell = h2;
    }
    cells.push([leftCell, rightCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

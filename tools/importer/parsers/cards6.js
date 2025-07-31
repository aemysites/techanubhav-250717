/* global WebImporter */
export default function parse(element, { document }) {
  // Collect all cards from all column containers
  const cards = [];
  const cardContainers = element.querySelectorAll('.column-container');
  cardContainers.forEach((container) => {
    const slItems = container.querySelectorAll('.sl-item');
    slItems.forEach((item) => {
      // Only process sl-items that contain a .cm-content-tile
      const contentTile = item.querySelector('.cm-content-tile');
      if (!contentTile) return;
      const tileInner = contentTile.querySelector(':scope > div');
      if (!tileInner) return;
      // Image cell
      const imgEl = tileInner.querySelector('.image img');
      // Text cell: collect header, description, and CTA (all together in a div)
      const contentDiv = tileInner.querySelector('.content');
      const textCell = document.createElement('div');
      if (contentDiv) {
        // Title
        const header = contentDiv.querySelector('.header');
        if (header) textCell.appendChild(header);
        // Description: first <p> that isn't empty, doesn't have class 'subheading', and doesn't contain an <a>
        const desc = Array.from(contentDiv.querySelectorAll('p')).find(
          (p) =>
            !p.classList.contains('subheading') &&
            !p.querySelector('a') &&
            p.textContent.trim().length > 0
        );
        if (desc) textCell.appendChild(desc);
        // CTA: first <p> containing an <a>
        const cta = Array.from(contentDiv.querySelectorAll('p')).find(
          (p) => p.querySelector('a')
        );
        if (cta) textCell.appendChild(cta);
      }
      // If both cells are empty, skip
      if (!imgEl && textCell.childNodes.length === 0) return;
      // If there's only one child in textCell, just reference that node (to avoid unnecessary <div>)
      let textFinal;
      if (textCell.childNodes.length === 1) {
        textFinal = textCell.firstChild;
      } else if (textCell.childNodes.length > 1) {
        textFinal = textCell;
      } else {
        textFinal = '';
      }
      cards.push([imgEl || '', textFinal]);
    });
  });

  // Block table: header, then each card row
  const rows = [
    ['Cards (cards6)'],
    ...cards
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

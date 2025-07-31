/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards8)'];
  const cells = [headerRow];

  // Select all direct card items
  const cardItems = element.querySelectorAll(':scope .sl-list > .sl-item');

  cardItems.forEach((card) => {
    // Find image (mandatory)
    const img = card.querySelector('img');
    // Find link (mandatory, wraps both image and text)
    const link = card.querySelector('a.cm-image-block-link');
    // Find title (h2.header)
    const h2 = link ? link.querySelector('h2.header') : null;

    // Compose text cell: clickable title as link
    let textCell;
    if (h2 && link) {
      // Reference the original heading element, but wrap with link for semantic clarity
      // Use the original h2, but replace its contents with the link
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = h2.textContent.trim();
      const heading = document.createElement('h2');
      heading.appendChild(a);
      textCell = heading;
    } else if (h2) {
      textCell = h2;
    } else if (link) {
      // If only link is present, just use its text
      textCell = document.createTextNode(link.textContent.trim());
    } else {
      textCell = document.createTextNode('');
    }

    cells.push([
      img,
      textCell,
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

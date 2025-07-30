/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards21)'];
  const cells = [headerRow];
  // Find all card items: .sl-list > .sl-item
  const cardItems = element.querySelectorAll('.sl-list > .sl-item');
  cardItems.forEach((item) => {
    // Find the main link
    const link = item.querySelector('a.cm-image-block-link');
    // Find image element to preserve reference
    const img = link ? link.querySelector('img') : null;
    // Find the card title (should be in h2 or fallback to text)
    let textCell = '';
    if (link) {
      const h2 = link.querySelector('h2');
      if (h2) {
        // Use <strong> to match example formatting
        const strong = document.createElement('strong');
        strong.textContent = h2.textContent.trim();
        textCell = strong;
      } else {
        // fallback: use link text
        textCell = link.textContent.trim();
      }
    }
    // Each row: [image, text]
    cells.push([
      img || '',
      textCell
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as per spec
  const headerRow = ['Cards (cards33)'];
  const rows = [headerRow];

  // Find all direct <a> children (cards)
  const cards = element.querySelectorAll(':scope > a');

  cards.forEach((card) => {
    // Get the image (first img in the card)
    const img = card.querySelector('img');

    // The block containing the text content is the div in the card (not the grid, not image)
    let textDiv;
    // find the grid inside <a>, then its children
    const cardGrid = card.querySelector('div.w-layout-grid');
    if (cardGrid) {
      // cardGrid has 2 children: img + text div
      const children = Array.from(cardGrid.children);
      textDiv = children.find((child) => child !== img && child.tagName === 'DIV');
    }
    // Fallback: grab the last div in the card
    if (!textDiv) {
      const divs = card.querySelectorAll('div');
      textDiv = divs[divs.length - 1];
    }
    // For textDiv, remove any trailing "Read" div to avoid redundancy
    if (textDiv) {
      // Find direct child divs with text 'Read' and remove
      Array.from(textDiv.children).forEach((child) => {
        if (child.tagName === 'DIV' && child.textContent.trim() === 'Read') {
          child.remove();
        }
      });
    }
    // Compose the row: [image, text content]
    rows.push([img, textDiv]);
  });

  // Create block table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}

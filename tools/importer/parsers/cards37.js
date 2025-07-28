/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing both left and right card regions
  const container = element.querySelector('.container');
  if (!container) return;
  // The main grid contains the left card (big) and the right side grid (with 4 cards)
  const mainGrid = container.querySelector('.w-layout-grid.grid-layout');
  if (!mainGrid) return;

  // The first card is the big left-side card (usually an <a>), then the right grid is a nested div
  const mainCards = Array.from(mainGrid.children).filter(child => child.tagName === 'A' || child.classList.contains('w-layout-grid'));

  // Collect all card elements flat (left card plus 4 right cards)
  let cards = [];
  mainCards.forEach(child => {
    if (child.tagName === 'A') {
      cards.push(child);
    } else if (child.classList.contains('w-layout-grid')) {
      cards = cards.concat(Array.from(child.querySelectorAll(':scope > a.utility-link-content-block')));
    }
  });

  // Prepare block header row
  const rows = [['Cards (cards37)']];

  // For each card, extract its image and text
  cards.forEach(card => {
    // Get image: the first <img> descendant in a .utility-aspect-* element
    let aspectDiv = card.querySelector('[class*="utility-aspect"]');
    let img = aspectDiv ? aspectDiv.querySelector('img') : null;
    let imageCell = img || '';

    // Get title: usually h2 or h3 or h4
    let heading = card.querySelector('h2,h3,h4');
    // Get all paragraphs
    let paragraphs = Array.from(card.querySelectorAll('p'));
    // Get CTA button or link
    let cta = card.querySelector('.button, button, a.button');

    // Compose text cell contents, preserving structure
    const textCell = [];
    if (heading) textCell.push(heading);
    if (paragraphs.length) textCell.push(...paragraphs);
    if (cta) textCell.push(cta);

    // If only one element, use it directly; else, pass the array
    rows.push([imageCell, textCell.length === 1 ? textCell[0] : textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header
  const headerRow = ['Cards (cards6)'];
  // Cards: each child div of the grid is a card with an image, but no text content
  const cardDivs = element.querySelectorAll(':scope > div');
  const rows = Array.from(cardDivs).map(cardDiv => {
    // Find the first img inside this card's div
    const img = cardDiv.querySelector('img');
    // If not found, cell should be blank
    return [img || '', ''];
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}

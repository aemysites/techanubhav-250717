/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Cards (cards6)
  const headerRow = ['Cards (cards6)'];

  // Get all direct children of the grid (each card's wrapper)
  const cardDivs = element.querySelectorAll(':scope > div');

  // Each card's image is inside a wrapper div
  const rows = Array.from(cardDivs).map(cardDiv => {
    // Find the img (if present)
    const img = cardDiv.querySelector('img');
    return [img || '', ''];
  });

  // Compose cells as per requirements
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table block
  element.replaceWith(block);
}

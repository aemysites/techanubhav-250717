/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ['Cards (cards25)'];
  const rows = [];
  // Cards are direct children
  const cards = Array.from(element.querySelectorAll(':scope > div'));
  cards.forEach(card => {
    // Look for image in card
    const img = card.querySelector('img');
    // Look for text content: .utility-padding-all-2rem contains h3 and p if present
    let textContent = null;
    const textWrapper = card.querySelector('.utility-padding-all-2rem');
    if (textWrapper) {
      // Use the textWrapper element directly to preserve heading, paragraph, etc.
      textContent = textWrapper;
    } else {
      // If no text, create an empty div
      textContent = document.createElement('div');
    }
    // Only add row if image exists (per block spec, images are required)
    if (img) {
      rows.push([img, textContent]);
    }
  });
  // Only proceed if there is at least one card
  if (rows.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...rows
    ], document);
    element.replaceWith(table);
  }
}
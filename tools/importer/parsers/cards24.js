/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  // Select all direct card links
  const cards = element.querySelectorAll(':scope > a');

  cards.forEach(card => {
    // --- IMAGE COLUMN ---
    // Grab the first <img> inside the card
    let imgEl = null;
    const imgContainer = card.querySelector('.utility-aspect-2x3');
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }
    // --- TEXT CONTENT COLUMN ---
    // Tag & Date row
    const tagDateDiv = card.querySelector('.flex-horizontal');
    let tagDateFrag = null;
    if (tagDateDiv) {
      // Reference the existing container as a whole, which includes tag and date
      tagDateFrag = tagDateDiv;
    }
    // Heading/title
    // Use existing heading node if present
    let titleEl = card.querySelector('h3, .h4-heading');
    // Compose content for second cell
    const textCol = [];
    if (tagDateFrag) textCol.push(tagDateFrag);
    if (titleEl) textCol.push(titleEl);
    // Add the row to the table
    rows.push([
      imgEl,
      textCol.length === 1 ? textCol[0] : textCol
    ]);
  });

  // Create and replace with the cards block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}

/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Helper function to extract text content (h3, p) from overlay
  function getTextContent(overlay) {
    const content = [];
    if (!overlay) return content;
    // Heading
    const heading = overlay.querySelector('h3, h2, h4, h5, h6');
    if (heading) content.push(heading);
    // Description
    const desc = overlay.querySelector('p');
    if (desc) content.push(desc);
    return content.length > 0 ? content : '';
  }

  // Get all immediate children which are cards (each contains an image)
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  for (const card of cardDivs) {
    // The card image (first img in card)
    const img = card.querySelector('img');
    // Try to get overlay text (if present)
    let overlay = card.querySelector('.utility-padding-all-2rem');

    // If overlay is nested deeper (inside relative wrappers)
    if (!overlay) {
      // Sometimes there's only the image as a card.
      // Accept image only (text cell empty)
      rows.push([
        img ? img : '',
        ''
      ]);
    } else {
      rows.push([
        img ? img : '',
        getTextContent(overlay)
      ]);
    }
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

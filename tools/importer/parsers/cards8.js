/* global WebImporter */
export default function parse(element, { document }) {
  // The HTML only provides images, no text or CTAs for each card
  const headerRow = ['Cards (cards8)'];
  const cardDivs = Array.from(element.querySelectorAll(':scope > .utility-aspect-1x1'));
  const rows = [headerRow];
  cardDivs.forEach((cardDiv) => {
    const img = cardDiv.querySelector('img');
    // Reference the existing image node, put empty string for text cell as there is no text content
    rows.push([img, '']);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
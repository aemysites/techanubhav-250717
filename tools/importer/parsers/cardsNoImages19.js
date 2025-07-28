/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Cards block
  const headerRow = ['Cards'];
  const rows = [headerRow];

  // The block expects each card's text in its own row, no icon/svg, just the <p> description
  // All direct children are card divs
  const cardDivs = element.querySelectorAll(':scope > div');
  cardDivs.forEach(cardDiv => {
    // Some card divs may contain more than one <p>, but the only visible content is from the first <p>
    const p = cardDiv.querySelector('p');
    if (p) {
      rows.push([p]); // Reference the existing <p> element directly
    }
    // If a card is missing its <p>, don't add a row (edge case: skip empty or malformed cards)
  });

  // Create the Cards block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original with the new table
  element.replaceWith(table);
}

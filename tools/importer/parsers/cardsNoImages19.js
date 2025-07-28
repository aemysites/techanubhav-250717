/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row as specified
  const cells = [['Cards']];

  // Find all direct child card divs
  const cardDivs = element.querySelectorAll(':scope > div');

  cardDivs.forEach(cardDiv => {
    // Each card consists of an icon and a text paragraph.
    // Only the text paragraph should be extracted for the card content
    const p = cardDiv.querySelector('p');
    if (p) {
      // Reference the existing <p> element (keeps formatting/semantics)
      cells.push([p]);
    }
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

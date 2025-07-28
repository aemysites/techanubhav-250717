/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  // Find all direct card links in the block
  const cards = Array.from(element.querySelectorAll(':scope > a.card-link'));

  cards.forEach((card) => {
    // Left cell: the card image (if present)
    const imgWrapper = card.querySelector('.utility-aspect-3x2');
    let img = null;
    if (imgWrapper) {
      img = imgWrapper.querySelector('img');
    }
    // If image is missing, keep cell empty to maintain structure

    // Right cell: tag (optional), heading (h3), description (p)
    const contentDiv = card.querySelector('.utility-padding-all-1rem');
    const content = [];
    if (contentDiv) {
      // Tag (optional)
      const tag = contentDiv.querySelector('.tag-group .tag');
      if (tag) content.push(tag);
      // Heading (h3)
      const heading = contentDiv.querySelector('h3');
      if (heading) content.push(heading);
      // Description (p)
      const desc = contentDiv.querySelector('p');
      if (desc) content.push(desc);
    }
    // Use an array for the right cell to preserve structure and formatting
    rows.push([img, content]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

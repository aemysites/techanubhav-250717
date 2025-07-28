/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the block name
  const headerRow = ['Cards (cards24)'];

  // Find all card blocks (direct <a> children)
  const cardLinks = Array.from(element.querySelectorAll(':scope > a'));

  const rows = cardLinks.map(card => {
    // Image (always present, first <img> in the first child div)
    const imageDiv = card.querySelector(':scope > div');
    let img = null;
    if (imageDiv) {
      img = imageDiv.querySelector('img');
    }

    // Text content cell construction
    const textCell = [];
    // Get meta info: tag and date (optional)
    const metaDiv = card.querySelector('.flex-horizontal');
    if (metaDiv) {
      // Reference the metaDiv directly, so layout and classes can be preserved if needed
      textCell.push(metaDiv);
    }
    // Heading (mandatory)
    const heading = card.querySelector('h3');
    if (heading) {
      textCell.push(heading);
    }
    return [img, textCell];
  });

  // Compose final table array
  const tableArray = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(table);
}

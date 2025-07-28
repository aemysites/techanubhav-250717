/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per instructions and example
  const headerRow = ['Hero (hero12)'];

  // Find the background image: the .cover-image that is direct child (NOT inside card)
  let bgImg = null;
  // Look for .cover-image img elements that are not nested inside .card or .card-body
  const possibleImgs = element.querySelectorAll('img.cover-image');
  for (const img of possibleImgs) {
    // Only pick image if it is not inside .card, i.e. top-level image
    let parent = img.parentElement;
    let insideCard = false;
    while (parent && parent !== element) {
      if (parent.classList && parent.classList.contains('card')) {
        insideCard = true;
        break;
      }
      parent = parent.parentElement;
    }
    if (!insideCard) {
      bgImg = img;
      break;
    }
  }

  // Find the main content block: container with headline and content (usually .card-body or .container)
  // We want the whole content stack (not just the h2) to preserve headings, paragraphs, list, and button
  let contentBlock = null;
  // Try .card-body
  const cardBody = element.querySelector('.card-body');
  if (cardBody) {
    // We want to include the parent card structure for visual context (headings, text, cta)
    contentBlock = cardBody.parentElement && cardBody.parentElement.classList.contains('card') ? cardBody.parentElement : cardBody;
  } else {
    // Fallback, the .container block (if no card found)
    const container = element.querySelector('.container');
    if (container) {
      contentBlock = container;
    }
  }

  // Second row: background image (optional)
  const secondRow = [bgImg ? bgImg : ''];
  // Third row: structured content (headline, subheadline, cta, etc)
  const thirdRow = [contentBlock ? contentBlock : ''];

  const cells = [
    headerRow,
    secondRow,
    thirdRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

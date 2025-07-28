/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Cards (cards10)'];
  // Get all direct child card links
  const cards = Array.from(element.querySelectorAll(':scope > a.card-link'));
  // Each card: [image element, [tag, heading, description]]
  const rows = cards.map(card => {
    // Get the image from the card
    let img = null;
    const imageWrapper = card.querySelector('.utility-aspect-3x2');
    if (imageWrapper) {
      img = imageWrapper.querySelector('img');
    }
    // Compose text cell content
    const textWrapper = card.querySelector('.utility-padding-all-1rem');
    const textContent = [];
    if (textWrapper) {
      // Tag(s)
      const tagGroup = textWrapper.querySelector('.tag-group');
      if (tagGroup) {
        textContent.push(tagGroup);
      }
      // Heading (h3 or .h4-heading)
      const heading = textWrapper.querySelector('h3, .h4-heading');
      if (heading) {
        textContent.push(heading);
      }
      // Description (paragraph)
      const desc = textWrapper.querySelector('p');
      if (desc) {
        textContent.push(desc);
      }
    }
    return [img, textContent];
  });
  // Combine header and rows, then create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}

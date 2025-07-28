/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as required
  const headerRow = ['Hero (hero21)'];

  // Find the card-body which holds both heading and image
  const cardBody = element.querySelector('.card-body');

  // Extract image (background visual)
  let backgroundImg = null;
  if (cardBody) {
    backgroundImg = cardBody.querySelector('img');
  }
  const imageRow = [backgroundImg ? backgroundImg : ''];

  // Extract Heading (could be any heading element or a styled div)
  let contentRowContent = [];
  if (cardBody) {
    // Find heading: look for h1, h2, h3, h4, h5, h6, or a div/span with class containing 'heading'
    let heading = cardBody.querySelector('h1, h2, h3, h4, h5, h6, .h1-heading, .h2-heading, .h3-heading, .h4-heading, .h5-heading, .h6-heading');
    if (heading) {
      // Use the original element (do not clone or create new)
      contentRowContent.push(heading);
    }
    // Future extensibility: include subheading, CTA, or more if present
  }
  // Always provide a cell, even if empty
  const contentRow = [contentRowContent.length ? contentRowContent : ''];

  // Assemble table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

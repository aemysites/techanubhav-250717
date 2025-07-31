/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Hero (hero20)'];

  // No background image in this HTML, so the image row is blank
  const imageRow = [''];

  // Extract the content panel body
  let contentDiv = element.querySelector('.cm-rich-text');
  if (!contentDiv) {
    // Fallback: if the structure changes, use the element itself
    contentDiv = element;
  }

  // Place the original .cm-rich-text div as the content cell
  const contentRow = [contentDiv];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

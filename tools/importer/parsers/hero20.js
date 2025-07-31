/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main content container.
  // In this HTML, it's the .cm-rich-text (or .module__content) child div
  const content = element.querySelector('.cm-rich-text, .module__content');

  // 2. Prepare the header row as per block spec
  const headerRow = ['Hero (hero20)'];

  // 3. For this HTML there is NO background image, so second row is empty string
  const bgRow = [''];

  // 4. Compose the content row:
  // We should include the heading, the subheading, and the cta in a single cell, as the example combines them
  // We'll gather all child nodes of the content block and reference them directly
  let contentCell = [];
  if (content) {
    // Collect all children elements (heading, paragraphs, etc)
    contentCell = Array.from(content.children);
  }

  // 5. Assemble the block table
  const cells = [
    headerRow,
    bgRow,
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

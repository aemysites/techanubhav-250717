/* global WebImporter */
export default function parse(element, { document }) {
  // The panel with the background color and content
  const panel = element.querySelector('.cm-content-panel-container');

  // The block expects 3 rows: header, (optional) background image, content
  // No background image in this case, so empty string for second row

  // Get the content panel's rich text area
  const blockContent = panel.querySelector('.cm-rich-text');

  // Collect all element children for the content row
  const contentNodes = Array.from(blockContent.children);
  // If there is no content, ensure the row is still created
  const contentCell = contentNodes.length > 0 ? contentNodes : [''];

  const cells = [
    ['Hero (hero20)'], // Table header matches exactly
    [''], // No background image for this block
    [contentCell]
  ];

  // Replace the original element with the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per block name in the prompt
  const headerRow = ['Columns (columns7)'];

  // Find the .sl-list > .sl-item elements (columns)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const items = slList.querySelectorAll(':scope > .sl-item');
  if (items.length < 2) return;

  // First column: expected to be image section
  let col1Content;
  const img = items[0].querySelector('img');
  col1Content = img ? img : document.createElement('div');

  // Second column: expected to be rich text section
  let col2Content;
  const richText = items[1].querySelector('.cm-rich-text');
  if (richText) {
    // Check if the .cm-rich-text contains a table which is likely to be app store buttons
    // We want to keep the app store table and the text above it as a single cell
    col2Content = richText;
  } else {
    // fallback to the entire item
    col2Content = items[1];
  }

  // Compose rows: header, then content (2 columns)
  const table = [
    headerRow,
    [col1Content, col2Content]
  ];

  // Build and replace
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}

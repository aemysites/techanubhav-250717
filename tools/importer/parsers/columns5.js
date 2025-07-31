/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we are only running on the expected container
  const headerRow = ['Columns (columns5)'];

  // Find columns: sl-list > sl-item (two items: left=image, right=rich text)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length < 2) return;

  // First column: image (grab the full section.cm-image or its figure)
  let leftContent = slItems[0].querySelector('section.cm-image');
  if (!leftContent) leftContent = slItems[0];

  // Second column: rich text content (grab the full .cm-rich-text)
  let rightContent = slItems[1].querySelector('.cm-rich-text');
  if (!rightContent) rightContent = slItems[1];

  // Build table rows
  const rows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

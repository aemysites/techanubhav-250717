/* global WebImporter */
export default function parse(element, { document }) {
  // Get the list container for columns
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const items = slList.querySelectorAll(':scope > .sl-item');
  if (items.length !== 2) return;

  // Left column: image section (reference the entire <section> for structure resilience)
  let leftCol = items[0].querySelector('section.cm-image');
  // Right column: text content (reference the entire .cm-rich-text)
  let rightCol = items[1].querySelector('.cm-rich-text');

  // Fallbacks for robustness
  if (!leftCol) leftCol = items[0];
  if (!rightCol) rightCol = items[1];

  // Build the table as per specs: header in first row, two columns in second row
  const cells = [
    ['Columns (columns5)'],
    [leftCol, rightCol]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

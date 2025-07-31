/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns: image and text
  // .column-container > .sl > .sl-list > .sl-item (x2)
  const list = element.querySelector('.sl-list');
  if (!list) return;
  const items = Array.from(list.children).filter(x => x.classList.contains('sl-item'));
  if (items.length < 2) return;

  // Each .sl-item contains a block of content relevant for one column.
  // Use the entire .sl-item elements as columns for resilience and structure.
  const leftCol = items[0];
  const rightCol = items[1];

  // Table header, per spec and example
  const headerRow = ['Columns (columns5)'];
  // Second row: two columns, left and right
  const row = [leftCol, rightCol];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row
  ], document);

  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
  // Each sl-item has a <section> with column content
  const columns = slItems.map(item => item.querySelector('section'));
  // Header row should be exactly one cell
  const headerRow = ['Columns (columns4)'];
  // Content row: one cell per column
  const secondRow = columns;
  const cells = [headerRow, secondRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

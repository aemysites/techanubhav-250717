/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .sl-list container which holds the columns
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  // Each child of .sl-list is a column
  const items = Array.from(slList.children).filter(child => child.classList.contains('sl-item'));
  // For each .sl-item, get its <section> (with heading and list)
  const columns = items.map(item => {
    const section = item.querySelector('section');
    return section || '';
  });
  // Table header: single cell with Columns (columns4)
  const headerRow = ['Columns (columns4)'];
  // Second row: one cell per column content
  const contentRow = columns;
  // Table: first row is header, second row is columns content
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

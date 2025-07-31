/* global WebImporter */
export default function parse(element, { document }) {
  // Find the sl-list: it contains columns as sl-item
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  // Each sl-item is a column
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  const columns = slItems.map(slItem => {
    const section = slItem.querySelector('section');
    return section ? section : slItem;
  });

  // Header row: single column with block name
  const headerRow = ['Columns (columns4)'];
  // Content row: one cell per column
  const contentRow = columns;

  // Table: first row is single column header, second row is N columns
  const table = document.createElement('table');
  // Header row - single cell spanning all columns
  const trHeader = document.createElement('tr');
  const th = document.createElement('th');
  th.colSpan = String(contentRow.length);
  th.innerHTML = headerRow[0];
  trHeader.appendChild(th);
  table.appendChild(trHeader);
  // Content row
  const trContent = document.createElement('tr');
  contentRow.forEach(cell => {
    const td = document.createElement('td');
    td.append(cell);
    trContent.appendChild(td);
  });
  table.appendChild(trContent);
  element.replaceWith(table);
}

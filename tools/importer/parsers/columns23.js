/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two columns represented by .sl-item
  const sl = element.querySelector('.sl');
  if (!sl) return;
  const slList = sl.querySelector('.sl-list');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length < 2) return;

  // For each .sl-item, collect its section children as a column cell
  function getCellContent(slItem) {
    const sections = slItem.querySelectorAll(':scope > section.cm.cm-icon-title');
    const frag = document.createDocumentFragment();
    sections.forEach(section => {
      frag.append(section);
    });
    return frag;
  }

  // Build cells for the columns row
  const columnsRow = [getCellContent(slItems[0]), getCellContent(slItems[1])];

  // Create the table manually to control colspan for the header
  const table = document.createElement('table');
  // Header row with correct colspan
  const trHeader = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns23)';
  th.colSpan = 2;
  trHeader.appendChild(th);
  table.appendChild(trHeader);
  // Columns row
  const tr = document.createElement('tr');
  columnsRow.forEach(cell => {
    const td = document.createElement('td');
    td.append(cell);
    tr.appendChild(td);
  });
  table.appendChild(tr);

  element.replaceWith(table);
}

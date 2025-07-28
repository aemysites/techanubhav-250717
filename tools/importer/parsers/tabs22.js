/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab menu (labels) and tab contents
  const tabMenu = element.querySelector('.w-tab-menu');
  const tabContent = element.querySelector('.w-tab-content');
  if (!tabMenu || !tabContent) return;

  // Extract tab labels dynamically in order
  const labelLinks = Array.from(tabMenu.querySelectorAll('a'));
  const labels = labelLinks.map(link => {
    const labelDiv = link.querySelector('div');
    return labelDiv ? labelDiv.textContent.trim() : link.textContent.trim();
  });

  // Extract tab content panes (in order)
  const tabPanes = Array.from(tabContent.querySelectorAll('.w-tab-pane'));

  // Fix: header row should be ['Tabs', ''] to match the two-column structure for all rows
  // But we want the <th>Tabs</th> cell to span two columns, as in the example (single cell header row)
  // We'll use a table with the first row: [th Tabs colspan=2]
  // To accomplish this, createTable must receive only one cell in the header row
  // So we create a <th> element with colspan=2
  const th = document.createElement('th');
  th.textContent = 'Tabs';
  th.setAttribute('colspan', '2');
  const headerRow = [th];

  const rows = tabPanes.map((pane, i) => {
    const label = labels[i] || '';
    let tabContentBlock = pane.querySelector('div');
    if (!tabContentBlock) tabContentBlock = pane;
    return [label, tabContentBlock];
  });
  const cells = [headerRow, ...rows];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

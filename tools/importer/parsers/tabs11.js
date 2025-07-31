/* global WebImporter */
export default function parse(element, { document }) {
  // The table should have 2 columns in all rows, including header
  // The header row should be a single cell that spans both columns
  // We achieve this by passing a single-element array for the header row, followed by arrays of two items (label, content)
  const rows = [
    ['Tabs (tabs11)']
  ];

  // Extract all tab labels (no tab content present in this markup)
  const tabList = element.querySelector('ul[role="tablist"]');
  const tabLis = tabList ? Array.from(tabList.querySelectorAll(':scope > li')) : [];

  tabLis.forEach((li) => {
    let tabLabel = '';
    const labelSpan = li.querySelector('.tab-label');
    if (labelSpan) {
      tabLabel = labelSpan.textContent.trim();
    } else {
      const btn = li.querySelector('button');
      if (btn) tabLabel = btn.textContent.trim();
    }
    // Tab label (first col), no tab content (second col is empty)
    rows.push([tabLabel, '']);
  });

  // Create table. WebImporter.DOMUtils.createTable will render the first row as a single cell with colspan=2
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

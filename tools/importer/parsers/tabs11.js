/* global WebImporter */
export default function parse(element, { document }) {
  // Create a two-column table: header row is a single cell, data rows are two cells
  const headerRow = ['Tabs (tabs11)']; // single cell; createTable will make this a <th> with colspan=2

  // Find all tab label spans
  const tabLabelSpans = element.querySelectorAll('ul[role="tablist"] > li > button > .tab-label');

  // Each tab becomes a row: [label, empty cell]
  const rows = [headerRow];
  tabLabelSpans.forEach((span) => {
    rows.push([span, '']);
  });

  // Build and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}

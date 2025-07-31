/* global WebImporter */
export default function parse(element, { document }) {
  // Get all .filtered-content blocks (one per tab)
  const tabs = Array.from(element.querySelectorAll('.filtered-content'));

  // For each tab, extract the label and the existing content element
  const rows = tabs.map(tab => {
    // Label from data-title (fallback to empty string if missing)
    const label = tab.getAttribute('data-title') || '';
    // Content: reference existing inner content element (usually the only child div)
    let content = tab.querySelector(':scope > div');
    if (!content) {
      // Fallback: use the tab element itself if content missing
      content = tab;
    }
    return [label, content];
  });

  // Header row must have exactly one column, per requirements
  const headerRow = ['Tabs (tabs16)'];

  // Compose table: header as single column row, then each row is [label, content]
  const cells = [headerRow, ...rows];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

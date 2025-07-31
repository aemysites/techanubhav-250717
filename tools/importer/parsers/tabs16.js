/* global WebImporter */
export default function parse(element, { document }) {
  // Gather all the tab sections
  const tabSections = Array.from(element.querySelectorAll('.filtered-content'));

  // Header row: exactly one cell, matching the example
  const headerRow = ['Tabs (tabs16)'];

  // Each tab section: a row of [label, content]
  const rows = tabSections.map(tabEl => {
    const label = tabEl.getAttribute('data-title') || '';
    // Prefer the most specific/complete content block
    let content = tabEl.querySelector('.cm-rich-text')
      || tabEl.querySelector('.module__content')
      || tabEl.querySelector('.l-full-width')
      || tabEl;
    return [label, content];
  });

  // Compose cells: header row is a single-cell row, other rows have two cells
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

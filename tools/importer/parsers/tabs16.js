/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell, exactly as the example
  const headerRow = ['Tabs (tabs16)'];

  // Gather all tab sections
  const tabElements = Array.from(element.querySelectorAll('.filtered-content'));

  // Build rows: each as [Tab Label, Tab Content]
  const rows = tabElements.map(tabEl => {
    const tabLabel = tabEl.getAttribute('data-title') || '';
    let tabContent = tabEl.querySelector('.cm.cm-rich-text.module__content.l-full-width');
    if (!tabContent) tabContent = tabEl.querySelector('.cm-rich-text, .module__content, .cm');
    if (!tabContent) tabContent = tabEl;
    return [tabLabel, tabContent];
  });

  // Compose the table: header as a single cell row, subsequent rows two columns (label, content)
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

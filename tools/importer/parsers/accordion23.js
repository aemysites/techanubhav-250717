/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Accordion (accordion23)'];

  // Each accordion row is: [title element, content element]
  // In this structure, accordion items are direct children with class 'divider'
  const rows = [];

  const accordionItems = Array.from(element.querySelectorAll(':scope > .divider'));
  for (const item of accordionItems) {
    // Find the immediate .w-layout-grid child inside divider
    const grid = item.querySelector(':scope > .w-layout-grid');
    if (!grid) continue;
    // The grid has two children: h4-heading (title), rich-text (content)
    const children = Array.from(grid.children);
    const titleEl = children.find(child => child.classList.contains('h4-heading'));
    const contentEl = children.find(child => child.classList.contains('rich-text'));
    // Defensive: only add rows with both
    if (titleEl && contentEl) {
      rows.push([titleEl, contentEl]);
    }
  }

  // Compose the table data as required
  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content block inside the section
  const topDiv = element.querySelector(':scope > div');
  let backgroundImage = null; // No background image in provided HTML

  // Find grid with actual content
  let grid = null;
  if (topDiv) {
    grid = topDiv.querySelector('.w-layout-grid');
  }

  let heading = null;
  let subheading = null;
  let cta = null;

  if (grid) {
    // The grid has one div (text/subheading) and one a (cta)
    const children = grid.querySelectorAll(':scope > *');
    for (const child of children) {
      if (child.tagName === 'DIV') {
        // Grab heading and subheading from this div
        heading = child.querySelector('h2');
        subheading = child.querySelector('p');
      } else if (child.tagName === 'A') {
        cta = child;
      }
    }
  }

  // Build the content row with only available elements, preserving order and reference
  const contentRow = [];
  if (heading) contentRow.push(heading);
  if (subheading) contentRow.push(subheading);
  if (cta) contentRow.push(cta);

  // Table: 1 column, 3 rows
  // 1: Header row
  // 2: Background Image (none in this case)
  // 3: Content (heading, subheading, cta)
  const tableRows = [
    ['Hero (hero35)'],
    [backgroundImage || ''],
    [contentRow]
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}

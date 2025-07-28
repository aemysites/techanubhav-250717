/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child divs (columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // For the content row, extract the image from each column
  const contentRow = columns.map(col => {
    const img = col.querySelector('img');
    return img || '';
  });
  // Header row: single cell, as required
  const headerRow = ['Columns (columns5)'];

  // Use createTable as normal, then manually fix colSpan on the header cell
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Manually set the colspan for the first th to span all content columns
  const th = table.querySelector('th');
  if (th && contentRow.length > 1) {
    th.setAttribute('colspan', contentRow.length);
    // Remove any empty th siblings accidentally created by createTable
    let sibling = th.nextElementSibling;
    while (sibling) {
      const next = sibling.nextElementSibling;
      sibling.remove();
      sibling = next;
    }
  }

  // Replace the original element with the newly created table
  element.replaceWith(table);
}

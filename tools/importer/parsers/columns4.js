/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner .sl-list (the row of columns)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Each .sl-item is a column
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (!slItems.length) return;

  // Get the section content from each column
  const columns = slItems.map((item) => {
    // The section within the sl-item contains the title and links
    const section = item.querySelector('section');
    return section || item;
  });

  // Build table rows (header row is a single cell; second row is columns)
  const headerRow = ['Columns (columns4)'];
  const contentRow = columns;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}

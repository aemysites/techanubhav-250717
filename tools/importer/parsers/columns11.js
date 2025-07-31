/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Columns (columns11)'];
  // Find the nav > ul (nav-footer)
  const navUl = element.querySelector('ul.nav-footer');
  if (!navUl) return;
  const topLis = Array.from(navUl.children);

  // Each top-level <li> is a column
  const columns = topLis.map((li) => {
    // Gather all direct children of this column's <li>
    // Usually: <span> (title) + <ul> (links/icons)
    const colContent = [];
    Array.from(li.childNodes).forEach((child) => {
      // Only include element nodes and non-empty text nodes
      if (child.nodeType === Node.ELEMENT_NODE) {
        colContent.push(child);
      }
    });
    return colContent;
  });

  // Compose the row for columns
  const tableRows = [headerRow, columns];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}

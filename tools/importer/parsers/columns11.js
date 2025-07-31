/* global WebImporter */
export default function parse(element, { document }) {
  // Get all top-level <li> inside the nav > ul
  const listItems = Array.from(element.querySelectorAll(':scope > ul > li'));

  // For each <li>, unwrap its children into a new <div> (move, not clone, to ensure no duplicate DOM)
  const columns = listItems.map((li) => {
    const div = document.createElement('div');
    while (li.firstChild) {
      div.appendChild(li.firstChild); // This moves nodes out of the <li>
    }
    return div;
  });

  const headerRow = ['Columns (columns11)'];
  const columnsRow = columns;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  element.replaceWith(table);
}

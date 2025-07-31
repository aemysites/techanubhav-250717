/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards21)'];

  // Gather card items
  const items = element.querySelectorAll('.sl-list > .sl-item');
  const rows = [];

  items.forEach((item) => {
    // Each item: section > a > div.image > img and div.content > h2
    const img = item.querySelector('img');
    const h2 = item.querySelector('h2.header');
    const link = item.querySelector('a.cm-image-block-link');

    // First cell: image element (referenced directly)
    const imgCell = img;

    // Second cell: title as a link if present, otherwise text only. No description present in this HTML.
    let textCell;
    if (h2 && link) {
      // Make <a> with href and textContent, reference h2 for text
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = h2.textContent;
      textCell = a;
    } else if (h2) {
      // Only heading, no link
      textCell = document.createTextNode(h2.textContent);
    } else {
      textCell = '';
    }
    rows.push([imgCell, textCell]);
  });

  // Build the table block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}

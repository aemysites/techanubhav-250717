/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards8)'];
  const rows = [];

  // Find all cards
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const items = slList.querySelectorAll(':scope > .sl-item');
  items.forEach((item) => {
    // Get the image element
    const img = item.querySelector('img');
    // First cell: image only (reference existing <img>)
    const imgCell = img;

    // Get the heading (title) from h2
    const h2 = item.querySelector('h2');
    let textCellContent = [];
    if (h2) {
      // Use <strong> for heading as in markdown example, but keep original text
      const strong = document.createElement('strong');
      strong.textContent = h2.textContent;
      textCellContent.push(strong);
    }
    // No additional description or CTA in these cards
    rows.push([imgCell, textCellContent.length ? textCellContent : '']);
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

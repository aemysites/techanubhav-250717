/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row must match exactly
  const headerRow = ['Hero (hero3)'];

  // 2. Identify background image (second-level grid, first column)
  let bgImg = null;
  const grid = element.querySelector(':scope > .w-layout-grid');
  if (grid) {
    // Typically first child of grid is the image column
    const gridDivs = grid.querySelectorAll(':scope > div');
    if (gridDivs.length > 0) {
      bgImg = gridDivs[0].querySelector('img');
    }
  }
  // 2.1. 2nd row is just the image (if found), else empty string
  const imgRow = [bgImg || ''];

  // 3. Get text content (headline, subheading, buttons) from the card
  let contentRow = [''];
  if (grid && grid.children.length > 1) {
    // Usually second grid div is the content column
    const contentGrid = grid.children[1];
    // Drill down: card is within contentGrid -> ... -> .card
    const card = contentGrid.querySelector('.card');
    if (card) {
      const content = [];
      // 3.1. Heading (h1 inside card)
      const heading = card.querySelector('h1');
      if (heading) content.push(heading);
      // 3.2. Subheading (p.subheading inside card)
      const subheading = card.querySelector('p.subheading');
      if (subheading) content.push(subheading);
      // 3.3. CTA buttons (inside .button-group in card)
      const buttonGroup = card.querySelector('.button-group');
      if (buttonGroup) {
        // Append each button anchor
        buttonGroup.querySelectorAll('a').forEach(a => content.push(a));
      }
      // Only assign contentRow if we have content
      if (content.length) {
        contentRow = [content];
      }
    }
  }

  // 4. Assemble the table - must have only 1 column, 3 rows
  const cells = [
    headerRow, // row 1: header
    imgRow,    // row 2: image
    contentRow // row 3: headline, subheading, buttons
  ];

  // 5. Use provided helper to create table, and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

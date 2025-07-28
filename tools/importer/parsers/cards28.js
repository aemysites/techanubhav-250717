/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header
  const cells = [['Cards (cards28)']];

  // Gather all grids (each tab-pane has one grid)
  const grids = element.querySelectorAll('.w-layout-grid.grid-layout');

  grids.forEach(grid => {
    // Each grid contains card links (some with image, some without)
    const cards = grid.querySelectorAll('a.utility-link-content-block, a.card-link.secondary-card-link.utility-link-content-block');
    cards.forEach(card => {
      // First cell: image (if present)
      let image = null;
      const imgEl = card.querySelector('.utility-aspect-3x2 img');
      if (imgEl) {
        image = imgEl;
      }
      // Second cell: text content (heading and description)
      const textCell = [];
      const heading = card.querySelector('h3.h4-heading');
      if (heading) {
        // Use a <strong> for heading text, to match markdown semantics
        const strong = document.createElement('strong');
        strong.textContent = heading.textContent.trim();
        textCell.push(strong);
      }
      const desc = card.querySelector('div.paragraph-sm');
      if (desc) {
        // Add line break only if heading exists and description exists
        if (textCell.length > 0) {
          textCell.push(document.createElement('br'));
        }
        textCell.push(desc);
      }
      cells.push([
        image ? image : '',
        textCell.length === 1 ? textCell[0] : textCell
      ]);
    });
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

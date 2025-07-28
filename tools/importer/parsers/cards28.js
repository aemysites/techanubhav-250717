/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row as specified
  const headerRow = ['Cards (cards28)'];
  const cells = [headerRow];

  // Find all tab panes (each tab may have a grid of cards)
  const tabPanes = element.querySelectorAll('.w-tab-pane');
  tabPanes.forEach((pane) => {
    // Each grid contains card <a> elements
    const grid = pane.querySelector('.w-layout-grid');
    if (!grid) return; // Ensure grid exists
    const cards = grid.querySelectorAll('a.utility-link-content-block, a.card-link.secondary-card-link.utility-link-content-block');
    cards.forEach((card) => {
      // Get the first image (if present) from an optional .utility-aspect-3x2 div in the card
      let img = null;
      const imgDiv = card.querySelector('.utility-aspect-3x2');
      if (imgDiv) {
        img = imgDiv.querySelector('img');
      }
      // For cards without image, img is null
      const imageCell = img ? img : '';

      // For the text, gather the heading (h3/h4/h2/h1) and description (first .paragraph-sm)
      // Ensure we reference existing nodes
      let heading = card.querySelector('h1, h2, h3, h4, h5, h6');
      let desc = card.querySelector('.paragraph-sm');
      // Sometimes they're nested in .utility-text-align-center
      if ((!heading || !desc) && card.querySelector('.utility-text-align-center')) {
        const center = card.querySelector('.utility-text-align-center');
        if (!heading) heading = center.querySelector('h1, h2, h3, h4, h5, h6');
        if (!desc) desc = center.querySelector('.paragraph-sm');
      }
      // Defensive: if both missing, skip this card
      if (!heading && !desc && !img) return;
      const textCell = [];
      if (heading) textCell.push(heading);
      if (desc && desc !== heading) textCell.push(desc);
      // Push the card row
      cells.push([imageCell, textCell]);
    });
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

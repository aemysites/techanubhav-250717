/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Collect all cards from all column-containers
  function getAllCardElements(root) {
    const cards = [];
    const columns = root.querySelectorAll('.column-container');
    columns.forEach(col => {
      col.querySelectorAll('.sl-item').forEach(item => {
        // Only keep those with .cm-content-tile and .image img
        if (item.querySelector('.cm-content-tile') && item.querySelector('.image img')) {
          cards.push(item);
        }
      });
    });
    return cards;
  }

  // 2. Build header
  const rows = [];
  rows.push(['Cards (cards6)']);

  // 3. Extract cards
  const cards = getAllCardElements(element);
  cards.forEach(cardItem => {
    const tile = cardItem.querySelector('.cm-content-tile');
    if (!tile) return;
    // ---- IMAGE ----
    // Find the first <img> inside .image
    const img = tile.querySelector('.image img');
    // ---- TEXT CONTENT ----
    // Reference the .content div itself (contains h2, p, etc)
    const contentDiv = tile.querySelector('.content');
    // Defensive: ensure not empty
    if (!img || !contentDiv) return;
    // Reference the existing contentDiv (not a clone): this preserves heading, p, cta structure
    rows.push([img, contentDiv]);
  });

  // 4. Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}

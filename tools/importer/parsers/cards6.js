/* global WebImporter */
export default function parse(element, { document }) {
  // Build table array per block spec
  const rows = [];
  rows.push(['Cards (cards6)']); // Header row exactly as specified

  // Find all .sl-list (card grids)
  const slLists = element.querySelectorAll('.sl-list');
  slLists.forEach((slList) => {
    // Each .sl-item is a card (skip if empty)
    slList.querySelectorAll('.sl-item').forEach((slItem) => {
      const card = slItem.querySelector('section.cm-content-tile, section.cm.cm-content-tile');
      if (!card) return;
      const cardRoot = card.querySelector('div');
      if (!cardRoot) return;
      // IMAGE CELL
      let imgEl = null;
      const img = cardRoot.querySelector('.image img');
      if (img) {
        imgEl = img;
      }
      // TEXT CELL
      const content = cardRoot.querySelector('.content');
      const textNodes = [];
      if (content) {
        // Title (h2.header)
        const h2 = content.querySelector('h2.header, h2');
        if (h2 && h2.textContent.trim()) textNodes.push(h2);
        // Description: first <p> that is not .subheading and does not contain <a>, with text
        const ps = Array.from(content.querySelectorAll('p'));
        const descP = ps.find(p => !p.classList.contains('subheading') && !p.querySelector('a') && p.textContent.trim());
        if (descP) {
          textNodes.push(descP);
        }
        // CTA: first <p> with <a>
        const ctaP = ps.find(p => p.querySelector('a'));
        if (ctaP) {
          textNodes.push(ctaP);
        }
      }
      // Only add rows with an image and at least one text element
      if (imgEl && textNodes.length > 0) {
        rows.push([imgEl, textNodes]);
      }
    });
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

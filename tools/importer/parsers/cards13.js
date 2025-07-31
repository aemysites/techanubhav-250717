/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const cells = [['Cards (cards13)']];

  // 2. Find all card items (div.sl-item)
  const cardItems = element.querySelectorAll('.sl-item');
  cardItems.forEach(cardItem => {
    // Find the first 'section.cm-content-tile' in this card item
    const section = cardItem.querySelector('section.cm-content-tile');
    if (!section) return;

    // Inside section: there's a single child <div>
    const cardDiv = section.querySelector(':scope > div');
    if (!cardDiv) return;

    // First column: image/icon in .image (mandatory)
    const imageWrap = cardDiv.querySelector('.image');
    let imageEl = '';
    if (imageWrap) {
      // Use the <img> element directly
      const img = imageWrap.querySelector('img');
      if (img) imageEl = img;
    }

    // Second column: text content from .content (mandatory)
    const contentWrap = cardDiv.querySelector('.content');
    let contentElements = [];
    if (contentWrap) {
      // Title: h1 or h2 or h3 (keep heading level as is)
      const heading = contentWrap.querySelector('h1, h2, h3');
      if (heading) contentElements.push(heading);
      // Description: add all <p> elements EXCEPT .subheading and those that contain only a link
      const descPs = Array.from(contentWrap.querySelectorAll('p')).filter(p => {
        if (p.classList.contains('subheading')) return false;
        // Exclude <p> if it contains only a single <a>
        if (p.childElementCount === 1 && p.querySelector('a')) {
          // But if it also contains other text, keep it
          if (p.textContent.replace(p.querySelector('a').textContent, '').trim() === '') return false;
        }
        return true;
      });
      contentElements.push(...descPs);
      // CTA: first <a> inside a <p> - add the entire <p> if present
      const ctaP = Array.from(contentWrap.querySelectorAll('p')).find(p => p.querySelector('a'));
      if (ctaP && !contentElements.includes(ctaP)) contentElements.push(ctaP);
    }

    // If there are no contentElements, put an empty string
    const contentCell = contentElements.length ? (contentElements.length === 1 ? contentElements[0] : contentElements) : '';

    // 3. Push row: [imageEl or '', contentCell]
    cells.push([imageEl || '', contentCell]);
  });

  // 4. Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

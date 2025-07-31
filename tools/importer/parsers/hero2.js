/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name as required
  const headerRow = ['Hero (hero2)'];

  // --- Extract background image ---
  let imgEl = null;
  let altText = '';
  // Find the .intrinsic-el.img element for the background image and alt text
  const bgDiv = element.querySelector('.intrinsic-el.img');
  if (bgDiv) {
    const bgImage = bgDiv.style && bgDiv.style.backgroundImage;
    if (bgImage) {
      const match = bgImage.match(/url\(["']?(.*?)["']?\)/i);
      if (match && match[1]) {
        imgEl = document.createElement('img');
        imgEl.src = match[1];
        // Use any span text inside bgDiv as alt
        const altSpan = bgDiv.querySelector('span');
        if (altSpan && altSpan.textContent) {
          altText = altSpan.textContent.trim();
        }
        imgEl.alt = altText;
      }
    }
  }
  // Always provide a cell, even if no image
  const imageRow = [imgEl ? imgEl : ''];

  // --- Extract any text content ---
  // Gather all visible text from the element, excluding the .intrinsic-el.img (already used for alt)
  let textContent = '';
  // We'll use a TreeWalker to get all text nodes except under .intrinsic-el.img
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: node => {
      let el = node.parentElement;
      // exclude all text under the background image container
      while (el) {
        if (el.classList && el.classList.contains('intrinsic-el')) return NodeFilter.FILTER_REJECT;
        el = el.parentElement;
      }
      if (node.textContent.trim()) return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_REJECT;
    }
  });
  let node;
  const textArr = [];
  while ((node = walker.nextNode())) {
    textArr.push(node.textContent.trim());
  }
  if (textArr.length) {
    textContent = textArr.join(' ');
  }
  const textRow = [textContent ? textContent : ''];

  // --- Construct block table ---
  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

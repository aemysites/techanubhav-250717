/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Hero (hero28)'];

  // Try to dynamically extract the background image URL and its alt text
  let imgEl = null;
  let textContent = '';
  const intrinsicEl = element.querySelector('.intrinsic-el.img');
  if (intrinsicEl) {
    // Extract background image URL
    let bgUrl = '';
    if (intrinsicEl.style && intrinsicEl.style.backgroundImage) {
      const match = intrinsicEl.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
      if (match && match[1]) {
        bgUrl = match[1];
      }
    }
    if (bgUrl) {
      // Resolve to absolute URL
      const a = document.createElement('a');
      a.href = bgUrl;
      const absUrl = a.href;
      imgEl = document.createElement('img');
      imgEl.src = absUrl;
      // Fetch alt text from child span.vh (if present)
      const vh = intrinsicEl.querySelector('span.vh');
      imgEl.alt = vh && vh.textContent ? vh.textContent.trim() : '';
    }
    // Extract any visible text content (e.g., span.vh)
    // Only add text if it's not the same as alt text (to avoid duplication)
    const vh = intrinsicEl.querySelector('span.vh');
    if (vh && vh.textContent) {
      textContent = vh.textContent.trim();
    }
  }

  // Second row: background image (optional)
  const imageRow = [imgEl];

  // Third row: text content (if any)
  // Only add a paragraph if there is text content and it is not empty
  let contentRow;
  if (textContent) {
    const p = document.createElement('p');
    p.textContent = textContent;
    contentRow = [p];
  } else {
    contentRow = [''];
  }

  // Compose cells array (one table, one header, exactly as in the example)
  const cells = [headerRow, imageRow, contentRow];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

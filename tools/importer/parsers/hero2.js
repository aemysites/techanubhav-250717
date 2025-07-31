/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the background image URL
  const intrinsicEl = element.querySelector('.intrinsic-el');
  let bgUrl = '';
  if (intrinsicEl && intrinsicEl.style && intrinsicEl.style.backgroundImage) {
    const match = intrinsicEl.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (match && match[1]) {
      bgUrl = match[1];
    }
  }

  // Find all visually hidden spans for text content
  let textContent = '';
  if (intrinsicEl) {
    const vhSpans = intrinsicEl.querySelectorAll('span, .vh');
    for (const span of vhSpans) {
      if (span.textContent && span.textContent.trim()) {
        textContent = span.textContent.trim();
        break;
      }
    }
  }

  // Create the image element if there's a background image
  let imgEl = null;
  if (bgUrl) {
    imgEl = document.createElement('img');
    imgEl.src = bgUrl;
    imgEl.alt = textContent;
  }

  // Put any text content in a heading if present
  let textEl = null;
  if (textContent) {
    textEl = document.createElement('h1');
    textEl.textContent = textContent;
  }

  // Compose the table block as per the example
  // Header row is block name; second row is image; third row is text
  const cells = [
    ['Hero (hero2)'],
    [imgEl],
    [textEl]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

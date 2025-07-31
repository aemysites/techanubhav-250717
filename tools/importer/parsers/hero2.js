/* global WebImporter */
export default function parse(element, { document }) {
  // Header: must match exactly
  const headerRow = ['Hero (hero2)'];

  // 2nd row: Background image (if present)
  let bgImgEl = null;
  const imgDiv = element.querySelector('.intrinsic-el.img');
  if (imgDiv) {
    const style = imgDiv.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      const src = match[1].replace(/['"]/g, '');
      bgImgEl = document.createElement('img');
      bgImgEl.src = src;
      // Use visually hidden span as alt text if present
      const altSpan = imgDiv.querySelector('span');
      bgImgEl.alt = altSpan ? altSpan.textContent.trim() : '';
    }
  }
  const imageRow = [bgImgEl ? bgImgEl : ''];

  // 3rd row: All textual/element content that is NOT the background image
  // In this source structure, .intrinsic-el.img (background image) is separate from other content (which is absent here)
  // However, parse for text outside image for generality
  // We'll gather all direct children except those related to image
  const nonImgContent = Array.from(element.children).filter(child => {
    // Exclude any branch that contains the image div
    return !child.classList.contains('intrinsic-wrap');
  });
  // If there is non-image content, include it. Otherwise, leave empty string cell.
  let contentCell = '';
  if (nonImgContent.length) {
    // If multiple elements, include them as an array so they render in one cell
    contentCell = nonImgContent.length === 1 ? nonImgContent[0] : nonImgContent;
  }
  const contentRow = [contentCell];

  // Table structure
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

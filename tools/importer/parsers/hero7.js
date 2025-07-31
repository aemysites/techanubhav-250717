/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as example
  const headerRow = ['Hero (hero7)'];

  // Row 2: Visual block - extract image
  let imgEl = '';
  const imageDiv = element.querySelector('.intrinsic-el.img');
  if (imageDiv) {
    const bg = imageDiv.style.backgroundImage;
    const match = bg.match(/url\(["']?(.*?)["']?\)/);
    if (match && match[1]) {
      let src = match[1];
      // Make absolute
      const temp = document.createElement('a');
      temp.href = src;
      src = temp.href;
      const img = document.createElement('img');
      img.src = src;
      const altSpan = imageDiv.querySelector('span');
      if (altSpan && altSpan.textContent.trim()) {
        img.alt = altSpan.textContent.trim();
      }
      imgEl = img;
    }
  }
  const imageRow = [imgEl];

  // Row 3: All .content block content, preserving all text, blocks, and formatting
  const contentDiv = element.querySelector('.content');
  let contentCell = '';
  if (contentDiv) {
    // Instead of cloning, directly reference the .content div to preserve all structure and elements
    contentCell = [contentDiv];
  }
  const contentRow = [contentCell];

  // Compose block table
  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

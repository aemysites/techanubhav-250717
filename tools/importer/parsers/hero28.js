/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required
  const headerRow = ['Hero (hero28)'];

  // --- Extract Background Image (row 2) ---
  let bgImgEl = null;
  const bgdiv = element.querySelector('.intrinsic-el.img');
  if (bgdiv) {
    const style = bgdiv.getAttribute('style') || '';
    const urlMatch = style.match(/background-image:\s*url\((['"]?)(.*?)\1\)/i);
    if (urlMatch && urlMatch[2]) {
      // Resolve the URL (relative or absolute)
      const img = document.createElement('img');
      // Convert to absolute URL if needed
      const temp = document.createElement('a');
      temp.href = urlMatch[2];
      img.src = temp.href;
      // Get alt text from .vh span
      const altSpan = bgdiv.querySelector('span') || element.querySelector('.vh');
      img.alt = altSpan ? altSpan.textContent.trim() : '';
      bgImgEl = img;
    }
  }

  // --- Extract All Remaining Text Content (row 3) ---
  // In the source HTML, the only textual content is within the .vh span
  // To be robust to future variations, grab ALL text nodes that are not empty and not inside the img div
  const imgDiv = element.querySelector('.intrinsic-el.img');
  // Collect possible text nodes in the entire block, except inside the background image div
  let textNodes = [];
  function extractTextNodes(node) {
    if (!imgDiv || !imgDiv.contains(node)) {
      node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
          textNodes.push(child.textContent.trim());
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          extractTextNodes(child);
        }
      });
    }
  }
  extractTextNodes(element);

  // Also, explicitly check for .vh span if it's missed
  if (textNodes.length === 0) {
    const vhSpan = element.querySelector('.vh');
    if (vhSpan && vhSpan.textContent.trim()) {
      textNodes = [vhSpan.textContent.trim()];
    }
  }

  // If there is any text at all, add to a paragraph for semantic clarity
  let textCell;
  if (textNodes.length > 0) {
    const p = document.createElement('p');
    p.textContent = textNodes.join(' ');
    textCell = [p];
  } else {
    textCell = [''];
  }

  // Build the table rows per Hero (hero28) block structure
  const rows = [
    headerRow,
    [bgImgEl].filter(Boolean),
    textCell
  ];

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract the background image as an <img>
  let imgEl = null;
  let altText = '';
  // Try to find the div with background-image
  const bgDiv = element.querySelector('.intrinsic-el.img');
  if (bgDiv && bgDiv.style && bgDiv.style.backgroundImage) {
    const bgStyle = bgDiv.style.backgroundImage;
    const urlMatch = bgStyle.match(/url\(["']?(.*?)["']?\)/);
    if (urlMatch && urlMatch[1]) {
      // Convert relative URL to absolute
      const a = document.createElement('a');
      a.href = urlMatch[1];
      const absUrl = a.href;
      imgEl = document.createElement('img');
      imgEl.src = absUrl;
      // Get alt text if present (from .vh span)
      const vhSpan = bgDiv.querySelector('.vh') || element.querySelector('.vh');
      if (vhSpan) {
        altText = vhSpan.textContent.trim();
        imgEl.alt = altText;
      }
    }
  }
  // 2. Extract all visible text content (except from script/style, and except what's used as image alt)
  let textContent = '';
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const val = node.textContent.trim();
      if (!val) return NodeFilter.FILTER_REJECT;
      // Exclude script/style tags
      const tag = node.parentElement && node.parentElement.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
      // Exclude text used as alt text
      if (altText && val === altText) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let node, textNodes = [];
  while ((node = walker.nextNode())) {
    textNodes.push(node.textContent.trim());
  }
  // Combine all remaining text, preserving newlines if multiple blocks
  textContent = textNodes.join('\n').trim();

  // 3. Compose the table in the structure: header, image, content
  const cells = [
    ['Hero (hero2)'],
    [imgEl],
    [textContent ? textContent : ''],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

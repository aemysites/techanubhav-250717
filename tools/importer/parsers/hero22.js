/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches exactly
  const headerRow = ['Hero (hero22)'];

  // 2. Background image extraction
  let bgImgEl = null;
  const imageDiv = element.querySelector('.intrinsic-el');
  if (imageDiv && imageDiv.style.backgroundImage) {
    const match = imageDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/i);
    if (match && match[1]) {
      let src = match[1];
      if (!/^https?:/.test(src)) {
        src = new URL(src, document.location).href;
      }
      bgImgEl = document.createElement('img');
      bgImgEl.src = src;
      const vh = imageDiv.querySelector('.vh');
      bgImgEl.alt = vh ? vh.textContent.trim() : '';
    }
  }
  const imageRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content: reference all direct children nodes of .content (preserve all)
  const content = element.querySelector('.content');
  let contentNodes = [];
  if (content) {
    // For each direct child node in .content
    for (const node of content.childNodes) {
      // For CTA span, convert to link if parent <a> is present
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList && node.classList.contains('cta')
      ) {
        // Find the outermost ancestor <a> for the whole banner
        const a = element.querySelector('a[href]');
        if (a && a.href) {
          const ctaLink = document.createElement('a');
          ctaLink.href = a.href;
          ctaLink.textContent = node.textContent.trim();
          contentNodes.push(ctaLink);
          continue;
        }
      }
      // Reference the existing node (not a clone)
      if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
        contentNodes.push(node);
      }
    }
  }
  const contentRow = [contentNodes];

  // 4. Create the block table and replace original element
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);
  element.replaceWith(table);
}

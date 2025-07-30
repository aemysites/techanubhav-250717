/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header as in the example
  const headerRow = ['Hero (hero22)'];

  // 2. Extract background image (row 2)
  let imageEl = null;
  const bgDiv = element.querySelector('.intrinsic-el.img');
  if (bgDiv && bgDiv.style && bgDiv.style.backgroundImage) {
    const match = bgDiv.style.backgroundImage.match(/url\((['"]?)(.*?)\1\)/);
    if (match && match[2]) {
      let url = match[2];
      // Make absolute if necessary
      const link = document.createElement('a');
      link.href = url;
      url = link.href;
      imageEl = document.createElement('img');
      imageEl.src = url;
      // extract alt text from .vh span if present
      const vh = bgDiv.querySelector('.vh');
      imageEl.alt = vh ? vh.textContent.trim() : '';
    }
  }

  // 3. Extract content (row 3)
  const contentDiv = element.querySelector('.content');
  const contentParts = [];

  if (contentDiv) {
    // Title (h1.header)
    const h1 = contentDiv.querySelector('.header');
    if (h1) contentParts.push(h1);
    // Subheading (.subtitle)
    const subtitle = contentDiv.querySelector('.subtitle');
    if (subtitle) contentParts.push(subtitle);
    // Description (first p in .content)
    // Be careful not to double add the h1, which has <p> inside
    const allPs = Array.from(contentDiv.querySelectorAll('p'));
    allPs.forEach((p) => {
      // Only add p if not inside the h1.header
      if (!h1 || !h1.contains(p)) {
        contentParts.push(p);
      }
    });
    // CTA (.cta), as a link with the correct href
    const ctaSpan = contentDiv.querySelector('.cta');
    if (ctaSpan) {
      // Find closest ancestor <a> from .cta span
      let ctaLink = ctaSpan.closest('a');
      // If not found, fallback to the block's main a
      if (!ctaLink) ctaLink = element.querySelector('a');
      if (ctaLink && ctaLink.href) {
        const a = document.createElement('a');
        a.href = ctaLink.href;
        a.textContent = ctaSpan.textContent.trim();
        contentParts.push(a);
      }
    }
  }

  // Build the block table, matching the structure: header, image, content
  const cells = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentParts]
  ];
  
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

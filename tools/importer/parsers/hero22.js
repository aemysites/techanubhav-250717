/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: EXACT match to example
  const headerRow = ['Hero (hero22)'];

  // 2. Row 2: Background image only
  // Find the background image URL from '.intrinsic-el.img' style
  let bgImgUrl = '';
  let bgImgAlt = '';
  const imgDiv = element.querySelector('.intrinsic-el.img');
  if (imgDiv) {
    const bgStyle = imgDiv.getAttribute('style') || '';
    const match = bgStyle.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (match) {
      bgImgUrl = match[1];
    }
    // Alt text: hidden span inside
    const vhSpan = imgDiv.querySelector('span.vh');
    if (vhSpan) {
      bgImgAlt = vhSpan.textContent.trim();
    }
  }
  let bgImgElem = '';
  if (bgImgUrl) {
    bgImgElem = document.createElement('img');
    bgImgElem.src = bgImgUrl;
    if (bgImgAlt) bgImgElem.alt = bgImgAlt;
  }

  // 3. Row 3: Title, Subheading, Paragraph, CTA (link)
  let contentCell = [];
  const content = element.querySelector('.content');
  if (content) {
    // Title: take .header h1 content, preserve heading
    const h1 = content.querySelector('h1');
    if (h1) {
      contentCell.push(h1);
    }
    // Subtitle: .subtitle (render as <p> for structure)
    const subtitle = content.querySelector('.subtitle');
    if (subtitle) {
      // Use a <p> for semantic meaning
      const subP = document.createElement('p');
      subP.textContent = subtitle.textContent.trim();
      contentCell.push(subP);
    }
    // Description: <p> (not inside header)
    const ps = Array.from(content.querySelectorAll('p'));
    if (ps.length > 0) {
      // Only add <p> that is not inside h1/header
      ps.forEach(p => {
        if (!h1 || !h1.contains(p)) {
          contentCell.push(p);
        }
      });
    }
    // CTA: .cta as a link
    const cta = content.querySelector('.cta');
    if (cta) {
      // Find nearest ancestor <a> wrapping the block for destination
      let ctaHref = '';
      let ancestor = element;
      while (ancestor && ancestor !== document.body) {
        if (ancestor.tagName === 'A' && ancestor.href) {
          ctaHref = ancestor.href;
          break;
        }
        ancestor = ancestor.parentElement;
      }
      // If not found, look for <a> inside the section
      if (!ctaHref) {
        const a = element.querySelector('a[href]');
        if (a) ctaHref = a.href;
      }
      if (ctaHref) {
        const link = document.createElement('a');
        link.href = ctaHref;
        link.textContent = cta.textContent.trim();
        // Per best practice, add button styling class if needed
        link.className = 'button primary';
        contentCell.push(link);
      }
    }
  }

  // Fill with empty string if no content found to ensure correct structure
  if (contentCell.length === 0) contentCell = [''];

  const cells = [
    headerRow,
    [bgImgElem || ''],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

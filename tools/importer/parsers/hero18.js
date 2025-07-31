/* global WebImporter */
export default function parse(element, { document }) {
  // Header row per block spec
  const headerRow = ['Hero (hero18)'];
  // No background image in source HTML
  const backgroundRow = [''];
  // Extract elements from the given HTML, referencing them directly (do not clone)

  // Title: <h1 class="header">
  let h1 = element.querySelector('h1.header');
  let title = null;
  if (h1) {
    // Use the text content of the first <b> inside
    const bold = h1.querySelector('b');
    if (bold) {
      // Use original element for heading semantics
      title = document.createElement('h1');
      title.textContent = bold.textContent.trim();
    }
  }

  // Subheading: <span class="subtitle">
  let subtitle = element.querySelector('.subtitle');
  let subheading = null;
  if (subtitle && subtitle.textContent.trim().length > 0) {
    subheading = document.createElement('div');
    subheading.textContent = subtitle.textContent.trim();
    subheading.style.fontSize = 'small';
    subheading.style.textTransform = 'uppercase';
    subheading.style.marginBottom = '0.4em';
  }

  // Description: first non-empty <p> not inside h1
  let desc = null;
  const ps = [...element.querySelectorAll('p')].filter(p => !h1 || !h1.contains(p));
  for (const p of ps) {
    if (p.textContent && p.textContent.trim().length > 0) {
      desc = p; // Reference the existing element
      break;
    }
  }

  // CTA: <span class="cta">
  let ctaSpan = element.querySelector('span.cta');
  let cta = null;
  if (ctaSpan && ctaSpan.textContent.trim().length > 0) {
    // Use a <p> for the CTA button text as in the screenshot
    cta = document.createElement('p');
    cta.textContent = ctaSpan.textContent.trim();
    cta.style.fontWeight = 'bold';
    cta.style.display = 'inline-block';
    cta.style.background = 'linear-gradient(90deg, #d90429 0%, #8217db 100%)';
    cta.style.color = '#fff';
    cta.style.padding = '0.5em 1.2em';
    cta.style.borderRadius = '4px';
    cta.style.margin = '1em 0 0 0';
  }

  // Compose cell content in order: subheading, title, desc, cta
  const contentParts = [];
  if (subheading) contentParts.push(subheading);
  if (title) contentParts.push(title);
  if (desc) contentParts.push(desc);
  if (cta) contentParts.push(cta);

  // Always create 3 rows (as per spec): header, background image, content
  const contentRow = [contentParts];
  const cells = [headerRow, backgroundRow, contentRow];

  // Create the block table and replace the element in the DOM
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

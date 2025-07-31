/* global WebImporter */
export default function parse(element, { document }) {
  // Compose table header
  const headerRow = ['Hero (hero3)'];

  // Compose background image row: none in this HTML
  const imageRow = [''];

  // Compose content row
  const contentEls = [];

  // Subtitle (should be above heading if present)
  const subtitle = element.querySelector('.subtitle');
  if (subtitle && subtitle.textContent.trim()) {
    contentEls.push(subtitle);
  }

  // Title: look for h1, but may have a p and span inside
  const h1 = element.querySelector('h1');
  if (h1) {
    // Keep the original heading structure and children
    contentEls.push(h1);
  }

  // Description/paragraphs
  const ps = Array.from(element.querySelectorAll('p'));
  // Only include non-empty paragraphs that are NOT inside h1 (don't duplicate heading)
  for (const p of ps) {
    // Check if p is not inside h1 and is not empty
    if (!h1 || !h1.contains(p)) {
      if (p.textContent.trim()) {
        contentEls.push(p);
      }
    }
  }

  // CTA (optional)
  const cta = element.querySelector('.cta');
  if (cta && cta.textContent.trim()) {
    contentEls.push(cta);
  }

  // Compose table content row
  const contentRow = [contentEls];

  // Compose the final table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

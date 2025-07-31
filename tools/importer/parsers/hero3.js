/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name as specified
  const headerRow = ['Hero (hero3)'];
  // Image row: no image present in this HTML – must be a single empty string
  const imageRow = [''];

  // Compose the content cell
  // Extract title: We want to preserve semantic heading structure, so use the <h1> directly if present
  let title = null;
  const h1 = element.querySelector('h1');
  if (h1) {
    // There is a <p><span><b>...</b></span></p> inside the h1. Get the textContent of the bold element or fallback.
    // We want to preserve an <h1> element in output for semantics.
    title = document.createElement('h1');
    const b = h1.querySelector('b');
    if (b) {
      title.textContent = b.textContent.trim();
    } else {
      title.textContent = h1.textContent.trim();
    }
  }

  // Extract subtitle: .subtitle span
  let subtitle = null;
  const subtitleEl = element.querySelector('.subtitle');
  if (subtitleEl && subtitleEl.textContent.trim()) {
    // For semantic meaning, use a <div> for subtitle
    subtitle = document.createElement('div');
    subtitle.textContent = subtitleEl.textContent.trim();
  }

  // Extract first non-empty paragraph outside h1 as description
  let desc = null;
  const ps = Array.from(element.querySelectorAll('p')).filter(p => !(h1 && h1.contains(p)));
  for (let p of ps) {
    if (p.textContent && p.textContent.trim().length > 0) {
      desc = p;
      break;
    }
  }

  // Extract CTA: .cta span
  let cta = null;
  const ctaSpan = element.querySelector('.cta');
  if (ctaSpan && ctaSpan.textContent.trim()) {
    // Use a <span> if it's just text, as in the source HTML (no link present)
    cta = ctaSpan;
  }

  // Compose content cell: vertical stack as in the example screenshot (subtitle, title, desc, cta)
  // Only include elements if they exist
  const contentElements = [];
  if (subtitle) contentElements.push(subtitle);
  if (title) contentElements.push(title);
  if (desc) contentElements.push(desc);
  if (cta) contentElements.push(cta);
  
  const contentRow = [contentElements];

  // Build the table as required
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}

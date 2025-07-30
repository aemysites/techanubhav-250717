/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row - must match exactly
  const headerRow = ['Hero (hero18)'];

  // 2. Background image row (empty for this HTML)
  const imageRow = [''];

  // 3. Content row: heading, subheading, paragraph, CTA
  const content = [];

  // --- Heading extraction (preserve semantic heading level) ---
  const h1 = element.querySelector('h1');
  if (h1) {
    // h1 may contain nested <p><span><b>...</b></span></p>
    // Get the textContent of the h1 (which should include all nested children)
    // But we should use the original h1 element for semantics
    content.push(h1);
  }

  // --- Subheading extraction ---
  const subtitle = element.querySelector('span.subtitle');
  if (subtitle) {
    // Use a <p> to wrap for structure (or keep as span if context demands)
    // We'll reference the original subtitle element for semantic meaning
    content.push(subtitle);
  }

  // --- Paragraph extraction ---
  // Find first non-empty <p> (ignoring those in h1 or without text)
  const ps = Array.from(element.querySelectorAll('p'));
  for (const p of ps) {
    // Exclude <p> that is a descendant of h1 (already captured)
    if (h1 && h1.contains(p)) continue;
    if (p.textContent && p.textContent.trim().length > 0) {
      content.push(p);
      break;
    }
  }

  // --- CTA extraction ---
  const cta = element.querySelector('span.cta');
  if (cta) {
    // Reference the actual span.cta; if it should be a link or button, leave as is
    content.push(cta);
  }

  // Build the table
  const rows = [headerRow, imageRow, [content]];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

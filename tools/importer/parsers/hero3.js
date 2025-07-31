/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: Must exactly match the example
  const headerRow = ['Hero (hero3)'];

  // Second row: background image; not present in this HTML, so blank
  const imageRow = [''];

  // Third row: Gather content (title, subtitle, description, CTA), semantically
  const contentEls = [];

  // h1.header may be styled with <span> and <b> inside a <p>
  // We want to use a heading, preserving its style/semantic
  const h1 = element.querySelector('h1.header');
  if (h1) {
    // If h1 contains just a <p> (and that contains a <span>), unwrap to get the deepest styled element
    let titleNode = h1;
    if (h1.children.length === 1 && h1.children[0].tagName === 'P') {
      const p = h1.children[0];
      if (p.children.length === 1 && p.children[0].tagName === 'SPAN') {
        titleNode = p.children[0];
      } else {
        titleNode = p;
      }
    }
    contentEls.push(titleNode);
  }

  // Subtitle (optional)
  const subtitle = element.querySelector('.subtitle');
  if (subtitle && subtitle.textContent.trim()) {
    contentEls.push(subtitle);
  }

  // Description paragraph: the longest <p>
  let descP = null;
  const paragraphs = element.querySelectorAll('p');
  let maxLen = 0;
  paragraphs.forEach(p => {
    const txt = p.textContent.trim();
    if (txt.length > maxLen) {
      maxLen = txt.length;
      descP = p;
    }
  });
  if (descP && descP.textContent.trim()) {
    contentEls.push(descP);
  }

  // CTA (optional)
  const cta = element.querySelector('.cta');
  if (cta && cta.textContent.trim()) {
    contentEls.push(cta);
  }

  // Compose the table
  const cells = [headerRow, imageRow, [contentEls]];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}

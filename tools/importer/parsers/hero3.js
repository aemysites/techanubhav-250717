/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Hero (hero3)'];

  // No background image in this HTML, so the second row is empty
  const backgroundImageRow = [''];

  // Build the content row with existing elements, preserving their structure
  const content = [];
  // Headline (h1.header may contain a <p><span><b> structure)
  const h1 = element.querySelector('h1, .header');
  if (h1) content.push(h1);
  // Subheading
  const subtitle = element.querySelector('.subtitle');
  if (subtitle) {
    content.push(document.createElement('br'));
    content.push(subtitle);
  }
  // Main descriptive paragraph (the first non-empty p not inside h1)
  let mainParagraph = null;
  const pTags = element.querySelectorAll(':scope > p');
  for (const p of pTags) {
    if (p.textContent.trim()) {
      mainParagraph = p;
      break;
    }
  }
  if (mainParagraph) {
    content.push(document.createElement('br'));
    content.push(mainParagraph);
  }
  // CTA button (as span.cta)
  const cta = element.querySelector('.cta');
  if (cta) {
    content.push(document.createElement('br'));
    content.push(cta);
  }

  // Structure as single cell in third row
  const mainContentRow = [content];

  // Build the block table with 3 rows, 1 col each
  const cells = [
    headerRow,
    backgroundImageRow,
    mainContentRow
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

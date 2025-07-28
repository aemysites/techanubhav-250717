/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ['Hero (hero35)'];

  // No background image in the provided HTML, so second row is empty string
  const backgroundRow = [''];

  // Content row: collect headline, subheading, CTA
  // Layout: section > div.container > div.grid-layout > [div (text), a (cta)]
  let contentElements = [];
  const container = element.querySelector('.container');
  if (container) {
    const grid = container.querySelector('.grid-layout');
    if (grid) {
      // Find the text div (contains headline and subheading)
      let textDiv = null;
      let cta = null;
      for (const child of grid.children) {
        if (child.tagName === 'DIV' && !textDiv) {
          textDiv = child;
        } else if (child.tagName === 'A' && !cta) {
          cta = child;
        }
      }
      if (textDiv) {
        // Include all element children (headings, paragraphs, etc.)
        contentElements.push(...Array.from(textDiv.children));
      }
      if (cta) {
        contentElements.push(cta);
      }
    }
  }
  // If nothing was found, insert empty string to preserve structure
  if (contentElements.length === 0) {
    contentElements = [''];
  }

  const contentRow = [contentElements];

  const cells = [
    headerRow,
    backgroundRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

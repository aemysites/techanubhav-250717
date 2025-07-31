/* global WebImporter */
export default function parse(element, { document }) {
  // Find the sl-list (columns container)
  const slList = element.querySelector('.sl-list.has-2-items');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length < 2) return;

  // Extract left and right content for columns
  let leftColumn = '';
  const leftRichText = slItems[0].querySelector('.cm-rich-text');
  if (leftRichText) {
    leftColumn = leftRichText;
  }

  let rightColumn = '';
  const rightParagraph = slItems[1].querySelector('.cq-dd-paragraph');
  if (rightParagraph) {
    const linksSection = rightParagraph.querySelector('section.cm-links-related');
    if (linksSection) {
      const emptyHeader = linksSection.querySelector('h3.header');
      if (emptyHeader && !emptyHeader.textContent.trim()) {
        emptyHeader.remove();
      }
      rightColumn = linksSection;
    }
  }

  // Header row must be a single cell array
  const cells = [
    ['Columns (columns24)'], // Header row, one cell
    [leftColumn, rightColumn] // Content row, multiple columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

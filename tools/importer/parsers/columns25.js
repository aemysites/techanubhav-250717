/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Columns (columns25)'];

  // Get the two columns: left = image, right = content
  // Find .sl-list that contains .sl-item (columns)
  const slList = element.querySelector('.sl-list');
  let col1 = '', col2 = '';
  if (slList) {
    const items = Array.from(slList.querySelectorAll(':scope > .sl-item'));
    if (items.length >= 2) {
      // Left: image block (include the full section for robustness)
      const imgSection = items[0].querySelector('section.cm-image, section.cm.cm-image') || items[0];
      col1 = imgSection;
      // Right: content block (include the full div for robustness)
      const contentDiv = items[1].querySelector('.cm-rich-text, .cm.cm-rich-text') || items[1];
      col2 = contentDiv;
    }
  }

  // Fallback edge case: if not found, use empty string so table structure is maintained
  const columnsRow = [col1 || '', col2 || ''];

  const cells = [
    headerRow,
    columnsRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

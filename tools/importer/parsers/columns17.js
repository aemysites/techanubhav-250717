/* global WebImporter */
export default function parse(element, { document }) {
  // Header for the columns block
  const headerRow = ['Columns (columns17)'];

  // Find the two columns (sl-item)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length < 2) return;

  // First column: the left -- the phone image section
  let leftCol = null;
  {
    // Use the whole section for semantic meaning
    const imgSection = slItems[0].querySelector('section, figure, img');
    if (imgSection) {
      // Use the topmost section/figure or fallback to the img
      if (imgSection.tagName === 'SECTION' || imgSection.tagName === 'FIGURE') {
        leftCol = imgSection;
      } else {
        leftCol = imgSection;
      }
    }
  }

  // Second column: the right -- text + links
  let rightCol = null;
  {
    // Use all content inside the .cm-rich-text container
    const richText = slItems[1].querySelector('.cm-rich-text');
    if (richText) {
      rightCol = richText;
    }
  }

  if (!leftCol || !rightCol) return;

  // Build the table
  const cells = [
    headerRow,
    [leftCol, rightCol]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

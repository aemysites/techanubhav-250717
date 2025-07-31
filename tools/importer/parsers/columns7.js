/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two columns inside the source block
  // .sl-list > .sl-item, each with one main content block
  const slList = element.querySelector('.sl-list');
  let col1 = null;
  let col2 = null;
  if (slList) {
    const items = slList.querySelectorAll(':scope > .sl-item');
    if (items.length > 0) {
      // First column: the image section (section.cm-image)
      const col1Block = items[0].querySelector(':scope > section, :scope > div, :scope > figure, :scope > img');
      col1 = col1Block || items[0];
      // Second column: the text and button area (div.cm-rich-text)
      const col2Block = items[1].querySelector(':scope > div, :scope > section, :scope > figure');
      col2 = col2Block || items[1];
    }
  }
  
  // Fallbacks if the expected structure is missing
  if (!col1 || !col2) {
    // Try to find direct children
    const divs = element.querySelectorAll(':scope > div');
    if (divs.length > 1) {
      col1 = col1 || divs[0];
      col2 = col2 || divs[1];
    }
  }

  // Compose the table data in the Columns (columns7) format
  const tableData = [
    ['Columns (columns7)'],
    [col1, col2]
  ];

  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}

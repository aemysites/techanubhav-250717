/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns container (usually only one per block)
  const columnsContainer = element.querySelector('.column-container');
  if (!columnsContainer) return;

  // The columns in this pattern are inside .sl-list > .sl-item
  const slList = columnsContainer.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));

  // For each column/sl-item, collect its direct child elements that are meaningful
  const columns = slItems.map((item) => {
    // We'll collect all immediate children that are elements and have meaningful content
    const content = [];
    item.childNodes.forEach((node) => {
      if (node.nodeType === 1) {
        // Only element nodes
        const el = node;
        // Only push elements that are not empty
        if (
          (el.textContent && el.textContent.trim() !== '') ||
          el.querySelector('img,table,ul,ol,a')
        ) {
          content.push(el);
        }
      }
    });
    // If all children are empty, use the whole item
    if (!content.length) content.push(item);
    return content.length === 1 ? content[0] : content;
  });

  // Create the table structure for Columns block
  const cells = [
    ['Columns (columns1)'],
    columns
  ];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

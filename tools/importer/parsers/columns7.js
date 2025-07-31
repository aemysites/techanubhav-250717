/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns list container
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  // Find all immediate column items
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));

  // Collect cells for each column
  const columns = slItems.map((item) => {
    // If image section exists, use it as the column content
    const imageSection = item.querySelector(':scope > section.cm-image');
    if (imageSection) return imageSection;
    // Otherwise, rich text content
    const richText = item.querySelector(':scope > .cm-rich-text, :scope > .module__content');
    if (richText) return richText;
    // Fallback: whole item
    return item;
  });

  // Construct block table
  const cells = [
    ['Columns (columns7)'],
    columns
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Validate required container structure
  const sl = element.querySelector('.sl');
  if (!sl) return;
  const slList = sl.querySelector('.sl-list');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length < 2) return;

  // First column: phone image (keep entire <section class="cm cm-image"> for robustness)
  let col1 = slItems[0].querySelector('section.cm-image, section.cm.cm-image');
  if (!col1) col1 = slItems[0]; // fallback to whole item if image section missing

  // Second column: right rich text area (keep all content of .cm-rich-text)
  let col2 = slItems[1].querySelector('.cm-rich-text, .cm.cm-rich-text');
  if (!col2) col2 = slItems[1]; // fallback

  // Compose table cells as per block spec
  const cells = [
    ['Columns (columns17)'],
    [col1, col2]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

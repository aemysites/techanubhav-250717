/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Column block header row
  const headerRow = ['Columns (columns24)'];

  // 2. Get the two direct columns: .sl-item (should be exactly 2 for this layout)
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (slItems.length < 2) return;

  // 3. Left column: rich text heading
  // Grab the first element's main content (keep all wrappers and original elements)
  let leftContent = null;
  // If .cm module__content, use it; else use whole .sl-item
  const leftRich = slItems[0].querySelector(':scope > .cm-rich-text, :scope > .cm');
  leftContent = leftRich ? leftRich : slItems[0];

  // 4. Right column: links list
  // This can be a section.cm-links or .cq-dd-paragraph or fallback to .sl-item
  let rightContent = null;
  const rightSection = slItems[1].querySelector(':scope > .cq-dd-paragraph > section, :scope > section');
  rightContent = rightSection ? rightSection : slItems[1];

  // 5. Compose final two-column row
  const contentRow = [leftContent, rightContent];

  // 6. Build table and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure we are operating on the expected block
  if (!element) return;

  // Find the columns: look for direct children of .sl-list > .sl-item
  const slList = element.querySelector(':scope .sl-list');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length < 2) return;

  // COLUMN 1: Look for an image section or any img inside first sl-item
  let col1 = null;
  const imgSection = slItems[0].querySelector('section') || slItems[0].querySelector('img');
  if (imgSection) {
    col1 = imgSection;
  } else {
    col1 = slItems[0]; // fallback to the whole first item
  }

  // COLUMN 2: Look for the rich text module in second sl-item
  let col2 = null;
  const richText = slItems[1].querySelector('.cm-rich-text') || slItems[1];
  col2 = richText;

  // Header row for block
  const headerRow = ['Columns (columns25)'];
  // Content row with two columns (the two blocks)
  const contentRow = [col1, col2];

  // Create table block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the element with the block table
  element.replaceWith(table);
}

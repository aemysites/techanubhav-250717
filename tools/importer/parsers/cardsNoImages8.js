/* global WebImporter */
export default function parse(element, { document }) {
  // Set up the table with the block name as header
  const headerRow = ['Cards'];
  const cells = [headerRow];

  // Find all column containers directly under the block
  // Some HTML has a wrapping div, so support both nested and flat
  let columnContainers = element.querySelectorAll(':scope > div.column-container');
  if (columnContainers.length === 0) {
    // maybe the block is wrapped in a single div (like tab content)
    const wrapper = element.querySelector(':scope > div');
    if (wrapper) {
      columnContainers = wrapper.querySelectorAll(':scope > div.column-container');
    }
  }

  // For each card
  columnContainers.forEach((container) => {
    // The card is a pair of .sl-item: heading (first), then content (second)
    const slItems = container.querySelectorAll(':scope .sl-item');
    if (slItems.length === 2) {
      // Heading: usually a single heading in first item
      const headingEl = slItems[0].querySelector('h1, h2, h3, h4, h5, h6, strong, b');
      // Content: all child nodes (preserving lists, tables, etc)
      const contentEl = slItems[1];
      const rowContent = [];
      if (headingEl) {
        // Use the original heading element (without removing from DOM)
        rowContent.push(headingEl);
      }
      // Add all relevant children from contentEl
      Array.from(contentEl.childNodes).forEach((child) => {
        // Skip duplicate heading if present
        if (
          child.nodeType === Node.ELEMENT_NODE &&
          headingEl &&
          child.textContent.trim() === headingEl.textContent.trim()
        ) {
          return;
        }
        // Ignore empty paragraphs
        if (
          child.nodeType === Node.ELEMENT_NODE &&
          child.tagName === 'P' &&
          child.textContent.trim() === ''
        ) {
          return;
        }
        // Add lists, tables, paragraphs, etc, as-is
        rowContent.push(child);
      });
      // Only add rows that have actual content
      if (rowContent.length > 0) {
        cells.push([rowContent]);
      }
    }
  });

  // Only create the table if there is at least header and one row
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}

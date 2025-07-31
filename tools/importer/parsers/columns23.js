/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .sl-list containing columns
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  // Get immediate children .sl-item for each column
  const items = Array.from(slList.querySelectorAll(':scope > .sl-item'));
  if (items.length === 0) return;
  // Build header row matching the specification
  const headerRow = ['Columns (columns23)'];
  // For each column, combine all top-level sections (preserving markup)
  const contentRow = items.map((item) => {
    // Extract all <section> elements (column features)
    const sections = Array.from(item.querySelectorAll(':scope > section'));
    if (sections.length === 1) {
      return sections[0]; // Single feature, just use the section
    } else if (sections.length > 1) {
      // Wrap all features in a <div> to maintain structure
      const div = document.createElement('div');
      sections.forEach(section => div.appendChild(section));
      return div;
    } else {
      // If no sections found, insert empty content
      return document.createTextNode('');
    }
  });
  // Compose the cells array
  const cells = [headerRow, contentRow];
  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

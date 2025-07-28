/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per the block name in the instructions
  const headerRow = ['Accordion (accordion23)'];
  const rows = [headerRow];

  // Each accordion item is a direct child.div with class "divider"
  const accordionDividers = Array.from(element.querySelectorAll(':scope > .divider'));
  accordionDividers.forEach(divider => {
    // Within each divider, find the grid container
    const grid = divider.querySelector('.grid-layout');
    if (!grid) return; // Defensive: skip if missing
    // This grid should have two children: the title and the content
    const gridChildren = Array.from(grid.children);
    if (gridChildren.length < 2) return; // Defensive: skip if missing either
    const titleEl = gridChildren[0];
    const contentEl = gridChildren[1];
    // Reference the original DOM nodes
    rows.push([titleEl, contentEl]);
  });

  // Create and replace with the accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

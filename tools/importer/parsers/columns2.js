/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate child by class (not recursing)
  function childByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Get the 'container' and 'grid-layout' wrappers
  const container = childByClass(element, 'container');
  if (!container) return;
  const grid = childByClass(container, 'grid-layout');
  if (!grid) return;

  // The grid contains: [Left main column, flex-horizontal (top), flex-horizontal (bottom)]
  // 1. Left main column: the big featured a.utility-link-content-block
  let leftCol = null;
  for (const child of grid.children) {
    if (
      child.tagName === 'A' &&
      child.classList.contains('utility-link-content-block') &&
      child.querySelector('h3.h2-heading')
    ) {
      leftCol = child;
      break;
    }
  }

  // 2. The first flex-horizontal.flex-vertical.flex-gap-sm (top right with 2 features)
  // 3. The second flex-horizontal.flex-vertical.flex-gap-sm (bottom right with 6 links)
  // We'll gather both for the right column.
  const flexBlocks = Array.from(grid.querySelectorAll(':scope > .flex-horizontal.flex-vertical.flex-gap-sm'));
  // Defensive: ensure two vertical stacks exist
  const rightColFragments = [];
  for (const block of flexBlocks) {
    rightColFragments.push(block);
  }

  // Compose the cells for the main block table
  // HEADER FIX: must be a single cell, not two
  const header = ['Columns (columns2)'];
  // The content row is an array with two columns
  const row = [leftCol, rightColFragments];
  const cells = [header, row];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

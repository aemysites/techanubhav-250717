/* global WebImporter */
export default function parse(element, { document }) {
  // Find the direct .container
  const container = element.querySelector('.container');
  if (!container) return;

  // Find the main grid
  const outerGrid = container.querySelector('.w-layout-grid.grid-layout');
  if (!outerGrid) return;

  // Get the direct children (should be [heading, testimonial, attributionGrid])
  const gridChildren = Array.from(outerGrid.children);
  if (gridChildren.length < 3) return;

  const headingEl = gridChildren[0];
  const testimonialEl = gridChildren[1];
  const attributionGrid = gridChildren[2];

  // Attribution grid has:
  // 0: divider
  // 1: flex-horizontal y-center flex-gap-xs (avatar, name/title)
  // 2: svg logo (or similar)
  // We'll place the avatar/name/title in column 1, logo in column 2 of the table
  const attrChildren = Array.from(attributionGrid.children);
  // Defensive: attribution usually in index 1, logo usually in last
  const leftAttr = [];
  if (attrChildren[0]) leftAttr.push(attrChildren[0]); // divider
  if (attrChildren[1]) leftAttr.push(attrChildren[1]); // avatar/name/title
  // Right column is just the last child (usually logo)
  const rightAttr = attrChildren[2] ? [attrChildren[2]] : [];

  // Build table rows:
  // Header row: one cell
  // Second row: two columns (heading, testimonial)
  // Third row: two columns (attribution, logo)
  const rows = [];
  rows.push(['Columns (columns26)']);
  rows.push([headingEl, testimonialEl]);
  rows.push([leftAttr, rightAttr]);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

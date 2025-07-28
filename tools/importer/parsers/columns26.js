/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content grid in the section
  const container = element.querySelector('.container');
  if (!container) return;
  // The first .grid-layout is the two columns: left (heading/text), right (testimonial)
  const mainGrid = container.querySelector('.grid-layout');
  if (!mainGrid) return;
  // Get the direct children of the main grid
  const mainGridChildren = Array.from(mainGrid.children);

  // Defensive: ensure at least 3 children: heading, paragraph, and testimonial grid
  if (mainGridChildren.length < 3) return;

  // Left column: heading and paragraph
  const heading = mainGridChildren[0];
  const paragraph = mainGridChildren[1];
  // Compose left column cell
  const leftColFrag = document.createDocumentFragment();
  if (heading) leftColFrag.append(heading);
  if (paragraph) leftColFrag.append(paragraph);

  // Right column: testimonial block (contains divider, avatar/name/role, and svg logo)
  const testimonialGrid = mainGridChildren[2];
  // Defensive: ensure testimonialGrid exists
  if (!testimonialGrid) return;

  // Compose right column cell
  const rightColFrag = document.createDocumentFragment();
  // Find the row with avatar and name/role
  const flexRow = testimonialGrid.querySelector('.flex-horizontal');
  if (flexRow) rightColFrag.append(flexRow);
  // Find the SVG logo (after the flex row and after the divider)
  const svgLogo = testimonialGrid.querySelector('svg');
  if (svgLogo) {
    // Wrap svg in a div to preserve structure
    const svgDiv = document.createElement('div');
    svgDiv.append(svgLogo);
    rightColFrag.append(svgDiv);
  }

  // Table header as per specification
  const headerRow = ['Columns (columns26)'];
  const cells = [
    headerRow,
    [leftColFrag, rightColFrag]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header
  const headerRow = ['Hero (hero11)'];

  // Find the main grid with text and image as direct children
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  let imageEl = null;
  let textBlock = null;

  // Get immediate children of the grid
  if (grid) {
    const children = grid.querySelectorAll(':scope > *');
    children.forEach((child) => {
      if (child.tagName === 'IMG') {
        imageEl = child;
      } else if (!textBlock && child.querySelector('h1, h2, h3, h4, h5, h6')) {
        textBlock = child;
      }
    });
  }

  // Row 2: image, optional
  const imageRow = [imageEl ? imageEl : ''];

  // Row 3: text content (headline, subheading, CTA)
  let textCellContent = [];
  if (textBlock) {
    // Headline
    const heading = textBlock.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) textCellContent.push(heading);
    // Paragraphs or rich text
    const paragraphBlocks = textBlock.querySelectorAll('.rich-text, .w-richtext');
    if (paragraphBlocks.length > 0) {
      paragraphBlocks.forEach(block => textCellContent.push(block));
    } else {
      // Fallback: direct <p> children if no rich text blocks
      textBlock.querySelectorAll(':scope > p').forEach(p => textCellContent.push(p));
    }
    // CTA buttons (keep full group)
    const buttonGroup = textBlock.querySelector('.button-group');
    if (buttonGroup) textCellContent.push(buttonGroup);
  }
  if (textCellContent.length === 0) textCellContent = [''];
  const textRow = [textCellContent];

  // Assemble and create the table
  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
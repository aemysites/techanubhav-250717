/* global WebImporter */
export default function parse(element, { document }) {
  // Table header from requirements
  const headerRow = ['Columns (columns5)'];

  // Find the columns in the structure
  // The HTML is:
  // <div class="column-container">
  //   <div class="sl has-top-border">
  //     <div class="sl-list has-2-items has-feature-right">
  //       <div class="sl-item"> ...image... </div>
  //       <div class="sl-item"> ...rich content... </div>
  //     </div>
  //   </div>
  // </div>

  // Get the .sl-list (columns wrapper)
  const slList = element.querySelector('.sl-list');
  let columns = [];

  if (slList) {
    // Each .sl-item is a column
    const items = slList.querySelectorAll(':scope > .sl-item');
    // Defensive: Only proceed if two columns found
    if (items.length === 2) {
      // Left column: image
      let leftImageSection = items[0].querySelector('.cm-image') || items[0];
      // Right column: rich text
      let rightRichText = items[1].querySelector('.cm-rich-text') || items[1];
      columns = [leftImageSection, rightRichText];
    } else {
      // fallback, just return the .sl-item nodes
      columns = Array.from(items);
    }
  } else {
    // fallback: if .sl-list not found, use all children
    columns = Array.from(element.children);
  }

  // Build table rows: header, then the columns row
  const tableRows = [headerRow, columns];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name exactly as in the example
  const headerRow = ['Hero (hero7)'];

  // --- Background Image Row ---
  let imageEl = null;
  // Find any element with background-image style as flexible as possible
  const bgDiv = element.querySelector('[style*="background-image"]');
  if (bgDiv) {
    const bg = bgDiv.style.backgroundImage;
    const match = bg && bg.match(/url\(["']?([^"')]+)["']?\)/);
    if (match && match[1]) {
      imageEl = document.createElement('img');
      imageEl.src = match[1];
      // Use inner text (if any) as alt text for accessibility, otherwise blank
      imageEl.alt = (bgDiv.textContent && bgDiv.textContent.trim()) || '';
    }
  }
  const imageRow = [imageEl];

  // --- Content Row ---
  let contentRow = [''];
  // Find the content container
  const contentDiv = element.querySelector('.content');
  if (contentDiv) {
    // Collect ALL direct children (including text nodes and elements) to preserve all text content and structure
    const nodes = Array.from(contentDiv.childNodes).filter((n) => {
      // Keep element nodes and non-empty text nodes
      return n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== '');
    });
    // If there are any nodes, assign them as a single cell array
    if (nodes.length > 0) {
      contentRow = [nodes];
    }
  }

  // Assemble final table and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // The header row for the Cards block
  const rows = [['Cards']];

  // Find all visible tab panels (Cards block)
  const tabPanels = Array.from(element.querySelectorAll(
    ':scope > .tab:not(.is-hidden)[aria-hidden="false"], :scope > .tab.is-default-active.is-active'
  ));

  tabPanels.forEach(tabPanel => {
    // For each .column-container within the tab panel
    const columnContainers = tabPanel.querySelectorAll(':scope > .js-ec + .column-container, :scope > .column-container');
    columnContainers.forEach(container => {
      // Find all .sl-item children (heading + content)
      const slItems = container.querySelectorAll('.sl-item');
      if (slItems.length < 2) return;

      const headingBlock = slItems[0];
      const contentBlock = slItems[1];
      const cardContent = [];

      // Extract heading (from any h1-h6 in the heading block)
      const heading = headingBlock.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        // Use <strong> for the heading text, as in the markdown example
        const strong = document.createElement('strong');
        strong.textContent = heading.textContent.trim();
        cardContent.push(strong);
        cardContent.push(document.createElement('br'));
      }

      // Add ALL content from contentBlock, including tables, lists, etc., skipping duplicate headings
      Array.from(contentBlock.childNodes).forEach(node => {
        // Remove whitespace-only text nodes
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') return;
        // Don't add heading elements (already included above)
        if (node.nodeType === Node.ELEMENT_NODE && /^H[1-6]$/i.test(node.nodeName)) return;
        cardContent.push(node);
      });

      // Only add the row if there's actual content
      if (cardContent.length) {
        rows.push([cardContent]);
      }
    });
  });

  // Only replace if there are card rows (besides the header)
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}

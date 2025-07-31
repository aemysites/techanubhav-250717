/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards8)'];
  const rows = [];

  // Find the card items
  const list = element.querySelector('.sl-list');
  if (list) {
    const items = list.querySelectorAll(':scope > .sl-item');
    items.forEach((item) => {
      // Use the section as the card root
      const section = item.querySelector('section') || item;
      // First image in the card
      const img = section.querySelector('img');
      // Find the .content div which contains the title
      const contentDiv = section.querySelector('.content');
      // Find the link wrapping everything (the card is clickable)
      const link = section.querySelector('a');
      // Try to extract the heading
      const h2 = contentDiv ? contentDiv.querySelector('h2') : section.querySelector('h2');
      // Build the text cell
      const textCell = document.createElement('div');
      // If there is a heading, append it
      if (h2) textCell.appendChild(h2);
      // If there is additional text in .content (other than h2), add it as well
      if (contentDiv) {
        // Get all content inside .content except the h2
        Array.from(contentDiv.childNodes).forEach((node) => {
          if (node !== h2 && node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            textCell.appendChild(p);
          }
        });
      }
      // Always add a CTA link, matching the card, at the bottom
      if (link && link.href) {
        const cta = document.createElement('a');
        cta.href = link.href;
        // The CTA link text is the same as the card title
        if (h2 && h2.textContent) {
          cta.textContent = h2.textContent;
        } else {
          cta.textContent = link.textContent.trim();
        }
        textCell.appendChild(cta);
      }
      // As a fallback, if textCell is empty, use any text under .content or link
      if (!textCell.childNodes.length) {
        let fallbackText = '';
        if (contentDiv && contentDiv.textContent.trim()) fallbackText = contentDiv.textContent.trim();
        else if (link && link.textContent.trim()) fallbackText = link.textContent.trim();
        if (fallbackText) {
          const p = document.createElement('p');
          p.textContent = fallbackText;
          textCell.appendChild(p);
        }
      }
      rows.push([
        img,
        textCell
      ]);
    });
  }
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

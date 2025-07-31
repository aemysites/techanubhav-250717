/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match exactly
  const headerRow = ['Cards (cards14)'];
  const cells = [headerRow];

  // Select all card sections
  const cardSections = element.querySelectorAll('section.cm-content-tile');
  cardSections.forEach(section => {
    // Image: only the <img> element
    let imgEl = section.querySelector('.image img');

    // Content block
    const contentDiv = section.querySelector('.content');
    const contentItems = [];

    // Heading (if present)
    const heading = contentDiv.querySelector('.header');
    if (heading) contentItems.push(heading);

    // All <p> except .subheading and CTA
    const paragraphs = Array.from(contentDiv.querySelectorAll('p'));
    // The CTA is always a paragraph whose only child is a link
    const normalParagraphs = paragraphs.filter(p => {
      if (p.classList.contains('subheading')) return false;
      // If the paragraph's only non-whitespace child is a link, treat as CTA
      const textNodes = Array.from(p.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim() !== '');
      const aNodes = p.querySelectorAll('a');
      if (aNodes.length === 1 && p.childNodes.length === 1 && p.firstElementChild === aNodes[0]) {
        // CTA, skip for now
        return false;
      }
      return true;
    });
    normalParagraphs.forEach(p => contentItems.push(p));

    // CTA paragraph if present
    const ctaPara = paragraphs.find(p => {
      if (p.classList.contains('subheading')) return false;
      const aNodes = p.querySelectorAll('a');
      return (aNodes.length === 1 && p.childNodes.length === 1 && p.firstElementChild === aNodes[0]);
    });
    if (ctaPara) contentItems.push(ctaPara);

    // Always reference existing elements, not clones or new
    cells.push([imgEl, contentItems]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

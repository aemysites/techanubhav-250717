/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches EXACTLY
  const headerRow = ['Cards (cards14)'];
  const cells = [headerRow];

  // Find all card sections
  const cardSections = element.querySelectorAll('section.cm-content-tile');
  cardSections.forEach((section) => {
    // --- IMAGE COLUMN ---
    let img = null;
    const imgEl = section.querySelector('.image img');
    if (imgEl) {
      img = imgEl;
    }
    // --- TEXT COLUMN ---
    // Use the actual existing elements for semantic content
    const contentDiv = section.querySelector('.content');
    const contentFrag = document.createElement('div');

    // Heading (b inside h3, or h3 itself)
    const h3 = contentDiv.querySelector('h3');
    if (h3) {
      let heading = null;
      const b = h3.querySelector('b');
      if (b) {
        heading = document.createElement('strong');
        heading.textContent = b.textContent;
      } else {
        heading = document.createElement('strong');
        heading.textContent = h3.textContent;
      }
      contentFrag.appendChild(heading);
    }
    // All <p> that are not .subheading (ignore those)
    const ps = Array.from(contentDiv.querySelectorAll('p')).filter(p => !p.classList.contains('subheading'));
    // Remove empty paragraphs
    const filteredPs = ps.filter(p => p.textContent.trim().length > 0);

    // If the last has an <a>, treat as CTA, else no CTA
    let ctaP = null;
    if (filteredPs.length && filteredPs[filteredPs.length - 1].querySelector('a')) {
      ctaP = filteredPs.pop();
    }
    // Add description <p>s
    filteredPs.forEach(p => {
      contentFrag.appendChild(p);
    });
    // CTA
    if (ctaP) {
      // Only append the <a>, not the paragraph
      const ctaA = ctaP.querySelector('a');
      if (ctaA) {
        const p = document.createElement('p');
        p.appendChild(ctaA);
        contentFrag.appendChild(p);
      }
    }
    cells.push([img, contentFrag]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

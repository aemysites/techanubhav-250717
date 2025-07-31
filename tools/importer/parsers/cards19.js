/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards19) block header
  const headerRow = ['Cards (cards19)'];
  const cells = [headerRow];

  // Find all .cm-content-tile sections inside the element (these are the cards)
  const cardSections = element.querySelectorAll('.cm-content-tile');

  cardSections.forEach((section) => {
    // Get image (should be in .image > a > img)
    let imageCell = null;
    const imageAnchor = section.querySelector('.image a');
    if (imageAnchor && imageAnchor.querySelector('img')) {
      imageCell = imageAnchor.querySelector('img');
    }

    // Get content area
    const contentDiv = section.querySelector('.content');
    const contentFragments = [];
    if (contentDiv) {
      // Title (h3.header)
      const title = contentDiv.querySelector('h3');
      if (title) contentFragments.push(title);
      // Description (all <p> that are not .subheading and do not contain a CTA)
      const paragraphs = contentDiv.querySelectorAll('p');
      paragraphs.forEach((p) => {
        if (!p.classList.contains('subheading') && !p.querySelector('.cta')) {
          // Only push paragraph if it has visible text
          if (p.textContent && p.textContent.trim().length > 0) {
            contentFragments.push(p);
          }
        }
      });
      // CTA (a) - only if it is a direct child of contentDiv (should be the 'Learn more' link)
      const cta = Array.from(contentDiv.querySelectorAll('a')).find(a => a.querySelector('.cta'));
      if (cta) contentFragments.push(cta);
    }

    // Handle case where content is empty (should not happen, but be defensive)
    if (imageCell || contentFragments.length > 0) {
      cells.push([
        imageCell,
        contentFragments.length === 1 ? contentFragments[0] : contentFragments
      ]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

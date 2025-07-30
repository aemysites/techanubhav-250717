/* global WebImporter */
export default function parse(element, { document }) {
  // Find the column list: nav > ul.nav-footer > li (3 columns)
  const navList = element.querySelector('ul.nav-footer');
  if (!navList) return;
  const colLis = Array.from(navList.children);
  // For each column, extract heading and links as in the screenshot
  const columns = colLis.map(colLi => {
    // Create a container for all content in this column
    const colContent = document.createElement('div');
    // Heading (the <span> at top, usually all uppercase)
    const headingEl = colLi.querySelector(':scope > span');
    if (headingEl) {
      // Use <strong> for heading to match clear column label
      const heading = document.createElement('strong');
      heading.textContent = headingEl.textContent.trim();
      colContent.appendChild(heading);
      colContent.appendChild(document.createElement('br'));
    }
    // List of links (may be plain text or icons)
    const linksUl = colLi.querySelector(':scope > ul');
    if (linksUl) {
      const linkLis = Array.from(linksUl.querySelectorAll(':scope > li'));
      linkLis.forEach(li => {
        const a = li.querySelector('a');
        if (a) {
          // Get text for standard links, or for social icons use icon name
          let linkText = a.textContent.trim();
          if (!linkText && a.querySelector('svg title')) {
            linkText = a.querySelector('svg title').textContent.trim();
          }
          // If still no text, use fallback for vblog icon
          if (!linkText && a.querySelector('svg')) {
            // fallback for vblog (no <title>)
            if (a.className.includes('vblog') || (a.querySelector('span.icon') && a.querySelector('span.icon').className.includes('vblog'))) {
              linkText = 'vblog';
            }
          }
          // Only add link if there is text
          if (linkText) {
            // Reference the existing <a> element and update text if needed
            // Remove SVGs for social icons (just text link)
            const aCopy = a.cloneNode(true);
            Array.from(aCopy.querySelectorAll('svg')).forEach(svg => svg.remove());
            aCopy.textContent = linkText;
            // Remove empty target attributes
            if (aCopy.hasAttribute('target') && !aCopy.getAttribute('target')) {
              aCopy.removeAttribute('target');
            }
            colContent.appendChild(aCopy);
            colContent.appendChild(document.createElement('br'));
          }
        }
      });
    }
    return colContent;
  });
  // Table header must match example
  const cells = [
    ['Columns (columns5)'],
    columns
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

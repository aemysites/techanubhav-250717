/* global WebImporter */
export default function parse(element, { document }) {
  // Get the root UL with columns
  const ul = element.querySelector('ul.nav-footer');
  if (!ul) return;
  // Each immediate LI is a column
  const columns = Array.from(ul.children);

  // Compose content for each column
  const columnCells = columns.map((li) => {
    // We use a div wrapper to collect the column content
    const div = document.createElement('div');
    // Add the heading if present
    const headingSpan = li.querySelector(':scope > span');
    if (headingSpan) {
      // Use a <strong> for the heading to visually separate
      const strong = document.createElement('strong');
      strong.textContent = headingSpan.textContent;
      div.appendChild(strong);
      div.appendChild(document.createElement('br'));
    }
    // Add the list (if any)
    const innerUl = li.querySelector(':scope > ul');
    if (innerUl) {
      // Social icons (3rd column): treat as icons row, others as normal list
      if (li.classList.contains('nav-footer-social')) {
        // For social icons, add each as a link with deduced label
        Array.from(innerUl.querySelectorAll('a')).forEach((a) => {
          // Try to deduce a label for the social link
          let text = a.getAttribute('aria-label') || a.title || '';
          if (!text) {
            // Try <title> from the SVG
            const svg = a.querySelector('svg');
            if (svg && svg.querySelector('title')) {
              text = svg.querySelector('title').textContent.trim();
            } else if (svg) {
              // Use class as fallback (e.g., svg-social-facebook-white)
              const span = a.querySelector('span');
              if (span && span.className.match(/svg-social-(\w+)-white/)) {
                text = span.className.match(/svg-social-(\w+)-white/)[1];
                text = text.charAt(0).toUpperCase() + text.slice(1);
              }
            }
          }
          // If still not found, fallback to URL domain
          if (!text) {
            try {
              const u = new URL(a.href, document.baseURI);
              text = u.hostname.replace(/^www\./, '').split('.')[0];
              text = text.charAt(0).toUpperCase() + text.slice(1);
            } catch (e) {
              text = 'Link';
            }
          }
          // Reference the existing <a> but strip its content and set only textContent
          a = a; // reference, not clone
          // Remove all children (SVGs, spans)
          while (a.firstChild) a.removeChild(a.firstChild);
          a.textContent = text;
          div.appendChild(a);
          div.appendChild(document.createTextNode(' '));
        });
      } else {
        // For normal columns, just add the links as a ul
        // Reference the existing innerUl directly, but remove li wrappers and keep <a> only
        const outUl = document.createElement('ul');
        Array.from(innerUl.querySelectorAll('li')).forEach((nestedLi) => {
          const a = nestedLi.querySelector('a');
          if (a) {
            const liElem = document.createElement('li');
            liElem.appendChild(a); // reference, not clone
            outUl.appendChild(liElem);
          }
        });
        div.appendChild(outUl);
      }
    }
    return div;
  });

  const headerRow = ['Columns (columns11)'];
  const tableRows = [ headerRow, columnCells ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  // Get all card columns (each has two cards)
  const columns = element.querySelectorAll(':scope > div > div.sl-list > div.sl-item');
  columns.forEach(col => {
    const sections = col.querySelectorAll('section.cm-content-tile');
    sections.forEach(section => {
      // Get image (mandatory)
      const img = section.querySelector('.image img');
      // If no image, skip (per block guidelines, image is mandatory)
      if (!img) return;
      // Gather text content
      const content = section.querySelector('.content');
      const textCell = document.createElement('div');

      // Title (h3, optional)
      const h3 = content.querySelector('h3');
      if (h3) textCell.appendChild(h3);
      // Description(s): all non-empty <p> that don't contain links
      const ps = Array.from(content.querySelectorAll('p'));
      ps.forEach((p, idx) => {
        // skip empty ps
        if (!p.textContent.trim()) return;
        // if contains a link, treat as CTA
        if (p.querySelector('a')) return;
        textCell.appendChild(p);
      });
      // CTA (the <p> with <a> inside)
      const cta = ps.find(p => p.querySelector('a'));
      if (cta) textCell.appendChild(cta);

      rows.push([
        img,
        textCell
      ]);
    });
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

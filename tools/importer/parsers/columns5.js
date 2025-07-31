/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main footer list
  const ul = element.querySelector('ul.nav-footer');
  if (!ul) return;
  const columns = Array.from(ul.children).filter(li => li.nodeType === 1);

  // Defensive: If fewer than 3 columns, fill with empty column(s)
  while (columns.length < 3) columns.push(undefined);

  // First cell: combines the content from the first two columns (VIRGIN MONEY AUSTRALIA and HELP & SUPPORT)
  const leftColContent = [];
  for (let i = 0; i < 2; i++) {
    if (!columns[i]) continue;
    const heading = columns[i].querySelector('span');
    if (heading) {
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      leftColContent.push(strong);
    }
    const linksList = columns[i].querySelector('ul');
    if (linksList) {
      const ulElem = document.createElement('ul');
      Array.from(linksList.querySelectorAll('a')).forEach(a => {
        const liElem = document.createElement('li');
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.textContent = a.textContent.trim();
        liElem.appendChild(link);
        ulElem.appendChild(liElem);
      });
      leftColContent.push(ulElem);
    }
  }

  // Second cell: Social icons/heading (Connect With Us)
  const rightColContent = [];
  const socialCol = columns[2];
  if (socialCol) {
    const heading = socialCol.querySelector('span');
    if (heading) {
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      rightColContent.push(strong);
    }
    const socialUl = socialCol.querySelector('ul');
    if (socialUl) {
      Array.from(socialUl.querySelectorAll('a')).forEach(a => {
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.target = a.getAttribute('target');
        const icon = a.querySelector('svg');
        if (icon) {
          link.appendChild(icon.cloneNode(true));
        } else {
          link.textContent = a.textContent.trim();
        }
        rightColContent.push(link);
      });
    }
  }

  // Build table: header row, then single row with 2 columns
  const headerRow = ['Columns (columns5)'];
  const contentRow = [leftColContent, rightColContent];

  const table = [headerRow, contentRow];

  // Create the block with the proper structure
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}

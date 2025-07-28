/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab menu
  const menu = element.querySelector('[role="tablist"]');
  const tabLinks = menu ? Array.from(menu.querySelectorAll('a[role="tab"]')) : [];

  // Extract labels as strings
  const tabLabels = tabLinks.map(link => {
    // Try to get the text from a nested div (for e.g. <div>Trends</div>)
    const labelDiv = link.querySelector('div');
    return labelDiv ? labelDiv.textContent.trim() : link.textContent.trim();
  });

  // Find tab panes (content)
  const contentContainer = element.querySelector('.w-tab-content');
  const tabPanes = contentContainer ? Array.from(contentContainer.children) : [];

  // Helper to get primary content of a tab pane (prefer .grid-layout as main container)
  function getTabContent(pane) {
    if (!pane) return document.createElement('div');
    const grid = pane.querySelector('.grid-layout');
    return grid ? grid : pane;
  }

  // Build rows: 1 header, then each tab (label, content)
  const rows = [['Tabs']];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Reference original element for content
    const pane = tabPanes[i];
    const content = getTabContent(pane);
    rows.push([label, content]);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

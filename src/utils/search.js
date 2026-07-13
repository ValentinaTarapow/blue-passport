/**
 * Build flat select options with indentation for child categories.
 */
export function buildCategoryOptions(categories = []) {
  const parents = categories
    .filter((category) => !category.parent)
    .sort((a, b) => a.name.localeCompare(b.name));

  return parents.flatMap((parent) => {
    const children = categories
      .filter((category) => category.parent === parent.id)
      .sort((a, b) => a.name.localeCompare(b.name));

    return [
      { id: parent.id, label: parent.name },
      ...children.map((child) => ({
        id: child.id,
        label: `— ${child.name}`,
      })),
    ];
  });
}

/**
 * Checkbox options for specialty multi-select (same taxonomy as directory filter).
 */
export function buildCategoryCheckboxOptions(categories = []) {
  const parents = categories
    .filter((category) => !category.parent)
    .sort((a, b) => a.name.localeCompare(b.name));

  return parents.flatMap((parent) => {
    const children = categories
      .filter((category) => category.parent === parent.id)
      .sort((a, b) => a.name.localeCompare(b.name));

    return [
      { id: parent.id, label: parent.name, isChild: false },
      ...children.map((child) => ({
        id: child.id,
        label: child.name,
        isChild: true,
      })),
    ];
  });
}

/**
 * Resolve stored category IDs to display labels.
 */
export function resolveCategoryLabels(categoryIds = [], categories = []) {
  if (!categoryIds?.length) return '';

  return categoryIds
    .map((id) => categories.find((category) => category.id === Number(id))?.name)
    .filter(Boolean)
    .join(', ');
}

/**
 * Filter checkbox options by search term (keeps parent when child matches, and vice versa).
 */
export function filterCategoryCheckboxOptions(options = [], categories = [], query = '') {
  const term = query.trim().toLowerCase();
  if (!term) return options;

  const visible = new Set();

  for (const option of options) {
    if (!option.label.toLowerCase().includes(term)) continue;

    visible.add(option.id);

    if (option.isChild) {
      const category = categories.find((item) => item.id === option.id);
      if (category?.parent) visible.add(category.parent);
    } else {
      options
        .filter(
          (item) =>
            item.isChild && categories.find((cat) => cat.id === item.id)?.parent === option.id,
        )
        .forEach((child) => visible.add(child.id));
    }
  }

  return options.filter((option) => visible.has(option.id));
}

/**
 * Toggle a category in a multi-select, keeping parent/child relationships in sync.
 * - Selecting a child also selects its parent.
 * - Deselecting a parent removes all its children.
 * - Deselecting a child removes the parent when no siblings remain selected.
 */
export function toggleCategoryIds(categoryIds = [], categoryId, categories = []) {
  const id = Number(categoryId);
  const category = categories.find((item) => item.id === id);
  if (!category) return categoryIds;

  const next = new Set(categoryIds.map(Number));
  const isSelected = next.has(id);

  if (isSelected) {
    next.delete(id);

    if (!category.parent) {
      categories
        .filter((item) => item.parent === id)
        .forEach((child) => next.delete(child.id));
    } else {
      const siblings = categories.filter((item) => item.parent === category.parent);
      const hasSelectedSibling = siblings.some(
        (sibling) => sibling.id !== id && next.has(sibling.id),
      );
      if (!hasSelectedSibling) next.delete(category.parent);
    }
  } else {
    next.add(id);
    if (category.parent) next.add(category.parent);
  }

  return [...next];
}

/**
 * Build search params object for the professionals API.
 */
export function buildProfessionalSearchParams({ query, categoryId, locationId }) {
  return {
    ...(query?.trim() ? { search: query.trim() } : {}),
    ...(categoryId ? { categoryId: Number(categoryId) } : {}),
    ...(locationId ? { locationId: Number(locationId) } : {}),
  };
}

import { INITIAL_CHARITIES } from '@/constants/charities';

/**
 * Searches and filters charities by category and search query
 * @param {Array} charities - List of charities
 * @param {Object} filters
 * @param {string} [filters.category] - Filter category
 * @param {string} [filters.search] - Search text for name/description/mission
 * @returns {Array} Filtered list
 */
export function filterCharities(charities = INITIAL_CHARITIES, { category = 'All Categories', search = '' } = {}) {
  return charities.filter((charity) => {
    const matchesCategory =
      !category || category === 'All Categories' || charity.category.toLowerCase() === category.toLowerCase();

    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      charity.name.toLowerCase().includes(query) ||
      charity.description.toLowerCase().includes(query) ||
      charity.missionStatement.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });
}

/**
 * @export
 * @param payload
 * @param pages
 * @param currentPage
 * @return {boolean}
 */
export async function isCurrentPage({payload, pages, currentPage}) {
  const {idx} = payload;
  const _currentPage = pages[idx];

  if (typeof idx === 'undefined' || !_currentPage || !currentPage) {
    return false;
  }

  return _currentPage.entityForm.entityKey === currentPage.entityForm.entityKey;
}

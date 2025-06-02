const selectors = {
  breadcrumb: {
    ariaLabel: { name: /^breadcrumb$/i },
    blockId: 'page-description'
  },
  filters: {
    search: { blockId: 'search-filter' },
    status: { blockId: 'status-filter' },
    entities: { blockId: 'entities-filter' },
    roles: { blockId: 'roles-filter' },
    directUsers: { blockId: 'direct-users-switch-filter' }
  }
}

export { selectors }

const selectors = {
  breadcrumb: {
    ariaLabel: { name: /^breadcrumb$/i },
    blockId: 'page-description'
  },
  fields: {
    name: /^Name$/i,
    description: /^Description$/i,
    type: /^Type$/i,
    website: /^Website$/i,
    search: /Search/i,
    email: /^Email$/i,
    firstName: /^First name$/i,
    lastName: /^Last name$/i,
    errors: {
      required: /^This field is required$/i,
      minLength: /^This field does not meet the minimum length requirements$/i,
      maxLength: /^This field exceeds the maximum length requirements$/i
    }
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

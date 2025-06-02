/**
 * Testing Data
 */
const testData = {
  accountId: 'acc-123e4567-e89b-12d3-a456-426614174000',
  entityId: 'ent-123e4567-e89b-12d3-a456-426614174000',
  userId: '123e4567-e89b-12d3-a456-426614174000',
  userEmail: 'john.doe@example.com',
  userFirstName: 'John',
  userLastName: 'Doe',
  entityName: 'Test Entity',
  entityDescription: 'Test entity description',
  organizationName: 'Test Organization',
  organizationType: 'COMPANY',
  roleName: 'Admin',
  roleId: 1
}

const testApi = {
  interceptorURL: `**/accounts/${testData.accountId}`,
  account: {
    URL: `**/accounts/${testData.accountId}`,
    success: {
      status: 200,
      body: {
        id: testData.accountId,
        name: 'Main account',
        description: 'Default account for testing',
        isActive: true,
        createdAt: '2025-05-28T10:31:59.149Z',
        updatedAt: '2025-05-28T10:31:59.149Z',
        users: {
          count: 2,
          values: [
            {
              id: 'cmb7taa5t000at8d3i0qb02yk',
              email: 'john.doe@example.com',
              isActive: true,
              people: {
                id: 'cmb7tgi78000ft8d3t37q372n',
                firstname: 'John',
                lastname: 'Doe'
              },
              roles: [
                {
                  id: 2,
                  name: 'user'
                }
              ],
              entities: [
                {
                  id: 'cmb7t9c0r0009t8d34rv4aglj',
                  name: 'Couv-Gachet',
                  organization: {
                    id: 'cmb7t9bkc0007t8d32c6kaohe',
                    name: 'Diamondforge'
                  }
                }
              ],
              isDirectlyLinked: false,
              createdAt: '2025-05-28T10:37:47.633Z',
              updatedAt: '2025-05-28T10:42:38.038Z'
            },
            {
              id: 'cmb7t0stt0000t8d38o1h89l4',
              email: 'bill.mate@diamondforge.fr',
              isActive: true,
              people: {
                id: 'cmb7t2t8k0003t8d33vzj1rj2',
                firstname: 'Bill',
                lastname: 'Mate'
              },
              roles: [
                {
                  id: 3,
                  name: 'admin'
                }
              ],
              entities: [],
              isDirectlyLinked: true,
              createdAt: '2025-05-28T10:30:25.266Z',
              updatedAt: '2025-05-30T17:06:29.351Z'
            }
          ]
        },
        entities: {
          count: 1,
          values: [
            {
              id: 'cmb7t9c0r0009t8d34rv4aglj',
              name: 'Couv-Gachet',
              description: 'Promo 12/2024',
              isActive: true,
              organization: {
                id: 'cmb7t9bkc0007t8d32c6kaohe',
                name: 'Diamondforge'
              },
              createdAt: '2025-05-28T10:37:03.387Z',
              updatedAt: '2025-05-28T10:37:03.387Z'
            }
          ]
        },
        roles: {
          count: 3,
          values: [
            {
              id: 1,
              name: 'guest',
              description: 'Non-authenticated user',
              isActive: true,
              isGlobal: true,
              createdAt: '2025-05-28T10:29:45.435Z',
              updatedAt: '2025-05-28T10:29:45.435Z'
            },
            {
              id: 2,
              name: 'user',
              description: 'Basic authenticated user',
              isActive: true,
              isGlobal: true,
              createdAt: '2025-05-28T10:29:45.435Z',
              updatedAt: '2025-05-28T10:29:45.435Z'
            },
            {
              id: 3,
              name: 'admin',
              description: 'Administrator user',
              isActive: true,
              isGlobal: true,
              createdAt: '2025-05-28T10:29:45.435Z',
              updatedAt: '2025-05-28T10:29:45.435Z'
            }
          ]
        }
      }
    }
  },
  entities: {
    URL: `**/accounts/${testData.accountId}/entities`,
    success: {
      status: 200,
      body: {
        items: [
          {
            id: testData.entityId,
            name: testData.entityName,
            description: testData.entityDescription,
            isActive: true,
            organization: {
              id: 'org-123',
              name: testData.organizationName
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        meta: {
          pagination: {
            current: 1,
            limit: 10,
            total: 1
          },
          count: 1
        }
      }
    }
  },
  users: {
    URL: `**/accounts/${testData.accountId}/users`,
    success: {
      status: 200,
      body: {
        items: [
          {
            id: 'cmb7taa5t000at8d3i0qb02yk',
            email: 'john.doe@example.com',
            isActive: true,
            people: {
              id: 'cmb7tgi78000ft8d3t37q372n',
              firstname: 'John',
              lastname: 'Doe'
            },
            roles: [
              {
                id: 2,
                name: 'user'
              }
            ],
            entities: [
              {
                id: 'cmb7t9c0r0009t8d34rv4aglj',
                name: 'Couv-Gachet',
                organization: {
                  id: 'cmb7t9bkc0007t8d32c6kaohe',
                  name: 'Diamondforge'
                }
              }
            ],
            isDirectlyLinked: false,
            createdAt: '2025-05-28T10:37:47.633Z',
            updatedAt: '2025-05-28T10:42:38.038Z'
          },
          {
            id: 'cmb7t0stt0000t8d38o1h89l4',
            email: 'bill.mate@diamondforge.fr',
            isActive: true,
            people: {
              id: 'cmb7t2t8k0003t8d33vzj1rj2',
              firstname: 'Bill',
              lastname: 'Mate'
            },
            roles: [
              {
                id: 3,
                name: 'admin'
              }
            ],
            entities: [],
            isDirectlyLinked: true,
            createdAt: '2025-05-28T10:30:25.266Z',
            updatedAt: '2025-05-30T17:06:29.351Z'
          }
        ],
        meta: {
          pagination: {
            current: 1,
            limit: 10,
            total: 1
          },
          count: 2
        }
      }
    }
  },
  roles: {
    URL: `**/accounts/${testData.accountId}/roles`,
    success: {
      status: 200,
      body: {
        items: [
          {
            id: 1,
            name: 'guest',
            description: 'Non-authenticated user',
            isActive: true,
            isGlobal: true,
            createdAt: '2025-05-28T10:29:45.435Z',
            updatedAt: '2025-05-28T10:29:45.435Z'
          },
          {
            id: 2,
            name: 'user',
            description: 'Basic authenticated user',
            isActive: true,
            isGlobal: true,
            createdAt: '2025-05-28T10:29:45.435Z',
            updatedAt: '2025-05-28T10:29:45.435Z'
          },
          {
            id: 3,
            name: 'admin',
            description: 'Administrator user',
            isActive: true,
            isGlobal: true,
            createdAt: '2025-05-28T10:29:45.435Z',
            updatedAt: '2025-05-28T10:29:45.435Z'
          }
        ],
        meta: {
          pagination: {
            current: 1,
            limit: 10,
            total: 1
          },
          count: 3
        }
      }
    }
  },
  invitations: {
    URL: `**/invitations`,
    success: {
      status: 200,
      bodyEmpty: {
        invitations: []
      },
      body: {
        invitations: [
          {
            id: 'cmb7taak1000et8d3ymbkop9v',
            inviterUserId: 'cmb7t0stt0000t8d38o1h89l4',
            inviteeUserId: 'cmb7taa5t000at8d3i0qb02yk',
            inviteeUserEmail: 'bruce.wayne@.com',
            status: 'PENDING',
            invitedAt: '2025-05-28T10:37:48.146Z',
            acceptedAt: null,
            accounts: [],
            entities: [
              {
                id: 'cmb7t9c0r0009t8d34rv4aglj',
                name: 'Couv-Gachet'
              }
            ],
            roles: [
              {
                id: 2,
                name: 'user'
              }
            ]
          }
        ]
      }
    }
  },
  inviteUser: {
    URL: `**/accounts/${testData.accountId}/invite-user`,
    success: {
      status: 200,
      body: { message: 'User invitation sent successfully' }
    },
    error: {
      status: 400,
      body: { message: 'User already exists or invalid data' }
    }
  }
}

/**
 * Flow Object Selectors - Updated with real translations
 */
const selectors = {
  URL: '/account',
  sectionTabs: {
    overview: { name: /^OVERVIEW$/i },
    entities: { name: /^ENTITIES$/i },
    users: { name: /^USERS$/i }
  },
  accountManagement: {
    URL: '/account/management',
    title: { name: /account management/i },
    sections: {
      settings: { name: /account settings/i },
      billing: { name: /billing/i },
      security: { name: /security/i }
    }
  },
  accountOverview: {
    successURL: /.*\/account\?tab=overview/,
    title: { name: /overview/i },
    accountInfo: {
      blockId: 'account-info-section',
      title: /account information/i,
      subtitle: /View and manage your account details/i
    },
    statisticsCards: {
      blockId: 'statistics-section',
      title: /Statistics/i,
      subtitle: /Overview of your account resources/i,
      users: {
        ariaLabel: { name: /Users-count/i },
        label: 'Users'
      },
      entities: {
        ariaLabel: { name: /Entities-count/i },
        label: 'Entities'
      },
      roles: {
        ariaLabel: { name: /Roles-count/i },
        label: 'Roles'
      }
    },
    recentUsers: {
      blockId: 'recent-users-section',
      title: /^Recent Users$/i,
      subtitle: /^The 5 most recent users created or added$/i,
      cta: {
        viewAll: { name: /^View all users$/i }
      }
    },
    recentEntities: {
      blockId: 'recent-entities-section',
      title: /^Recent Entities$/i,
      subtitle: /^The 5 most recent entities created$/i,
      cta: {
        viewAll: { name: /^View all entities$/i }
      }
    },
    recentRoles: {
      blockId: 'recent-roles-section',
      title: /^Recent Roles$/i,
      subtitle: /^The 5 most recent roles created$/i
    }
  },
  accountEntities: {
    successURL: /.*\/account\?tab=entities/,
    title: { name: /account entities/i },
    cta: {
      createEntity: { name: /^New entity$/i }
    },
    table: {
      headers: {
        entity: { name: /^Entities$/i },
        status: { name: /^Status$/i },
        organization: { name: /^Organizations$/i },
        createdAt: { name: /^Created at$/i }
      }
    }
  },
  accountUsers: {
    successURL: /.*\/account\?tab=users/,
    title: { name: /account users/i },
    cta: {
      inviteUser: { name: /^Invite user$/i }
    },
    table: {
      headers: {
        user: { name: /^Users$/i },
        status: { name: /^Status$/i },
        entities: { name: /^Entities$/i },
        roles: { name: /^Roles$/i },
        createdAt: { name: /^Created at$/i }
      }
    }
  },

  fields: {
    search: /search/i,
    name: /name/i,
    description: /description/i,
    email: /email/i,
    firstName: /first name/i,
    lastName: /last name/i,
    type: /type/i,
    status: /status/i
  },

  errors: {
    requiredName: /name is required/i,
    requiredEmail: /email is required/i,
    invalidEmail: /email is invalid/i,
    requiredFirstName: /first name is required/i,
    requiredLastName: /last name is required/i,
    userAlreadyExists: /user already exists/i,
    entityCreationFailed: /failed to create entity/i,
    invitationFailed: /failed to send invitation/i
  },

  success: {
    userInvited: /user invitation sent successfully/i,
    entityCreated: /entity created successfully/i,
    accountUpdated: /account updated successfully/i
  }
}

export { selectors, testApi, testData }

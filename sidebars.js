// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Platform Newcomer\'s Guide',
      items: [
        'newcomers-guide/getting-started',
        'newcomers-guide/projects',
        'newcomers-guide/applications',
        'newcomers-guide/services',
        'newcomers-guide/uploading-to-gdn',
      ],
    },
    {
      type: 'category',
      label: 'Dev Portal',
      link: {
        type: 'doc',
        id: 'dev-portal/getting-started',
      },
      items: [
        'dev-portal/getting-started',
        {
          type: 'category',
          label: 'Gui Description',
          items: [
            'dev-portal/gui/configs-management',
            'dev-portal/gui/leaderboard',
            'dev-portal/gui/user-management',
            'dev-portal/gui/services-info',
            'dev-portal/gui/console',
          ],
        },
        {
          type: 'category',
          label: 'Configs format',
          items: [
            'dev-portal/configs-format/tables-config-format',
            'dev-portal/configs-format/modes-config-format',
            'dev-portal/configs-format/stats-config-format',
            'dev-portal/configs-format/unlocks-config-format',
            'dev-portal/configs-format/contacts-config-format',
            'dev-portal/configs-format/profile-config-format',
          ],
        },
        {
          type: 'category',
          label: 'Services API',
          items: [
            'dev-portal/services-api/userstat-api',
            'dev-portal/services-api/leaderboard-api',
            'dev-portal/services-api/contacts-api',
          ],
        },
      ]
    },
    {
      type: 'category',
      label: 'Central',
      items: [
        'central/getting-started',
        {
          type: 'category',
          label: 'Project',
          link: {
            type: 'doc',
            id: 'central/project',
          },
          items: [
            'central/project-administrators',
            'central/project-service-accounts',
          ],
        },
        {
          type: 'category',
          label: 'Application',
          link: {
            type: 'doc',
            id: 'central/applications',
          },
          items: [
            'central/application-schema',
            'central/application-users',
            'central/application-api-keys',
          ],
        },
        'central/services',
        'central/user-profile',
        'central/logging',
      ],
    },
    'how-to-contribute',
    {
      type: 'link',
      label: 'Toolset Download',
      href: 'https://github.com/GaijinEntertainment/GaijinApplicationPlatform/releases',
    }
  ],
};

module.exports = sidebars;

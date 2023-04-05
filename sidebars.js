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
      items: [
        'dev-portal/gui-description',
        'dev-portal/stats-config-format',
        'dev-portal/unlocks-config-format',
        'dev-portal/userstat-api',
        'dev-portal/leaderboard-api',
        'dev-portal/contacts-api',
      ],
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

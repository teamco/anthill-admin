export const routes = [
  {
    exact: false,
    path: '/',
    component: '@/layouts/app.layout',
    routes: [
      {
        exact: true,
        path: '/accounts',
        component: '@/pages/users',
        wrappers: [
          '@/wrappers/auth.wrapper'
        ]
      },
      {
        exact: true,
        path: '/accounts/:user',
        component: '@/pages/users/[user]/profile',
        wrappers: [
          '@/wrappers/auth.wrapper'
        ]
      },
      // {
      //   exact: true,
      //   path: '/users/:user/websites',
      //   component: '@/pages/users/[user]/websites',
      //   breadcrumb: 'route:websites',
      //   wrappers: [
      //     '@/wrappers/auth.wrapper'
      //   ]
      // },
      // {
      //   exact: true,
      //   path: '/users/:user/websites/:website',
      //   component: '@/pages/users/[user]/websites/[website]/website.edit',
      //   breadcrumb: 'route:website',
      //   wrappers: [
      //     '@/wrappers/auth.wrapper'
      //   ]
      // },
      // {
      //   exact: true,
      //   path: '/users/:user/websites/:website/users',
      //   component: '@/pages/users/[user]/websites/[website]/users',
      //   breadcrumb: 'route:websiteUsers',
      //   wrappers: [
      //     '@/wrappers/auth.wrapper'
      //   ]
      // },
      {
        exact: true,
        path: '/websites',
        component: '@/pages/websites',
        wrappers: [
          '@/wrappers/auth.wrapper'
        ]
      },
      {
        exact: true,
        path: '/websites/:website',
        component: '@/pages/websites/[website]',
        wrappers: [
          '@/wrappers/auth.wrapper'
        ]
      },
      {
        exact: true,
        path: '/errors/403',
        component: '@/pages/403'
      },
      {
        component: '@/pages/404',
        breadcrumb: 'route:page404'
      }
    ]
  }
];

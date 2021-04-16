export const routes = [
  {
    exact: false,
    path: '/',
    component: '@/layouts/app.layout',
    routes: [
      {
        exact: true,
        path: '/users',
        component: '@/pages/users',
        breadcrumb: 'route:users',
        wrappers: [
          '@/wrappers/auth.wrapper'
        ]
      },
      {
        exact: true,
        path: '/users/:user',
        component: '@/pages/users/[user]/profile',
        breadcrumb: 'route:userProfile',
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
        breadcrumb: 'route:website',
        wrappers: [
          '@/wrappers/auth.wrapper'
        ]
      },
      {
        exact: true,
        path: '/websites/:website',
        component: '@/pages/websites/[website]',
        breadcrumb: 'route:website',
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

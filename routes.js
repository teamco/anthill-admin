export const routes = [
  {
    exact: false,
    path: '/',
    component: '@/layouts/app.layout',
    routes: [
      {
        exact: true,
        path: '/',
        component: '@/pages/home',
        wrappers: [
          '@/wrappers/auth.wrapper'
        ]
      },
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
      {
        exact: true,
        path: '/accounts/:user/websites',
        component: '@/pages/users/[user]/websites',
        wrappers: [
          '@/wrappers/auth.wrapper'
        ]
      },
      {
        exact: true,
        path: '/accounts/:user/widgets',
        component: '@/pages/users/[user]/widgets',
        wrappers: [
          '@/wrappers/auth.wrapper'
        ]
      },
      {
        exact: true,
        path: '/accounts/:user/websites/:website',
        component: '@/pages/users/[user]/websites/[website]',
        wrappers: [
          '@/wrappers/auth.wrapper'
        ]
      },
      {
        exact: true,
        path: '/accounts/:user/widgets/:widget',
        component: '@/pages/users/[user]/widgets/[widget]',
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

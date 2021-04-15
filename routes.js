export const routes = [
  {
    exact: false,
    path: '/',
    component: '@/layouts/app.layout',
    routes: [
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
        component: '@/pages/404',
        breadcrumb: 'route:page404'
      }
    ]
  }
];

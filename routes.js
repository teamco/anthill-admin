export const routes = [
  {
    exact: false,
    path: '/',
    component: '@/layouts/app.layout',
    routes: [
      {
        exact: true,
        path: '/websites',
        component: '@/pages/website',
      },
    ],
  },
];

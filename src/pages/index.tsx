export default [
  { path: '/', component: require('./_') },
  { path: '/room/:id', component: require('./room/_id') },
  {
    path: '/terms',
    component: require('./terms')
  },
  {
    path: '/privacy',
    component: require('./privacy')
  },
  {
    path: '/login',
    component: require('./login')
  }
] as Array<{ path: string; component: any }>

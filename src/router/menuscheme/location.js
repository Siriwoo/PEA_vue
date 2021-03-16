/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const location = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/equiptmentscheme/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/mapoverview',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/mapoverview/index'),
        name: 'mapoverview',
        meta: { title: 'แผนที่และสถานที่', icon: 'international', affix: true }
      }
    ]
  },
  {
    path: '/mapmanage',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/mapmanage/index'),
        name: 'mapmanage',
        meta: { title: 'จัดการสถานที่', icon: 'documentation', affix: true }
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export default location

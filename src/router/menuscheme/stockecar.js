/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layoutqr'

const stockecar = [
  {
    path: '/',
    component: Layout,
    redirect: '/mainqrcode',
    children: [
      {
        path: 'mainqrcode',
        component: () => import('@/views/qrcodescheme/dashboard/index'),
        name: 'mainqrcode',
        meta: { title: 'QR Scheme', icon: 'dashboard', affix: true }
      }
    ]
  }/*,
  {
    path: '/sublocation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/qrcodescheme/sublocation/index'),
        name: 'sublocation',
        meta: { title: 'จัดการคลัง/รถแก้ไฟ', icon: 'international', affix: true }
      }
    ]
  }*/,
  {
    path: '/qrprofile',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'qrprofile',
        meta: { title: 'Profile', icon: 'documentation', affix: true }
      }
    ]
  },
  {
    path: '/version',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/components/Timeline'),
        name: 'qrversion',
        meta: { title: 'Version', icon: 'international', affix: true }
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export default stockecar

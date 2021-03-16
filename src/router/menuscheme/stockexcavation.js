/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layoutstock'

const stockexcavation = [
  {
    path: '/',
    component: Layout,
    redirect: '/stockexcavation',
    children: [
      {
        path: 'stockexcavation',
        component: () => import('@/views/stockscheme/dashboard'),
        name: 'Stockexcavation',
        meta: { title: 'Stockexcavation', icon: 'dashboard', affix: true }
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export default stockexcavation

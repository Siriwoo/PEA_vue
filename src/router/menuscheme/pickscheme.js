/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const pickscheme = [
  {
    path: '/',
    component: Layout,
    redirect: '/pickscheme',
    children: [
      {
        path: 'pickscheme',
        component: () => import('@/views/pickscheme/index'),
        name: 'Pickscheme',
        meta: { title: 'Pickscheme', icon: 'chart', affix: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default pickscheme

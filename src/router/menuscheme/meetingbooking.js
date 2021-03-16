/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layoutbooking'

const meetingbooking = [
  {
    path: '/',
    component: Layout,
    redirect: '/meetingbooking',
    children: [
      {
        path: 'meetingbooking',
        component: () => import('@/views/bookingscheme/dashboard'),
        name: 'Meetingbooking',
        meta: { title: 'Meetingbooking', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/timeline',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'timeline',
        meta: { title: 'Timeline', icon: 'documentation', affix: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export default meetingbooking

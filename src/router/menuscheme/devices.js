/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const devices = [
  {
    path: '/',
    component: Layout,
    redirect: '/maindevices',
    children: [
      {
        path: 'maindevices',
        component: () => import('@/views/equiptmentscheme/dashboard/index'),
        name: 'Maindevices',
        meta: { title: 'ภาพรวมงาน', icon: 'chart', affix: true }
      }
    ]
  },
  {
    path: '/devicetype',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/equiptmentscheme/equiptmanage/index'),
        name: 'devicetype',
        meta: { title: 'ข้อมูลยี่ห้อ/รุ่น อุปกรณ์', icon: 'component', affix: true }
      }
    ]
  },
  {
    path: '/formreport',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/equiptmentscheme/formreport/index'),
        name: 'formreport',
        meta: { title: 'สร้างแบบฟอร์ม', icon: 'form', affix: true }
      }
    ]
  },
  {
    path: '/locationinfo',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/equiptmentscheme/locationinfo/index'),
        name: 'locationinfo',
        meta: { title: 'ข้อมูลสถานที่', icon: 'guide', affix: true }
      }
    ]
  }/*,
  {
    path: '/taginfo',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/taginfo/index'),
        name: 'taginfo',
        meta: { title: 'ข้อมูล tag เพื่อการค้นหา', icon: 'education', affix: true }
      }
    ]
  }*/,
  {
    path: '/deviceinfo',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/equiptmentscheme/deviceinfo/index'),
        name: 'deviceinfo',
        meta: { title: 'ข้อมูลอุปกรณ์', icon: 'documentation', affix: true }
      }
    ]
  },
  {
    path: '/historyreport',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/equiptmentscheme/historyreport/index'),
        name: 'historyreport',
        meta: { title: 'ทะเบียนประวัติ', icon: 'eye-open', affix: true }
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
  },/*
  {
    path: '/edit',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/device/index'),
        name: 'edit',
        meta: { title: 'รายงานปฏิบัติการ', icon: 'form', affix: true }
      }
    ]
  },*/


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export default devices

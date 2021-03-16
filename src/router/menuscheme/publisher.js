/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const publisher = [
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
    path: '/broadcast',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/broadcast/index'),
        name: 'Broadcast',
        meta: { title: 'Broadcast', icon: 'international', affix: true }
      }
    ]
  },
  {
    path: '/createpublisher',
    component: Layout,
    redirect: '/createpublisher/list',
    name: 'CreatePublisherm',
    meta: {
      title: 'Create Publisher',
      icon: 'edit'
    },
    children: [
      {
        path: 'fromfile',
        component: () => import('@/views/createpublisher/fromfile'),
        name: 'fromfile',
        meta: { title: 'From files', icon: 'edit' }
      },
      {
        path: 'create',
        component: () => import('@/views/createpublisher/create'),
        name: 'CreatePublisher',
        meta: { title: 'Create Publisher', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/createpublisher/edit'),
        name: 'EditArticle',
        meta: { title: 'Publisher Article', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/createpublisher/list'),
        name: 'ArticleList',
        meta: { title: 'Article List', icon: 'list' }
      }
    ]
  },
  {
    path: '/layoutprofile',
    component: Layout,
    redirect: '/layoutprofile/schedule-profile',
    alwaysShow: true, // will always show the root menu
    name: 'layoutprofile',
    meta: {
      title: 'Layout Profile',
      icon: 'component',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'schedule-profile',
        component: () => import('@/views/layoutprofile/schedule-profile'),
        name: 'ScheduleProfile',
        meta: {
          title: 'Schedule Layout',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'layout-profile',
        component: () => import('@/views/layoutprofile/layout-profile'),
        name: 'LayoutProfile',
        meta: {
          title: 'Layout Profile'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export default publisher

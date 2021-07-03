/** When your routing table is too long, you can split it into small modules**/
// eslint-disable-next-line
/* eslint-disable */
import Layout from '@/layoutassets'

const assets_management = [{

        path: '/',
        component: Layout,
        redirect: '/assets_management',
        children: [{
            path: 'assets_management',
            component: () =>
                import ('@/views/assetsscheme/assets_system/showassets'),
            name: 'Assets_Management',
            meta: { title: 'Assets Management', icon: 'component', affix: true }
        }]
    },
    {
        path: '/',
        component: Layout,
        children: [{
            path: 'assets_survey',
            component: () =>
                import ('@/views/assetsscheme/assets_system/assets_survey'),
            name: 'assets_survey',
            meta: { title: 'สำรวจทรัพย์สิน', icon: 'documentation', affix: true }
        }]
    },
    {
        path: '/',
        component: Layout,
        children: [{
            path: 'assets_database',
            component: () =>
                import ('@/views/assetsscheme/assets_system/database_update'),
            name: 'assets_database',
            meta: { title: 'ฐานข้อมูลของสินทรัพย์', icon: 'clipboard', affix: true }
        }]
    },
    {
        path: '/',
        component: Layout,
        children: [{
            path: 'asset_history',
            component: () =>
                import ('@/views/assetsscheme/assets_system/history'),
            name: 'asset_history',
            meta: { title: 'ประวัติการสำรวจ', icon: 'eye-open', affix: true }
        }]
    },


    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

export default assets_management
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
                import ('@/views/assetsscheme/dashboard'),
            name: 'Assets_Management',
            meta: { title: 'assets_management', icon: 'dashboard', affix: true }
        }]
    },


    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

export default assets_management
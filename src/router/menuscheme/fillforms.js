/** When your routing table is too long, you can split it into small modules**/
// eslint-disable-next-line
/* eslint-disable */
import Layout from '@/layoutff'

const fillforms = [{
        path: '/',
        component: Layout,
        redirect: '/fillforms',
        children: [{
            path: 'fillforms',
            component: () =>
                import ('@/views/fillformsscheme/dashboard'),
            name: 'fillForms',
            meta: { title: 'fillforms', icon: 'dashboard', affix: true }
        }]
    },


    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

export default fillforms
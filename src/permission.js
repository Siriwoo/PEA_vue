import router from '@/router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getUserData, getUserActivity } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
//console.log(store.getters);
const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
var routed = false
var routedp = false
router.beforeEach(async(to,from,next) => {
  NProgress.start()
  //console.log(to);
  document.title = getPageTitle(to.meta.title)
  console.log(document.title);
  //console.log(to);
    const hasToken = getToken()
    const useract = getUserActivity()
    //const userData = JSON.parse(getUserData())
    //console.log(hasToken);
    if(hasToken){
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        console.log('xxxxxxx1');
        next({ path: '/' })
        NProgress.done()
      } else {
        console.log('xxxxxxx2');
        if(routed){
          console.log('xxxxxxx3');
          next()
        }else{
          console.log('xxxxxxx4');
          if(useract){
            try{
              console.log('xxxxxxx5');
              //console.log('here be fore boom');
              var scheme = JSON.parse(getUserActivity())
              scheme = scheme.scheme
              console.log(scheme);
              const accessRoutes = await store.dispatch('permission/generateRoutesScheme', scheme)

              // dynamically add accessible routes
              router.addRoutes(accessRoutes)
              NProgress.done()
              routed = true

              //next(`/login?redirect=${to.path}`)
              next({ ...to, replace: true })
            } catch (error) {
              console.log('xxxxxxx6');
              // remove token and go to login page to re-login
              await store.dispatch('user/resetToken')
              Message.error(error || 'Has Error')
              next(`/login?redirect=${to.path}`)
              NProgress.done()
            }

          }else{

            console.log('xxxxxxx7');
            //ต้อง redirect ไปหน้า pick scheme
            const accessRoutes = await store.dispatch('permission/generateRoutesScheme', 'pickscheme')
            // dynamically add accessible routes
            router.addRoutes(accessRoutes)
            //console.log(routedp);
            if(routedp){
              console.log('xxxxxxx8');
              //console.log('second step');
              next()
            }else{
              console.log('xxxxxxx9');
              //console.log('go to pick scheme');
              //console.log('first step');
              //isstep9 = true
              routedp = true
              console.log(to.path);

              //next(to.path)
              next(`/pickscheme`)

            }

          }
        }


      }

    }else{
      if (whiteList.indexOf(to.path) !== -1) {
        console.log('xxxxxxx10');
        routedp = false
        routed = false
        // in the free login whitelist, go directly
        next()
      } else {
        console.log('xxxxxxx11');
        // other pages that do not have permission to access are redirected to the login page.
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }

})

router.afterEach(() => {
  // finish progress bar
  console.log('xxxxxxx12');
  NProgress.done()
})

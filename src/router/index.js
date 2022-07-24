import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/Login.vue'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        //using el svg icon, the elSvgIcon first when at the same time using elSvgIcon and icon
        meta: { title: 'Dashboard', elSvgIcon: 'Fold' }
      }
    ]
  },



  {
    path: '/jile',
    component: Layout,
    meta: { title: 'jile', icon: 'user' },
    alwaysShow: true,
    children: [
      {
        path: 'test-indexeddb',
        component: () => import('@/views/jile/testIndexedDB.vue'),
        name: 'IndexedDB测试',
        meta: { title: 'IndexedDB测试' }
      },
      {
        path: 'test-waterfall',
        component: () => import('@/views/jile/waterfall.vue'),
        name: '瀑布流',
        meta: { title: '瀑布流' }
      },
      {
        path: 'test-naiveui',
        component: () => import('@/views/jile/naiveui.vue'),
        name: 'NaiveUI测试',
        meta: { title: 'NaiveUI测试' }
      },
      {
        path: 'dic-upload',
        component: () => import('@/views/jile/dicUpload.vue'),
        name: '文件夹获取测试',
        meta: { title: '文件夹获取测试' }
      },
      {
        path: 'addIc',
        component: () => import('@/views/jile/addIc.vue'),
        name: '创建图集测试',
        meta: { title: '创建图集测试' }
      },
      {
        path: 'photo-gallery',
        component: () => import('@/views/jile/photoGallery.vue'),
        name: '图片缩略图展示',
        meta: { title: '图片缩略图展示' }
      },
      {
        path: 'open-file',
        component: () => import('@/views/jile/openFile.vue'),
        name: '默认打开文件测试',
        meta: { title: '默认打开文件测试' }
      },
      {
        path: 'compress-photo',
        component: () => import('@/views/jile/compressPhoto.vue'),
        name: '压缩图片测试',
        meta: { title: '压缩图片测试' }
      },
      {
        path: 'video-cover',
        component: () => import('@/views/jile/videoCover.vue'),
        name: '视频封面测试',
        meta: { title: '视频封面测试' }
      },
      {
        path: 'unzip-test',
        component: () => import('@/views/jile/unzipTest.vue'),
        name: '文件解压测试',
        meta: { title: '文件解压测试' }
      },
      {
        path: 'pagination-test',
        component: () => import('@/views/jile/paginationTest.vue'),
        name: '分页测试',
        meta: { title: '分页测试' }
      },
    ]
  },

  {
    path: '/electron',
    component: Layout,
    meta: { title: 'electron', icon: 'user' },
    alwaysShow: true,
    children: [
      {
        path: 'main-renderer-comm',
        component: () => import('@/views/electron/MainRendererComm.vue'),
        name: 'MainRenderer',
        meta: { title: 'Main Renderer' }
      },
      {
        path: 'electron-demo',
        component: () => import('@/views/electron/ElectronDemo.vue'),
        name: 'ElectronDemo',
        meta: { title: 'Electron Demo' }
      },
      {
        path: 'fs-extra',
        component: () => import('@/views/electron/FsExtra.vue'),
        name: 'FsExtra',
        meta: { title: 'fs-extra' }
      },
      {
        path: 'notify-netListen',
        component: () => import('@/views/electron/NotifyNetListen.vue'),
        name: 'NotifyNetListen',
        meta: { title: 'Notify Net' }
      },
      {
        path: 'nedb-demo',
        component: () => import('@/views/electron/NedbDemo.vue'),
        name: 'NedbDemo',
        meta: { title: 'NedbDemo' }
      },
      {
        path: 'indexDb-demo.vue',
        component: () => import('@/views/electron/IndexDbDemo.vue'),
        name: 'IndexDbDemo',
        meta: { title: 'IndexDbDemo' }
      },
      {
        path: 'test-IndexedDB.vue',
        component: () => import('@/views/electron/testIndexedDB.vue'),
        name: 'testIndexedDB',
        meta: { title: 'testIndexedDB' }
      }
    ]
  },
  // {
  //   path: '/setting-switch',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/setting-switch'),
  //       name: 'SettingSwitch',
  //       meta: { title: 'Setting Switch', icon: 'example' }
  //     }
  //   ]
  // },
  {
    path: '/error-log',
    component: Layout,
    name: 'ErrorLog',
    redirect: '/error-log/list',
    meta: { title: 'ErrorLog', icon: 'bug' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/error-log'),
        name: 'ErrorLog',
        meta: { title: 'Error Log' }
      },
      {
        path: 'error-log-test',
        component: () => import('@/views/error-log/ErrorLogTest.vue'),
        name: 'ErrorLogTest',
        meta: { title: 'ErrorLog Test' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index.vue'),
        meta: { title: 'Form', icon: 'table' }
      }
    ]
  },


  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index.vue'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1/index.vue'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2/index.vue'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1/index.vue'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2/index.vue'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3/index.vue'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index.vue'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },
  {
    path: '/external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/jzfai/vue3-admin-electron.git',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },
  {
    path: '/writing-demo',
    component: Layout,
    meta: { title: 'Writing Demo', icon: 'eye-open' },
    alwaysShow: true,
    children: [
      {
        path: 'hook',
        component: () => import('@/views/example/hook/Hook.vue'),
        name: 'Hook',
        meta: { title: 'Hook-Demo' }
      },
      {
        path: 'vuex-use',
        component: () => import('@/views/example/vuex-use/VuexUse.vue'),
        name: 'VuexUse',
        meta: { title: 'Vuex-Demo' }
      },
      {
        path: 'mock-test',
        component: () => import('@/views/example/mock-test/MockTest.vue'),
        name: 'MockTest',
        meta: { title: 'Mock-Demo' }
      },
      {
        path: 'svg-icon',
        component: () => import('@/views/example/svg-icon/SvgIcon.vue'),
        name: 'SvgIcon',
        meta: { title: 'Svg-Demo' }
      },
      {
        path: 'parent-children',
        component: () => import('@/views/example/parent-children/Parent.vue'),
        name: 'Parent',
        meta: { title: 'Parent-Children' }
      },
      {
        path: 'keep-alive',
        component: () => import('@/views/example/keep-alive'),
        name: 'KeepAlive',
        //cachePage: cachePage when page enter, default false
        //leaveRmCachePage: remove cachePage when page leave, default false
        meta: { title: 'Keep-Alive', cachePage: true, leaveRmCachePage: false }
      },
      {
        path: 'router-demo-f',
        name: 'routerDemoF',
        hidden: true,
        component: () => import('@/views/example/keep-alive/RouterDemoF.vue'),
        meta: { title: 'RouterDemo-F', activeMenu: '/writing-demo/keep-alive' }
      },
      {
        path: 'router-demo-s',
        name: 'routerDemoS',
        hidden: true,
        component: () => import('@/views/example/keep-alive/RouterDemoS.vue'),
        meta: { title: 'RouterDemo-S', activeMenu: '/writing-demo/keep-alive' }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index.vue'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index.vue'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'roleIndex',
        component: () => import('@/views/permission'),
        name: 'Permission',
        meta: {
          title: 'Role Index'
          //roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'page',
        component: () => import('@/views/permission/page.vue'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          // roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive.vue'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'code-index',
        component: () => import('@/views/permission/CodePermission.vue'),
        name: 'CodePermission',
        meta: {
          title: 'Code Index'
        }
      },
      {
        path: 'code-page',
        component: () => import('@/views/permission/CodePage.vue'),
        name: 'CodePage',
        meta: {
          title: 'Code Page',
          code: 1
        }
      },

      // 404 page must be placed at the end !!!
      // using pathMatch install of "*" in vue-router 4.0
      { path: '/:pathMatch(.*)', redirect: '/404', hidden: true }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
})

export default router

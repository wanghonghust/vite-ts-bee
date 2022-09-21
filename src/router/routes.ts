const routes = [
    {
        path: "/index",
        name: "index",
        component: () => import("../components/layout/Index.vue"),
        children: [{
            path: "/index",
            component: () => import("../views/system/Index.vue"),
        },],
        meta: {
            title: "首页",
            requireAuth: true,
        }
    },
    {
        path: "/",
        redirect: "/index",
    },
    {
        path: "/login",
        component: () => import("../views/auth/Login.vue"),
        meta: {
            title: "登录",
            keepHide: true,

        }
    },
    {
        path: "/usercenter",
        component: () => import("../components/layout/Index.vue"),
        children: [{
            path: "/usercenter",
            component: () => import("../views/system/UserCenter.vue"),
            meta: {
                title: "用户中心",
                requireAuth: true,
            }
        }],
    },

    {
        path: "/admin",
        component: () => import("../components/layout/Index.vue"),
        children: [{
            path: "sys-user",
            component: () => import("../views/system/user/Index.vue"),
            meta: {
                title: "用户管理",
                requireAuth: true,
            }
        }, {
            path: "sys-role",
            component: () => import("../views/system/role/Index.vue"),
            meta: {
                title: "角色管理",
                requireAuth: true,
            }
        }, {
            path: "sys-menu",
            component: () => import("../views/system/menu/Index.vue"),
            meta: {
                title: "菜单管理",
                requireAuth: true,
            }
        }, {
            path: "sys-perm/perm",
            component: () => import("../views/system/permission/Index.vue"),
            meta: {
                title: "系统权限",
                requireAuth: true,
            }
        }, {
            path: "api-doc",
            component: () => import("../views/api-doc/Index.vue"),
            meta: {
                title: "API文档",
                requireAuth: true,
            }
        }, {
            path: "api",
            component: () => import("../views/system/api/Index.vue"),
            meta: {
                title: "API接口",
                requireAuth: true,
            }
        }, {
            path: "log",
            component: () => import("../views/log/Index.vue"),
            meta: {
                title: "请求日志",
                requireAuth: true,
            }
        },
        ],
    },
    {
        path: "/test",
        component: () => import("../views/test/layout/TestIndex.vue"),
        children: [
            {
                path: "test1",
                component: () => import("../views/test/Test1.vue"),
                meta: {
                    title: "测试1",
                    requireAuth: true,
                }
            },
            {
                path: "test2",
                component: () => import("../views/test/Test2.vue"),
                meta: {
                    title: "测试2",
                    requireAuth: true,
                }
            },
            {
                path: "test3",
                component: () => import("../views/test/Test3.vue"),
                meta: {
                    title: "测试3",
                    requireAuth: true,
                }
            }, {
                path: "task",
                component: () => import("../views/tool/task/create/Index.vue"),
                meta: {
                    title: "定时任务",
                    requireAuth: true,
                }
            }
        ]
    },

    {
        path: "/tool",
        component: () => import("../components/layout/Index.vue"),
        children: [{
            path: "qr-code",
            component: () => import("../views/tool/qr-code/Index.vue"),
            meta: {
                title: "二维码生成器",
                requireAuth: true,
            }
        }, {
            path: "task",
            children: [
                {
                    path: "new",
                    component: () => import("../views/tool/task/create/Index.vue"),
                    meta: {
                        title: "新建任务",
                        requireAuth: true,
                    },
                }, {
                    path: "list",
                    component: () => import("../views/tool/task/list/Index.vue"),
                    meta: {
                        title: "任务列表",
                        requireAuth: true,
                    },
                }
            ]
        }, {
            path: "system-info",
            component: () => import("../views/tool/system-info/Index.vue"),
            meta: {
                title: "系统监控",
                requireAuth: true,
            }
        }, {
            path: "ssh",
            component: () => import("../views/tool/ssh/Index.vue"),
            meta: {
                title: "Web SSH",
                requireAuth: true,
            }
        }, {
            path: "ssh1",
            component: () => import("../views/tool/ssh/Index1.vue"),
            meta: {
                title: "Web SSH",
                requireAuth: true,
            }
        }]
    }
]
export default routes

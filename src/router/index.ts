import routes from "./routes";
import {createRouter, createWebHistory} from 'vue-router'
import {Session} from "../utils/storage";


const router = createRouter({
    history: createWebHistory(),
    routes
})
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        // @ts-ignore
        window.document.title = to.meta.title;
    }
    const token = Session.get("token")
    if (!token && to.meta.requireAuth === true && to.path !== "/login") {
        next({
            path: "/login",
            query: {redirect: to.fullPath}
        })
    } else {
        next();
    }
})

export default router

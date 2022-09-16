import request from "../utils/request";
import {Session} from "../utils/storage";
import router from "../router";

export function login(param: object) {
    return request({
        url: "/auth/login",
        method: "post",
        data: param
    });
}

export function logout() {
    Session.remove("token")
    Session.remove("user")
    Session.remove("username")
    Session.remove("avatar")
    router.replace({path: "/login", query: {redirect: router.currentRoute.value.fullPath}})
}

export function getUserInfo(id:number) {
    return request({
        url: "/auth/user",
        method: "get",
        params:{
            id:id
        }
    })
}

export function authenticate() {
    return request({
        url: "/auth",
        method: "post",
    });

}

export function changePwd(param: object) {
    return request({
        url: "/auth/passwd",
        method: "put",
        data: param
    })

}

export async function getPageUser(param: object) {
    const res = await request({
        url: "/auth/user",
        method: "post",
        data: param
    })
    return res

}

export function editUser(param: object) {
    return request({
        url: "/auth/user",
        method: "put",
        data: param
    })
}

export function deleteUser(id: number[]) {
    return request({
        url: "/auth/user",
        method: "delete",
        data: {
            id: id
        }
    })
}

export function createUser(param: object) {
    return request({
        url: "/auth/user/create",
        method: "post",
        data: param
    });
}

export function editUserAvatar(param: object) {
    return request({
        url: "/auth/user/avatar",
        method: "put",
        data: param
    })
}


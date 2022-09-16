import request from "../utils/request";

export function getAllPerm() {
    return request({
        url: "/system/perm",
        method: "get",
    });
}

export function createPerm(param: object) {
    return request({
        url: "/system/perm",
        method: "post",
        data: param
    });
}

export function deletePerm(param: object) {
    return request({
        url: "/system/perm",
        method: "delete",
        data: param
    });
}

export function updatePerm(param: object) {
    return request({
        url: "/system/perm",
        method: "put",
        data: param
    });
}

export interface SysPermission {
    id: string
    name: string
    type: string
    desc: string
    deleteAble: boolean
}

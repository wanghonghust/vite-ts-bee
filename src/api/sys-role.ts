import request from "../utils/request";

export function getAllRole() {
    return request({
        url: "/system/role",
        method: "get",
    });
}

export function createRole(param: object) {
    return request({
        url: "/system/role",
        method: "post",
        data: param,
    });
}

export function updateRole(param: object) {
    return request({
        url: "/system/role",
        method: "put",
        data: param,
    });
}

export function deleteRole(param: object) {
    return request({
        url: "/system/role",
        method: "delete",
        data: param,
    });
}

export interface Role {
    id: number,
    createAt: string,
    name: string,
    permission: [],
    menu: [],
    menuId:[]
}

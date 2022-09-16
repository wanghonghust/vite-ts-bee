import request from "../utils/request";

export function getAllMenu() {
    return request({
        url: "/system/menu",
        method: "get",
    });
}

export function createMenu(param: object) {
    return request({
        url: "/system/menu",
        method: "post",
        data: param,
    });
}

export function updateMenu(param: object) {
    return request({
        url: "/system/menu",
        method: "put",
        data: param,
    });
}

export function deleteMenu(param: object) {
    return request({
        url: "/system/menu",
        method: "delete",
        data: param,
    });
}

export function treeFilter(list: Array<any>, id: number) {
    if (!list){
        // 为空返回
        return
    }
    return list.filter(item => {
        item.children = treeFilter(item.children, id)
        return item.id!==id
    })
}

export interface Menu {
    id: number,
    label: string,
    parentId: number | null,
    link: string,
    icon: string,
    children?: Menu[] | null,
    createAt: string,
    local:boolean
}

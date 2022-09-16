import request from "../utils/request";


export function createTask(param: object) {
    return request({
        url: "/tool/async_task",
        method: "post",
        data: param,
    });
}

export function getTask() {
    return request({
        url: "/tool/async_task",
        method: "get",
    });
}

export interface Task {
    id: string,
    createdAt: string
    creator: number
    uid: string
    name: string
    registerName: string
    time: string
    type: number
    TZone: string
    desc: string
    state: string
    result: string
}

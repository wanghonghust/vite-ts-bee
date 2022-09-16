import request from "../utils/request";

export function getLogs() {
    return request({
        url: "/system/log",
        method: "get",
    });
}

export interface Log{
    path:string
    method:string
    description:string
    body:string
    response:string
}

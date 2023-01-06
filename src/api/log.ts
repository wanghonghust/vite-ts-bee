import request from "../utils/request";

export function getLogs(params:object) {
    return request({
        url: "/system/log",
        method: "get",
        params:params
    });
}

export interface Log{
    path:string
    method:string
    description:string
    body:string
    response:string
}

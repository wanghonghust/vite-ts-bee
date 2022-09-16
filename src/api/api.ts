import request from "../utils/request";

export function getApiBackends() {
    return request({
        url: "/system/api",
        method: "get",
    });
}

export interface Api{
    path:string
    method:string
    description:string
}

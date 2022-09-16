import request from "../utils/request";

export function systemInfo() {
    return request({
        url: "/tool/system-info",
        method: "get",
    });
}

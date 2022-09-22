import request from "../utils/request";

export function sshConfig(param: object) {
    return request({
        url: "/tool/ssh/config",
        method: "post",
        data: param
    });
}

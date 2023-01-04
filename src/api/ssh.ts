import request from "../utils/request";

export  async function  sshConfig(param: object) {
    return request({
        url: "/tool/ssh/config",
        method: "post",
        data: param
    });
}

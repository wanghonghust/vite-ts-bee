import request from "../utils/request";

export function genQRcode(param: object) {
    return request({
        url: "/tool/qr-code",
        method: "post",
        data: param,
        responseType:"blob"
    });
}

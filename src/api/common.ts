import request from "../utils/request";
import router from "../router";
import {FormInstance} from "element-plus/es";

export const baseUrl = import.meta.env.VITE_API_URL as any

export async function download(id: Number) {
    const res = await request({
        url: "/system/file",
        method: "get",
        params: {
            id: id
        },
        responseType: 'blob',
    })
    return res
}

function arrayBufferToBase64(buffer: any) {
    let binary = ''
    let bytes = new Uint8Array(buffer)
    let len = bytes.byteLength
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
}

//实现路由的局部刷新
export function reloadRouter(path: string) {
    router.push({path: path});
}

export function flat(data: Array<any>): Array<any> {
    let res: Array<any> = []
    // 闭包递归展平tree
    const tmp = (data: Array<any>) => {
        data.map((item) => {
            if (item.children) {
                res.push(item)
                tmp(item.children)
            } else {
                res.push(item)
            }
        })
    }
    tmp(data)
    return res
}

export function resetFields(formEl: FormInstance | undefined) {
    // 清除表单
    formEl?.resetFields()
}

export function splitOnce(str: string, substr: string): [string, string] {
    const index = str.indexOf(substr)
    if (index === -1) {
        return ["", str]
    }
    const preStr = str.slice(0, index)
    const aftStr = str.slice(index + 1, -1)

    return [preStr, aftStr]
}


export async function getBlob(url: string) {
    let resUrl = ""
    await request({
        url: url,
        method: "get",
        responseType: "blob",
    }).then((res) => {
        resUrl = URL.createObjectURL(res.data)
        console.log(resUrl)
    })
    console.log(resUrl)

    return resUrl
}


export function isJSON(str: string) {
    try {
        let obj = JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

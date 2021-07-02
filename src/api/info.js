import request from '@/utils/request'

export function uploadfile(data) {
    return request({
        url: '/info/uploadfile',
        method: 'post',
        data
    })
}

export function loadallequipttype(data) {
    //console.log(data);
    return request({
        url: '/info/loadallequipttype',
        method: 'post',
        data
    })
}

export function addequipt(data) {
    //console.log(data);
    return request({
        url: '/info/addequipt',
        method: 'post',
        data
    })
}

export function loadinfo(data) {
    //console.log(data);
    return request({
        url: '/info/loadinfo',
        method: 'post',
        data
    })
}

export function fetchandupdate(data) {
    //console.log(data);
    return request({
        url: '/info/fetchandupdate',
        method: 'post',
        data
    })
}
export function externalapi(data) {
    //console.log(data);
    return request({
        url: '/info/externalapi',
        method: 'post',
        data
    })
}
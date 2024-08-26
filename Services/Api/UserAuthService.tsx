import { baseUrl } from '../../Constant/ApiConstants';
import { logger } from '../../Constant/Logger';
import httpService from './httpService';

export function userLogin(params: any) {

    const endPoint = `${baseUrl}Auth/login`;

    // console.log(" LOGIN URL**************************   " , endPoint);
    

    // logger(" +++++++++++++LOGIN ++++++++++++++++ ", endPoint);

    // return httpService.post(endPoint,{timeout: 1000},params);
    return httpService.post(endPoint,params);



}

export function getCustomers(Token: any) {
    const endPoint = baseUrl + 'customers';
    return httpService.get(endPoint, Token);

}

export function getSpareParts() {
    const endPoint = baseUrl + 'spare-parts';
    return httpService.get(endPoint);

}

export function uploadServiceCall(params: any) {

    const endPoint = `${baseUrl}service-call`;
    return httpService.post(endPoint, params);
}




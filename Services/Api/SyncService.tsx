import { baseUrl } from '../../Constant/ApiConstants';
import httpService from './httpService';

export function getCustomers() {
    const endPoint = baseUrl + 'customers';
    return httpService.get(endPoint);
    
}

// export function updateTicketApproveStatus() {
//     const endPoint = baseUrl + 'updateTicketApproveStatus';
//     return httpService.get(endPoint);
// }

// export function updateServiceStartStatus() {
//     const endPoint = baseUrl + 'updateServiceStartStatus';
//     return httpService.get(endPoint);
// }

// export function updateTicketStartEndStatus() {
//     const endPoint = baseUrl + 'updateTicketStartStatus';
//     return httpService.get(endPoint);
// }

// export function requstSpareParts(params) {
//     const endPoint = baseUrl + 'requstSpareparts';
//     return httpService.post(endPoint, params);
//     return Promise.reject(new Error(''));
// }

// export function addNewService(params) {
//     const endPoint = baseUrl + 'sendNewAllServices';
//     return httpService.post(endPoint, params);
//     return Promise.reject(new Error(''));
// }

// export function addNewTicket(params) {
//     const endPoint = baseUrl + 'getAllServices';
//     return httpService.post(endPoint, params);
//     return Promise.reject(new Error(''));
// }



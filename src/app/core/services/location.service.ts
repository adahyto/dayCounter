import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    constructor() {}

    getCoords(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(Error('No support for geolocation'));
                return;
            }

            navigator.geolocation.getCurrentPosition((position) => {
                const longitude = position.coords.longitude;
                const latitude = position.coords.latitude;
                resolve({ lat: latitude, lng: longitude });
            });
        });
    }
}

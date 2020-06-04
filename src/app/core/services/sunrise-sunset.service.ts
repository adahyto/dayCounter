import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class SunriseSunsetService {
    constructor(private apiService: ApiService) {}

    getSunTimes(coords): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.apiService
                .get(
                    'https://api.sunrise-sunset.org',
                    `/json?lat=${coords.lat}&lng=${coords.lng}&date=today
                `
                )
                .subscribe((res) => {
                    resolve(res);
                });
        });
    }
}

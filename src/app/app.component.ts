import { Component, OnInit } from '@angular/core';
import { LocationService } from './core/services/location.service';
import { SunriseSunsetService } from './core/services/sunrise-sunset.service';
import { interval, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'the timer';
    dayPassedPercentage: number;
    dayLeftPercentage: number;
    sunInfo: { results: any; status: string };
    coords: {
        lat: number;
        lng: number;
    };
    clock: Observable<Date> = interval(1000).pipe(map(() => new Date()));
    utcOffset: number;
    currentHM: string;
    daytimeInfoInMinutes: {
        sunrise: string;
        sunset: string;
    };

    constructor(private locationService: LocationService, private sunService: SunriseSunsetService) {
        this.clock.pipe(distinctUntilChanged()).subscribe((date) => {
            this.currentHM = date.getUTCHours().toString() + ':' + date.getUTCMinutes().toString();
            this.runBar();
        });
    }

    async ngOnInit() {
        this.utcOffset = -(new Date().getTimezoneOffset() / 60);
        this.coords = await this.locationService.getCoords();
        this.sunInfo = await this.sunService.getSunTimes(this.coords);
        console.log('sun info:', this.sunInfo);
    }

    runBar() {
        if (this.sunInfo) {
            const sunriseInMin = this.UTCToMinutes(this.sunInfo.results.sunrise);
            const sunsetInMin = this.UTCToMinutes(this.sunInfo.results.sunset, false);
            const currentInMin = this.UTCToMinutes(this.currentHM);
            this.dayPassedPercentage = Number(this.calcDayPassed(sunriseInMin, sunsetInMin, currentInMin).toFixed(2));
            this.dayLeftPercentage = Number(this.calcDayLeft(sunriseInMin, sunsetInMin, currentInMin).toFixed(2));
            console.log('passed:', this.dayPassedPercentage, '%', 'left:', this.dayLeftPercentage, '%');
        }
    }

    calcDayPassed(sunriseInMin: number, sunsetInMin: number, currentInMin: number) {
        const dayLength = this.calcDayLength(sunriseInMin, sunsetInMin);
        const passedSinceSunrise = currentInMin - sunriseInMin;
        return (passedSinceSunrise / dayLength) * 100;
    }

    calcDayLeft(sunriseInMin: number, sunsetInMin: number, currentInMin: number) {
        const dayLength = this.calcDayLength(sunriseInMin, sunsetInMin);
        const passedSinceSunrise = currentInMin - sunriseInMin;
        const tillSunset = dayLength - passedSinceSunrise;
        return (tillSunset / dayLength) * 100;
    }

    calcDayLength(sunriseInMin: number, sunsetInMin: number): number {
        return sunsetInMin - sunriseInMin;
    }

    UTCToMinutes(UTC: string, am = true) {
        let HM = UTC.split(':').filter((item, idx) => idx < 2);
        if (!am) {
            HM[0] = (parseInt(HM[0], 10) + 12).toString();
        }
        return parseInt(HM[0], 10) * 60 + parseInt(HM[1], 10);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private formatErrors(error: any) {
        return throwError(error.error);
    }
    constructor(private http: HttpClient) {}

    get(apiUrl: string, path: string): Observable<any> {
        return this.http.get(`${apiUrl}/${path}`).pipe(catchError(this.formatErrors));
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { City } from '@/_models';

@Injectable({ providedIn: 'root' })
export class CityService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<City[]>(`${config.apiUrl}/cities`);
    }

    register(city: City) {
        return this.http.post(`${config.apiUrl}/cities/register`, city);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/cities/${id}`);
    }
}
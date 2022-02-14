import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { City } from '@/_models';
import { AlertService, CityService } from '@/_services';

@Component({ 
    selector: 'home-component',
    templateUrl: 'home.component.html' 
})
export class HomeComponent {
    showCities: boolean = false;
    cities: City[] = null;
    loading: boolean = false;

    constructor(
        private router: Router,
        private cityService: CityService
    ) {

    }

    toggleCityList() {
        this.showCities = !this.showCities;
        if (this.showCities && this.cities === null)
        {
            this.loading = true;
            this.getAllCities();
            this.loading = false;
        }
    }

    deleteCity(id: number) {
        this.cityService.delete(id)
            .pipe(first())
            .subscribe(() => this.getAllCities());
    }

    getAllCities() {
        this.loading = true;
        this.cityService.getAll()
            .pipe(first())
            .subscribe(cities => this.cities = cities);
        this.loading = false;
    }

    goToRegister() {
        this.router.navigate(['register']);
    }
}
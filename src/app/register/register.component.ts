import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { City } from '@/_models';
import { AlertService, CityService } from '@/_services';

@Component({ 
    selector: 'register-component',
    templateUrl: 'register.component.html' 
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading: boolean = false;
    showForm: boolean = true;
    submitted: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private cityService: CityService,
        private alertService: AlertService
    ) {
        this.prepareForm();
    }

    ngOnInit() {}

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        this.alertService.clear();

        console.log(this.registerForm.value);

        if (this.registerForm.invalid) {
            return;
        }

        let cityRecord: City = {
            name: this.registerForm.value.name,
            temperature: this.registerForm.value.temperature,
            date: new Date(this.registerForm.value.date + " " + this.registerForm.value.time)
        };

        this.loading = true;
        this.cityService.register(cityRecord)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.loading = false;
                    this.gotToHome();
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    prepareForm() {
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            temperature: ['', Validators.required],
            date: ['', Validators.required],
            time: ['', Validators.required]
        });
    }

    gotToHome() {
        this.router.navigate(['']);
    }
}

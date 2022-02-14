import { Component } from '@angular/core';
import { Router } from '@angular/router';

import './_content/app.less';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    constructor(
        private router: Router
    ) {}
}
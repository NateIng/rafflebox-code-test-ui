import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered cities
let cities = JSON.parse(localStorage.getItem('cities')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/cities/register') && method === 'POST':
                    return register();
                case url.endsWith('/cities') && method === 'GET':
                    return getCities();
                case url.match(/\/cities\/\d+$/) && method === 'DELETE':
                    return deleteCity();
                default:
                    return next.handle(request);
            }    
        }

        function register() {
            const city = body

            if (cities.find(x => x.name === city.name && x.date === city.date && x.time === city.time)) {
                return error('A temperature has already been recorded for "' + city.name + '" on "' + city.date + '" at "' + city.time + '"');
            }

            city.id = cities.length ? Math.max(...cities.map(x => x.id)) + 1 : 1;
            cities.push(city);
            localStorage.setItem('cities', JSON.stringify(cities));

            return ok();
        }

        function getCities() {
            return ok(cities);
        }

        function deleteCity() {
            cities = cities.filter(x => x.id !== idFromUrl());
            localStorage.setItem('cities', JSON.stringify(cities));
            return ok();
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
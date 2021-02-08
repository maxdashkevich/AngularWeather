import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {Weather} from './interfaces/weather.interface';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private readonly http: HttpClient ) { }

  weatherUrl: string;

  private API_KEY: string = '119b23ade8091d5fecb8891fdc2a324d';

  private cityUrl = 'https://gist.githubusercontent.com/alex-oleshkevich/6946d85bf075a6049027306538629794/raw/3986e8e1ade2d4e1186f8fee719960de32ac6955/by-cities.json';

  getCities(): Observable<Array<string>> {
    return this.http.get(this.cityUrl)
        .pipe(
          map((data: HttpResponse<any>): Array<string> => {
            const cities: Array<string> = [];
            data[0].regions.forEach((el: any) => {
              el.cities.forEach(city => cities.push(city.name));
            });
            return cities;
          })
        );
    }

  getWeather(city: string): Observable<Weather> {
    this.weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.API_KEY}&units=metric`;
    return this.http.get(this.weatherUrl)
      .pipe(
        map((data: any): Weather => {
          const temperature = data.main.temp;
          const wind = data.wind.speed;
          const humidity = data.main.humidity;
          return {temperature, wind, humidity}
        })
      );
  }
}
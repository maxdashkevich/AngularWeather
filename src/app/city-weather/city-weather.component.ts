import {Component, OnInit} from '@angular/core';
import {combineLatest, Observable, Subject} from 'rxjs';

import {WeatherService} from '../weather.service';
import {Weather} from '../interfaces/weather.interface';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-city-weather',
  templateUrl: './city-weather.component.html',
  styleUrls: ['./city-weather.component.css']
})
export class CityWeatherComponent implements OnInit {

  constructor(private weatherService: WeatherService) {
  }

  weather$: Observable<Weather>;

  selectedCity: string;

  selectedCity$: Subject<string> = new Subject<string>();

  cities$: Observable<Array<string>> = this.weatherService.getCities();

  ngOnInit(): void {

    this.weather$ = combineLatest([this.cities$, this.selectedCity$]).pipe(
      switchMap(([cities, selectedCity]: [Array<string>, string]): Observable<Weather> => {
        const city = this.findCity(selectedCity, cities);
        return this.weatherService.getWeather(city);
      })
    );
  }

  private findCity(name: string, cities: Array<string>): string {
    return cities.find(elem => elem === name);
  }

  getWeather(): void {
    this.selectedCity$.next(this.selectedCity);
  }

}

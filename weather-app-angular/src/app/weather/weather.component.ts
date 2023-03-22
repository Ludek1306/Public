import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { weatherList, Weather } from '../weather-data/weather-data';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  checkWeather: any;
  temperature: number = 0;
  feelsLikeTemp: number = 0;
  humidity: number = 0;
  pressure: number = 0;
  summary: string = '';
  iconURL: string = '';
  cityName: string = 'Brno';
  lastCity: string = 'Brno';
  units: string = 'metric';
  weatherForm!: FormGroup;
  listOfCities!: Weather;

  constructor(
    private weatherService: WeatherService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getWeather();
    this.weatherForm = this.formBuilder.group({
      item: ['', Validators.required],
    });
  }

  getWeather() {
    this.weatherService.getWeather(this.cityName, this.units).subscribe({
      error: (error) => {
        this.cityName = this.lastCity;
        console.error('City does not found.', error.message);
      },
      next: (res) => {
        console.log(res);
        this.checkWeather = res;
        console.log(this.checkWeather);
        this.temperature = this.checkWeather.main.temp;
        this.feelsLikeTemp = this.checkWeather.main.feels_like;
        this.humidity = this.checkWeather.main.humidity;
        this.pressure = this.checkWeather.main.pressure;
        this.summary = this.checkWeather.weather[0].main;
        this.iconURL =
          'https://openweathermap.org/img/wn/' +
          this.checkWeather.weather[0].icon +
          '@2x.png';
      },
      complete: () => console.info('API call completed.'),
    });
  }

  unitsChange() {
    if (this.units == 'metric') {
      this.units = 'imperial';
    } else {
      this.units = 'metric';
    }
    this.getWeather();
  }

  changeCity(name: string) {
    this.lastCity = this.cityName;
    this.cityName = name;
    this.getWeather();
    this.weatherForm.reset();
  }
}

// How to check in the Angular if I get an error from http get request. And if I get an error, how to stop the process and use previous values?

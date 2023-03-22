import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Weather } from '../weather-data/weather-data';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  checkWeather: any;
  cityName: string = '';
  units: string = 'metric';
  weatherForm!: FormGroup;
  citiesList: Weather[] = [];
  cityNotFound: string = '';

  constructor(
    private weatherService: WeatherService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.weatherForm = this.formBuilder.group({
      item: ['', Validators.required],
    });
  }

  getWeather() {
    this.weatherService.getWeather(this.cityName, this.units).subscribe({
      next: (res) => {
        this.checkWeather = res;
        this.citiesList.push({
          name: this.checkWeather.name,
          temperature: this.checkWeather.main.temp,
          feelsLikeTemp: this.checkWeather.main.feels_like,
          humidity: this.checkWeather.main.humidity,
          pressure: this.checkWeather.main.pressure,
          summary: this.checkWeather.weather[0].main,
          iconURL:
            'https://openweathermap.org/img/wn/' +
            this.checkWeather.weather[0].icon +
            '@2x.png',
        });
      },
      error: (error) => {
        this.cityNotFound = ' Selected city was not found!';
        console.error('Selected city was not found!', error.message);
      },
      complete: () => console.info('API call completed.'),
    });
  }

  addCity() {
    this.cityName = this.weatherForm.value.item;
    this.weatherForm.reset();
    this.cityNotFound = '';
    this.getWeather();
  }

  deleteCity(i: number) {
    this.citiesList.splice(i, 1);
  }
}

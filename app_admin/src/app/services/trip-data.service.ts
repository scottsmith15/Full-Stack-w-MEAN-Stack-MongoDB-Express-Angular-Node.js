import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthResponse } from '../models/authresponse';
import { BROWSER_STORAGE } from '../storage';
import { Trip } from '../models/trip';
import { User } from '../models/user';

@Injectable()
export class TripDataService {

  constructor(
    private http: Http,
    private httpClient: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
    ) { }

  private apiBaseUrl = 'http://localhost:3000/api/';
  private tripUrl = `${this.apiBaseUrl}trips/`;
  private httpOptions = {                                            
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.storage.getItem('travlr-token')}`   
    })
  };

  public addTrip(formData: Trip): Promise<Trip> {
    console.log('Inside TripDataService#addTrip');
    return this.httpClient
      .post(this.tripUrl, formData, this.httpOptions) // pass form data in request body
      .toPromise()
      .then(response => response as Trip[])
      .catch(this.handleError);
  }

  public getTrip(tripCode: string): Promise<Trip> {
    console.log('Inside TripDataService#getTrip(tripCode)');
    return this.http
      .get(this.tripUrl + tripCode)
      .toPromise()
      .then(response => response.json() as Trip)
      .catch(this.handleError);
   }

  public getTrips(): Promise<Trip[]> {
    console.log('Inside TripDataService#getTrips');
    return this.http
      .get(this.tripUrl)
      .toPromise()
      .then(response => response.json() as Trip[])
      .catch(this.handleError);
  }

  public deleteTrip(formData: Trip): Promise<Trip> {
    console.log('Inside TripDataService#deleteTrip');
    console.log(formData);
    return this.httpClient
      .delete(this.tripUrl + formData.code, this.httpOptions)
      .toPromise()
      .then(response => response as Trip[])
      .catch(this.handleError);
   }

  public updateTrip(formData: Trip): Promise<Trip> {
    console.log('Inside TripDataService#updateTrip');
    console.log(formData);
    return this.httpClient
      .put(this.tripUrl + formData.code, formData, this.httpOptions)
      .toPromise()
      .then(response => response as Trip[])
      .catch(this.handleError);
   }

  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  public login(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('login', user);
  }

  public register(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('register', user);
  }

  private makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url: string = `${this.apiBaseUrl}/${urlPath}`;
    return this.http
      .post(url, user)
      .toPromise()
      .then(response => response.json() as AuthResponse)
      .catch(this.handleError);
  }

}
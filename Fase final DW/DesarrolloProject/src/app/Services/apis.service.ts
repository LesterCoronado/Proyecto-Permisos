import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApisService {

  constructor(private http: HttpClient) { }

  public get(url:string) {
    return this.http.get(url); //GET

  }

  public post(url: string, body: any) {
    return this.http.post(url, body); //Post
  }

  public put(url: string, body: any) {
    return this.http.put(url, body); //Put
  }
}



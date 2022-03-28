import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  postJob(data: any, url: string) {
    return this.http.post<any>("http://localhost:3000/" + url, data);
  }

  getJob(data: any) {
    return this.http.get<any>("http://localhost:3000/" + data);
  }

  putJob(data: any, id: number, url: string) {
    return this.http.put<any>("http://localhost:3000/" + url + "/" + id, data);
  }

  deleteJob(id: number, url: string) {
    return this.http.delete<any>("http://localhost:3000/" + url + "/" + id);
  }
}

import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HttpClient  } from '@angular/common/http';
import { environment } from '../environments/environment';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


import {  HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ServerService {
    url_company: string;
    public token : string;

    hostAddress = 'http://0.0.0.0:8000/';
    
    protocol = window.location.protocol;
    hostname = window.location.hostname;
    port = environment.production ? 6088 : 8000;
    public url = 'http://travidux.com:2020/'; //live

    constructor(private http: HttpClient) {
        this.url_company = this.hostAddress + 'user/get_company_list/';
    }
    getloginCheck(url, data) {
      const header = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http
            .post(this.hostAddress + url, data, { headers: header})
            .map((response: Response) => {
              // const res = response.json();
                return response;
            })
            .catch((error: Response) => {
                    return Observable.throw('something went wrong');
                  });

    }
    postData(url, data) {

      const token = localStorage.getItem('Tokeniser');
      const header = new HttpHeaders({ Authorization: 'JWT ' + token });

        // const header = new HttpHeaders({ 'Content-Type': 'application/json' })
        return this.http
            .post(this.hostAddress + url, data, { headers: header})
            .map((response: Response) => {
              // const res = response.json();
                return response;
            })
            .catch((error: Response) => {
                    return Observable.throw('something went wrong');
                  });

    }
    postFormData(url,data) {
        // const header = new HttpHeaders({ 'Content-Type': 'application/json' })
        const token = localStorage.getItem('Tokeniser');
        const header = new HttpHeaders({ Authorization: 'JWT ' + token });
        return this.http
            .post(this.hostAddress + url, data,{headers: header} )
            .map((response: Response) => {
                return response;
            })

    }

    getData(url, params = "") {

      const token = localStorage.getItem('Tokeniser');
      const header = new HttpHeaders({ Authorization: 'JWT ' + token });
        return this.http
          .get(this.hostAddress + url, { headers: header })
          .map((response: Response) => {
            const data = response;
            return data;
          });
        //   .catch((error: Response) => {
        //     // return Observable.throw("something went wrong");
        //   });
      }
      getDataWithParam(url, params={}) {
        const token = localStorage.getItem('Tokeniser');
        const header = new HttpHeaders({ Authorization: 'JWT ' + token });
          return this.http
            .get(this.hostAddress + url, { headers: header ,params:params})
            .map((response: Response) => {
              const data = response;

              return data;
            });
          //   .catch((error: Response) => {
          //     // return Observable.throw("something went wrong");
          //   });
        }


  search_company(term) {
    const jwttoken = 'JWT ' + localStorage.getItem('Tokeniser');
    const header = new HttpHeaders({ 'Content-Type': 'application/json' })
    const data = { term: term };
    return this.http
      .post(this.url_company, data, { headers: header })
      .map(response => {
        return response
      });
  }




      putData(url, data) {
        const token = localStorage.getItem("Tokeniser");
        const header = new HttpHeaders({ Authorization: "JWT " + token });
        return this.http
          .put(this.hostAddress + url, data, { headers: header })
          .map((response: Response) => {
            return response;
        })
        //   .catch((error: Response) => {
        //     return Observable.throw("something went wrong");
        //   });
      }
      patchData(url, data) {
        const token = localStorage.getItem("Tokeniser");
        const header = new HttpHeaders({ Authorization: "JWT " + token });
        return this.http
          .patch(this.hostAddress + url, data, { headers: header })
          .map((response: Response) => {
            return response;
        })
        //   .catch((error: Response) => {
        //     return Observable.throw("something went wrong");
        //   });
      }
      addCompany(url,data) {
        // const header = new HttpHeaders({ 'Content-Type': 'application/json' })
        return this.http
            .post(this.hostAddress + url, data,{} )
            .map((response: Response) => {
                return response;
            })

    }

}

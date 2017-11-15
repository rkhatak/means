import { Injectable, Inject, OnInit, OnDestroy } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { DOCUMENT } from '@angular/platform-browser';
 
const APIURL="http://localhost:3000/api/";
@Injectable()
export class DataService {

  constructor(private _http: Http,@Inject(DOCUMENT) private document: any) { }
  getProducts(): Observable<any> {
    let self = this;
    let apiUrl = APIURL+ 'products';
    return self._http.get(apiUrl)
        .map((response: Response) => <any>response.json());
}

updateCartProducts(): Observable<any> {
   let self = this;
   let apiUrl = APIURL+ 'cartaddedproduct';
   return self._http.get(apiUrl)
       .map((response: Response) => <any>response.json());
}
updateProducts(pid:any,addType:any){
       let self = this;
       let apiUrl = APIURL+ `products/${pid}`;
       let headers = new Headers();
       headers.append('content-type', 'application/json');
       let options = new RequestOptions({ headers: headers });
       let data={'addcart':addType};
       return self._http.put(apiUrl, data, options)
           .map((response: Response) => <any>response.json());
}
setStorage(key, value) {
   localStorage.setItem(key, value);
}

getStorage(key) {
   return localStorage.getItem(key);
}
showPopUp() {
   this.document.querySelector('.a_modal').classList.remove('hide');
}
hidePopUp() {
   this.document.querySelector('.a_modal').classList.add('hide');
}
}

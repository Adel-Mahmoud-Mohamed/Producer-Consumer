import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class appService {

  constructor(private http:HttpClient) { }

  public constructNetwork(productsNetwork : string):Observable<string>{
    return this.http.post("http://localhost:9080/constructNetwork", productsNetwork,{responseType:"text"})
  }

  public run():Observable<string>{
    return this.http.get("http://localhost:9080/run", {responseType:"text"})
  }

  public polling() :Observable<Object[]> {
    return this.http.get<Object[]>("http://localhost:9080/polling");

  }

  public stop() :Observable<string>{
    return this.http.get("http://localhost:9080/stop", {responseType:"text"});
  }

  public inputStop() :Observable<string>{
    return this.http.get("http://localhost:9080/inputStop", {responseType:"text"});
  }

  public replay() :Observable<Object[][]> {
    return this.http.get<Object[][]>("http://localhost:9080/replay");
  }


}

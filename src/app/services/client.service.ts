import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private _localStorage: LocalStorageService) { }

  getClient(){
    const res = this._localStorage.getItem("money-beat:client");
    if(res) {
      return JSON.parse(res)
    }
    return null;
  }
  setClient(client: Client): boolean {
        if(client.name){
           this._localStorage.setItem("money-beat:client", client);
           return true
        }
        return false
  }
}

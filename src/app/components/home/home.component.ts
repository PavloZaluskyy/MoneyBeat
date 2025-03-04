import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  client: Client | undefined;

  constructor(private _client: ClientService) {}

  ngOnInit(): void {
    this.client = this._client.getClient();
  }
}

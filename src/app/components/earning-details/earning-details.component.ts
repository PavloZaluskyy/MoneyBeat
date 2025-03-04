import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EarningsService } from '../../services/earnings.service';
import { Earning } from '../../models/earning';

@Component({
  selector: 'app-earning-details',
  templateUrl: './earning-details.component.html',
  styleUrl: './earning-details.component.scss',
})
export class EarningDetailsComponent implements OnInit {
  earningsAll: Earning[] | null = [];
  selectEarning: Earning | any;
  constructor(
    private route: ActivatedRoute,
    private _earningService: EarningsService
  ) {}

  ngOnInit(): void {
    this.earningsAll = this._earningService.getAllEarnings();
    if (this.earningsAll?.length) {
      this.selectEarning = this.earningsAll?.filter((item: Earning) =>
        item.id == Number(this.route.snapshot.paramMap.get('id')) ? item : null
      )[0];
    }
  }
}

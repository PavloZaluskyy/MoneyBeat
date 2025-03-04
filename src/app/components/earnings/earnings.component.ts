import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import {
  ModalDismissReasons,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  OperatorFunction,
} from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { EarningsService } from '../../services/earnings.service';
import { Earning } from '../../models/earning';
import { Router } from '@angular/router';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrl: './earnings.component.scss',
})
export class EarningsComponent implements OnInit {
  private modalService = inject(NgbModal);
  closeResult = '';
  modelDate: NgbDateStruct | undefined;
  currentDate = new Date();
  date: { year: number; month: number; day?: number } | undefined;

  modelEarningName: string = '';
  modelEarningDescription: string = '';
  searchAllEarning: Earning[] = [];
  modelAmound: string | null = '';
  isValidForm: any = { nameEarning: true, totalAmound: true };
  messageValid: string = '';

  isRemember: boolean = true;

  constructor(
    private _earningService: EarningsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchAllEarning = this._earningService.getAllEarnings();
  }

  sentEarning() {
    if (this.validation()) {
      const earning: Earning = {
        id: this.searchAllEarning.length + 1,
        nameEarning: this.modelEarningName,
        description: this.modelEarningDescription,
        date: this.modelDate?.day
          ? this.modelDate?.day +
            '.' +
            this.modelDate?.month +
            '.' +
            this.modelDate?.year
          : this.currentDate.getDate() +
            '.' +
            (this.currentDate.getMonth() + 1) +
            '.' +
            this.currentDate.getFullYear(),
        totalAmound: Number(this.modelAmound),
        isRemember: this.isRemember,
      };
      this.searchAllEarning.push(earning);
      this._earningService.setEarning(this.searchAllEarning);
      this.router.navigateByUrl('');
    }
  }

  validation(): boolean {
    this.isValidForm.nameEarning = true;
    this.isValidForm.totalAmound = true;
    if (!this.modelEarningName.trim()) {
      this.isValidForm.nameEarning = false;
      this.messageValid = 'Введіть назву надходження!';
      return false;
    }
    if (!this.modelAmound) {
      this.isValidForm.totalAmound = false;
      this.messageValid = 'Введіть суму надходження!';
      return false;
    }
    return true;
  }

  searchEarning: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.searchAllEarning
              .filter((v) => v.isRemember)
              .map((item) => item.nameEarning)
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
}

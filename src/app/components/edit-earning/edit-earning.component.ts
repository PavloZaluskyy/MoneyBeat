import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ModalDismissReasons, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, map, Observable, OperatorFunction } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { EarningsService } from '../../services/earnings.service';
import { Earning } from '../../models/earning';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-earning',
  templateUrl: './edit-earning.component.html',
  styleUrl: './edit-earning.component.scss'
})
export class EditEarningComponent implements OnInit {
  
  private modalService = inject(NgbModal);
  closeResult = '';
  modelDate: NgbDateStruct | undefined;
  currentDate = new Date();
  date: { year: number; month: number; day?:number } | undefined;

  modelEarningName: string = "";
  modelEarningDescription: string = '';
  searchAllEarning: Earning[] = [];
  modelAmound: string | null ='';
  isValidForm: any = {nameEarning: true, totalAmound: true};
  messageValid: string ="";

  selectEarning: Earning | any;

  isRemember: boolean = true;

  constructor(private _earningService: EarningsService,     
              private router: Router,
              private activeRouter: ActivatedRoute
              
  ){}

  ngOnInit(): void {
    this.searchAllEarning = this._earningService.getAllEarnings()
    if(this.searchAllEarning?.length) {
                  this.selectEarning = this.searchAllEarning?.filter((item: Earning) => item.id == Number(this.activeRouter.snapshot.paramMap.get('id')) ? item : null )[0]
            }
  }

  sentEarning(){
    console.log(this.isValidForm);
    if (this.validation()) {
      console.log(this.searchAllEarning);
      let arr = this.searchAllEarning.filter((item: Earning)=> item.id !== this.selectEarning.id)
      arr.push(this.selectEarning)
      console.log(arr);
      this._earningService.setEarning(arr)
      this.router.navigateByUrl('');
    } 
  }
  
  validation(): boolean{
    this.isValidForm.nameEarning = true;
    this.isValidForm.totalAmound = true;
    if(!this.selectEarning.nameEarning.trim()) {
      this.isValidForm.nameEarning = false;
      this.messageValid = 'Введіть назву надходження!';
      console.log(this.messageValid);
      
      return false;
    }
    if (!this.selectEarning.totalAmound) {
      this.isValidForm.totalAmound = false;
      this.messageValid = 'Введіть суму надходження!';
      console.log(this.messageValid);

      return false;
    }
    return true;
  }

  searchEarning: OperatorFunction<string, readonly string[]> = (
      text$: Observable<string>,
    ) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map((term) =>
          term.length < 2
            ? []
            : this.searchAllEarning
                .filter(v => v.isRemember)
                .map((item) => item.nameEarning)
                .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
                .slice(0, 10),
        ),
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
          },
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

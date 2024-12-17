import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteNewTicketComponent } from './write-new-ticket.component';

describe('WriteNewTicketComponent', () => {
  let component: WriteNewTicketComponent;
  let fixture: ComponentFixture<WriteNewTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WriteNewTicketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WriteNewTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

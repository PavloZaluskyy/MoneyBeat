import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanTextNewTicketComponent } from './scan-text-new-ticket.component';

describe('ScanTextNewTicketComponent', () => {
  let component: ScanTextNewTicketComponent;
  let fixture: ComponentFixture<ScanTextNewTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScanTextNewTicketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScanTextNewTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

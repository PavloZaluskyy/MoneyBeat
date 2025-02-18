import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningStComponent } from './earning-st.component';

describe('EarningStComponent', () => {
  let component: EarningStComponent;
  let fixture: ComponentFixture<EarningStComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EarningStComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EarningStComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

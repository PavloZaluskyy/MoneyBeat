import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckSignInComponent } from './check-sign-in.component';

describe('CheckSignInComponent', () => {
  let component: CheckSignInComponent;
  let fixture: ComponentFixture<CheckSignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckSignInComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

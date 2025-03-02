import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEarningComponent } from './edit-earning.component';

describe('EditEarningComponent', () => {
  let component: EditEarningComponent;
  let fixture: ComponentFixture<EditEarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEarningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditEarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

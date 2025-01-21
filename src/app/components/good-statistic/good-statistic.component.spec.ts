import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodStatisticComponent } from './good-statistic.component';

describe('GoodStatisticComponent', () => {
  let component: GoodStatisticComponent;
  let fixture: ComponentFixture<GoodStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoodStatisticComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoodStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

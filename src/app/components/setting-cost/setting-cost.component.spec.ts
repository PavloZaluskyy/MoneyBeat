import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingCostComponent } from './setting-cost.component';

describe('SettingCostComponent', () => {
  let component: SettingCostComponent;
  let fixture: ComponentFixture<SettingCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingCostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

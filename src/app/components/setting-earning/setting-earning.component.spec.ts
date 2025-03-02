import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingEarningComponent } from './setting-earning.component';

describe('SettingEarningComponent', () => {
  let component: SettingEarningComponent;
  let fixture: ComponentFixture<SettingEarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingEarningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingEarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

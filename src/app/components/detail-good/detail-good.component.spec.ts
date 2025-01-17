import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailGoodComponent } from './detail-good.component';

describe('DetailGoodComponent', () => {
  let component: DetailGoodComponent;
  let fixture: ComponentFixture<DetailGoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailGoodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailGoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

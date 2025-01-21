import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopStoreComponent } from './top-store.component';

describe('TopStoreComponent', () => {
  let component: TopStoreComponent;
  let fixture: ComponentFixture<TopStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopStoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

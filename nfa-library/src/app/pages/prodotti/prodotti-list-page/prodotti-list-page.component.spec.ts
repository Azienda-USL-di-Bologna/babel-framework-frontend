import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdottiListPageComponent } from './prodotti-list-page.component';

describe('ProdottiListPageComponent', () => {
  let component: ProdottiListPageComponent;
  let fixture: ComponentFixture<ProdottiListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdottiListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdottiListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

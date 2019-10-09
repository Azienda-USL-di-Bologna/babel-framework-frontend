import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FornitoriProdottiMdPageComponent } from './fornitori-prodotti-md-page.component';

describe('FornitoriProdottiMdPageComponent', () => {
  let component: FornitoriProdottiMdPageComponent;
  let fixture: ComponentFixture<FornitoriProdottiMdPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FornitoriProdottiMdPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FornitoriProdottiMdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

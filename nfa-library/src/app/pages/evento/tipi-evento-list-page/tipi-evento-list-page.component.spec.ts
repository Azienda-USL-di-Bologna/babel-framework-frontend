import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipiEventoListPageComponent } from './tipi-evento-list-page.component';

describe('TipiEventoListPageComponent', () => {
  let component: TipiEventoListPageComponent;
  let fixture: ComponentFixture<TipiEventoListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipiEventoListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipiEventoListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

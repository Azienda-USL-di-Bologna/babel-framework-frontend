import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatiEventoListPageComponent } from './stati-evento-list-page.component';

describe('StatiEventoListPageComponent', () => {
  let component: StatiEventoListPageComponent;
  let fixture: ComponentFixture<StatiEventoListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatiEventoListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatiEventoListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

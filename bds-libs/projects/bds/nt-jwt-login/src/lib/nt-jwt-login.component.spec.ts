import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NtJwtLoginComponent } from './nt-jwt-login.component';

describe('NtJwtLoginComponent', () => {
  let component: NtJwtLoginComponent;
  let fixture: ComponentFixture<NtJwtLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NtJwtLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NtJwtLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

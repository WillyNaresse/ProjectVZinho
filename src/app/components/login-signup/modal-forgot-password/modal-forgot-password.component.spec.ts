import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalForgotPasswordComponent } from './modal-forgot-password.component';

describe('ModalForgotPasswordComponent', () => {
  let component: ModalForgotPasswordComponent;
  let fixture: ComponentFixture<ModalForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalForgotPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

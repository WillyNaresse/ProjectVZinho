import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteChecklistComponent } from './modal-delete-checklist.component';

describe('ModalDeleteChecklistComponent', () => {
  let component: ModalDeleteChecklistComponent;
  let fixture: ComponentFixture<ModalDeleteChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDeleteChecklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDeleteChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

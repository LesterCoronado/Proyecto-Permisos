import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinacionComponent } from './coordinacion.component';

describe('CoordinacionComponent', () => {
  let component: CoordinacionComponent;
  let fixture: ComponentFixture<CoordinacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoordinacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldwideSummaryComponent } from './worldwide-summary.component';

describe('WorldwideSummaryComponent', () => {
  let component: WorldwideSummaryComponent;
  let fixture: ComponentFixture<WorldwideSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldwideSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldwideSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

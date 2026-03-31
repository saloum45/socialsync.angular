import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListEntreprisesComponent } from './list-entreprises.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListEntreprisesComponent', () => {
  let component: ListEntreprisesComponent;
  let fixture: ComponentFixture<ListEntreprisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEntreprisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

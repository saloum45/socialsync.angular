import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListPostPublicationsComponent } from './list-post-publications.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListPostPublicationsComponent', () => {
  let component: ListPostPublicationsComponent;
  let fixture: ComponentFixture<ListPostPublicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPostPublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

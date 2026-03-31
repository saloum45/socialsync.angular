import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListSocialAccountsComponent } from './list-social-accounts.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListSocialAccountsComponent', () => {
  let component: ListSocialAccountsComponent;
  let fixture: ComponentFixture<ListSocialAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSocialAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

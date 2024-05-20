  import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

  import { importProvidersFrom } from '@angular/core';
  import { AppComponent } from './app/app.component';
  import { AppRoutingModule } from './app/app-routing.module';
  import {
    withInterceptorsFromDi,
    provideHttpClient,
  } from '@angular/common/http';
  import {
    BrowserModule,
    bootstrapApplication,
  } from '@angular/platform-browser';
  import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

  import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideNativeDateAdapter } from '@angular/material/core';

  bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(BrowserModule, AppRoutingModule),
      provideAnimationsAsync(),
      provideNativeDateAdapter(),
      provideHttpClient(withInterceptorsFromDi()),
      provideCharts(withDefaultRegisterables()), provideAnimationsAsync(),
    ],
  }).catch((err) => console.error(err));

import { TokenInterceptorService } from '@configs/token-interceptor.service';
import { AuthGuard } from '@guards/auth.guard';
import { AuthService } from '@services/authentication/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule, RouterComponents, Resolver } from './app-routing.module';
import { AppComponent } from './app.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxMaskModule } from 'ngx-mask';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AutosizeModule } from 'ngx-autosize';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MsalModule } from '@azure/msal-angular';
import { MsalInterceptor } from '@azure/msal-angular';
import { MsalGuard } from '@azure/msal-angular';
import { MsalSetting } from '@settings/Msal';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { appReducers } from '@reducers/app.reducer';
import { environment } from '@environments/environment';

import { PlantEffects } from '@effects/plant.effect';
import { SafePipe } from './core/pipes/safe.pipe';
import { ReturnComponent } from './pages/initiatives/return/return.component';
import { ReturnCapexComponent } from './shared/return/return-capex/return-capex.component';
import { ReturnGeneralComponent } from './shared/return/return-general/return-general.component';
import { DataTablesModule } from 'angular-datatables';
import { ViewRevistionAddmoreComponent } from './shared/components/view-revistion-addmore/view-revistion-addmore.component';
import { ViewRevistionReturnComponent } from './shared/components/view-revistion-return/view-revistion-return.component';
import { ViewRevistionComponent } from './shared/components/view-revistion/view-revistion.component';
import { PoolComponent } from './pages/initiatives/pool/pool.component';

@NgModule({
  declarations: [
    AppComponent,
    RouterComponents,
    SafePipe,
    ReturnComponent,
    ReturnCapexComponent,
    ReturnGeneralComponent,
    ViewRevistionAddmoreComponent,
    ViewRevistionReturnComponent,
    ViewRevistionComponent,
    PoolComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    NgxSpinnerModule,
    AppRoutingModule,
    PaginationModule.forRoot(),
    FileUploadModule,
    ProgressbarModule,
    AutosizeModule,
    NgSelectModule,
    ModalModule,
    NgxMaskModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    MsalModule.forRoot(MsalSetting),
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot([PlantEffects]),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    DataTablesModule,
  ],
  providers: [
    Resolver,
    AuthService,
    AuthGuard,
    MsalGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

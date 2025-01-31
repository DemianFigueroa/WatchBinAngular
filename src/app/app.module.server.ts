import { NgModule, DoBootstrap, ApplicationRef } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app.component';

@NgModule({
  imports: [ServerModule],
})
export class AppServerModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef) {
    appRef.bootstrap(AppComponent);
  }
}

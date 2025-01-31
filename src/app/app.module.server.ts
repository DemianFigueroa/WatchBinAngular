import { NgModule, DoBootstrap, ApplicationRef } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app.component'; // Your root component

@NgModule({
  imports: [ // Import your main app module
    ServerModule, // Import Angular's ServerModule
  ],
})
export class AppServerModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef) {
    appRef.bootstrap(AppComponent); // Manually bootstrap the root component
  }
}
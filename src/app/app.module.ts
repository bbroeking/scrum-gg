import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { ClipboardModule } from "ngx-clipboard";

/* Firebase */
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
// import "firebase/auth";
import "firebase/database";

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import { environment } from "../environments/environment";

// /* Material Components */
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material/material.module";

/* Routes, Components */
import { Routes, RouterModule } from "@angular/router";
import { OrganizerComponent } from "./organizer/organizer.component";
import { SessionComponent } from "./session/session.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { HeaderComponent } from "./header/header.component";

const appRoute: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomepageComponent },
  { path: "organizer", component: OrganizerComponent },
  { path: "session/:id", component: SessionComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoute
      // { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    BrowserAnimationsModule,
    MaterialModule, // Adds Angular Material to the project
    FormsModule,
    ClipboardModule,
    AngularFireModule.initializeApp(environment.firebase, "scrumpokergg") // imports firebase/app needed for everything
  ],
  providers: [AngularFireDatabase],
  declarations: [
    AppComponent,
    HomepageComponent,
    OrganizerComponent,
    SessionComponent,
    HeaderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {}
}

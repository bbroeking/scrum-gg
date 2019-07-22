import { Component, OnInit, Input, Inject } from "@angular/core";
import {
  AngularFireDatabase,
  AngularFireObject,
  AngularFireAction
} from "@angular/fire/database";
import { Observable, Subject } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-organizer",
  templateUrl: "./organizer.component.html",
  styleUrls: ["./organizer.component.css"]
})
export class OrganizerComponent implements OnInit {
  // Pass Session Name
  @Input() sessionName: string = "";
  // Session and User Info
  sessionId: string;
  userId: string;
  sessionRef: AngularFireObject<any>;
  userRef: AngularFireObject<any>;
  // rxjs variabels
  size$: Subject<string | null>;
  items$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  // Get keys and payload
  keys: string[];
  payload: any[] = [];
  values: any;
  // Fib Values
  fibonacci: number[] = [0, 1, 2, 3, 5, 8, 13, 20];
  showVote: boolean = true;
  link: string;

  constructor(
    private db: AngularFireDatabase,
    private router: Router,
    @Inject(DOCUMENT) private document
  ) {
    this.sessionId = String(Math.floor(100000 + Math.random() * 900000));
    this.userId = String(Math.floor(100000 + Math.random() * 900000));
    this.sessionRef = db.object(this.sessionId);
    this.userRef = db.object(this.sessionId + "/" + this.userId);
    // this.link = "http://localhost:4200/session/" + this.sessionId;
    this.link = this.document.location.origin + "/session/" + this.sessionId;
    this.setVoter("Organizer");
    // Log voter ids
    this.sessionRef.snapshotChanges().subscribe(action => {
      this.showVote = true;
      this.payload = [];
      this.values = action.payload.val();
      if (this.values != null) {
        this.keys = Object.keys(this.values);
        this.keys.forEach(key => {
          if (key == "sessName") {
            this.sessionName = this.values[key];
          } else {
            this.payload.push(this.values[key]);
            if (!this.values[key].voted) {
              this.showVote = false;
            }
          }
        });
      }
    });
  }

  ngOnInit() {}

  setSession(name: string) {
    this.sessionRef.update({ sessName: name });
  }
  setVoter(name: string) {
    this.userRef.set({ name: name, vote: 0, voted: false });
  }
  updateVote(vote: number) {
    this.userRef.update({ vote: vote, voted: true });
  }
  clearVotes() {
    for (let key in this.keys) {
      this.db
        .object(this.sessionId + "/" + this.keys[key])
        .update({ vote: 0, voted: false });
    }
  }
  showVotes() {
    for (let key in this.keys) {
      this.db
        .object(this.sessionId + "/" + this.keys[key])
        .update({ voted: true });
    }
  }

  copyLink() {
    // Copied from stackoverflow, better way to do this?
    // https://stackoverflow.com/questions/49102724/angular-5-copy-to-clipboard
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = this.link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
  }
  removeUser(item: string) {
    let itemKey: string;
    this.keys.forEach(key => {
      this.values[key]["name"] === item;
      itemKey = key;
    });
    let tempRef: any = this.db.object(this.sessionId + "/" + itemKey);
    tempRef.remove();
  }
}

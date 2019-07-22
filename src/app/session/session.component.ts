import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  AngularFireDatabase,
  AngularFireObject,
  AngularFireAction
} from "@angular/fire/database";
import { Observable, Subject } from "rxjs";

@Component({
  selector: "app-session",
  templateUrl: "./session.component.html",
  styleUrls: ["./session.component.css"]
})
export class SessionComponent implements OnInit {
  // Pass Session Name
  sessionName: string = "";
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
  showVotes: boolean = true;

  constructor(private route: ActivatedRoute, private db: AngularFireDatabase) {
    this.sessionId = this.route.snapshot.paramMap.get("id");
    this.userId = String(Math.floor(100000 + Math.random() * 900000));
    this.sessionRef = db.object(this.sessionId);
    console.log(this.sessionId + "/" + this.userId);
    this.userRef = db.object(this.sessionId + "/" + this.userId);
    // Log voter ids
    this.sessionRef.snapshotChanges().subscribe(action => {
      this.showVotes = true;
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
              this.showVotes = false;
            }
          }
        });
      }
    });
  }

  ngOnInit() {}
  setVoter(name: string) {
    this.userRef.set({ name: name, vote: 0, voted: false });
  }
  updateVote(vote: number) {
    this.userRef.update({ vote: vote, voted: true });
  }
}

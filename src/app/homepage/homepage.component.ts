import { Component, OnInit, Input, Injectable } from "@angular/core";
import { AngularFireObject, AngularFireDatabase } from "@angular/fire/database";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.css"]
})
@Injectable({
  providedIn: "root"
})
export class HomepageComponent implements OnInit {
  ngOnInit(): void {}
  @Input() route: string = "";
  itemRef: AngularFireObject<any>;
  item: Observable<any>;
  constructor(private router: Router, private db: AngularFireDatabase) {
    this.itemRef = db.object("item");
    this.item = this.itemRef.valueChanges();
  }
  save(newName: string) {
    this.itemRef.set({ name: newName });
  }
  update(newSize: string) {
    this.itemRef.update({ size: newSize });
  }
  delete() {
    this.itemRef.remove();
  }
  joinSession() {
    this.router.navigate(["session", this.route]);
  }
}

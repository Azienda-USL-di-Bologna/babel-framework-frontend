import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "prp-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {

  @Input() addToRight: any;
  @Input() appName: string;
  @Input() logoPath: string;

  constructor() {}

  ngOnInit() {
  }

}

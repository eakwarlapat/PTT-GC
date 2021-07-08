import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-max',
  templateUrl: './detail-max.component.html',
  styleUrls: ['./detail-max.component.css']
})
export class DetailMaxComponent implements OnInit {

  constructor() { }

  id: number;
  page = 'detail-max';
  name = 'Initiative Detail Information';

  ngOnInit(): void {
    this.id = Number(sessionStorage.getItem('id'));
    sessionStorage.setItem('page', 'detail-Max');
    this.SetGeneral();
  }

  SetGeneral() {
    if (sessionStorage.getItem('InitiativeValidated') === 'true') { sessionStorage.setItem('InitiativeValidate' , 'true'); }
  }
}

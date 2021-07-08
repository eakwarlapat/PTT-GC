import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-dim',
  templateUrl: './detail-dim.component.html',
  styleUrls: ['./detail-dim.component.css']
})
export class DetailDimComponent implements OnInit {

  constructor() { }

  id: number;
  page = 'detail-dim';
  name = 'Initiative Dim Information';

  ngOnInit(): void {
    this.id = Number(sessionStorage.getItem('id'));
    sessionStorage.setItem('page', 'detail-Dim');
    this.SetGeneral();
  }

  SetGeneral() {
    if (sessionStorage.getItem('InitiativeValidated') === 'true') { sessionStorage.setItem('InitiativeValidate' , 'true'); }
  }

}

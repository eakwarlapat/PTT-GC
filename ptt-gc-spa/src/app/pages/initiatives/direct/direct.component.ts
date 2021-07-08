import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.css']
})
export class DirectComponent implements OnInit {

  constructor() { }

  id: number;
  page = 'direct-capex';
  name = 'Detail Information (Direct CAPEX)';

  ngOnInit(): void {
    this.id = Number(sessionStorage.getItem('id'));
    sessionStorage.setItem('page', 'direct-capex');
    this.SetGeneral();
  }

  SetGeneral() {
    if (sessionStorage.getItem('InitiativeValidated') !== 'true') { sessionStorage.setItem('InitiativeValidate' , 'true'); }
  }
}

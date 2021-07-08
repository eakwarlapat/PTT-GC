import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InitiativeService } from '@services/initiative/initiative.service';
import { ResponseService } from '@errors/response/response.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InformationComponent implements OnInit {

  id: number;

  status: string;
  remark: string;
  stage: string;

  constructor(
    private initiativeService: InitiativeService,
    private response: ResponseService
  ) { }

  ngOnInit(): void {
    this.id = Number(sessionStorage.getItem('id'));
    this.initiativeService.GetInitiative(this.id).subscribe(response => {
      this.status = response.status;
      this.stage  = response.stage;
      this.remark = response.remark ? response.remark : null;
    }, error => this.response.error(error));
  }
}

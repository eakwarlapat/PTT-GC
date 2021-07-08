import { InitiativeService } from '@services/initiative/initiative.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-initiative-information',
  templateUrl: './initiative-information.component.html',
  styleUrls: ['./initiative-information.component.css']
})
export class InitiativeInformationComponent implements OnInit {

  constructor(private initiativeService: InitiativeService) { }

  @Input() id;
  @Input() SubWorkstream1;

  subWorkstream1: string;

  InitiativeDetail = { code : null, stage: null, name: null, year: null, owner: null, organization: null };

  ngOnInit(): void {
    this.GetInformation();
  }

  GetInformation() {
    this.initiativeService.GetInformation(this.id).subscribe((response) => {
      this.InitiativeDetail = {
        stage : response.stage,
        code: response.initiativeCode,
        name: response.name,
        year: response.year,
        owner: response.ownerName,
        organization: response.organization
      };
    });
  }
}

import { Component, OnInit, HostListener } from '@angular/core';
import { RemoveService } from '@services/remove/remove.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainInitiativeComponent implements OnInit {

  constructor(private removeService: RemoveService) { }

  @HostListener('window:beforeunload') RefreshForm() {
    sessionStorage.removeItem('box');
    sessionStorage.removeItem('tab');
    sessionStorage.removeItem('CurrentPageOverview');
    this.removeService.Form();
    this.removeService.Suggestion();
  }

  ngOnInit() {
  }
}

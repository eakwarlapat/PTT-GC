import { Component, EventEmitter, Output, Input, SimpleChanges, OnChanges } from '@angular/core';
import { StageService } from '@services/stage/stage.service';

@Component({
  selector: 'app-history-status',
  templateUrl: './history-status.component.html',
  styleUrls: ['./history-status.component.css']
})
export class HistoryStatusComponent implements OnChanges {

  @Input() id: string;
  @Input() stage: string;
  @Output() modelClose = new EventEmitter();

  constructor(private stageService: StageService) { }

  history: any = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.stage.firstChange) {
      this.stageService.GetHistoryStatus(this.id, { stage : this.stage}).subscribe((response) => {
        this.history = response;
      });
    }
  }

  CloseModal() {
    this.modelClose.emit();
  }

}

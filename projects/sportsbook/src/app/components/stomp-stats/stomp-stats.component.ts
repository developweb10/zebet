import { Component, Input, ViewChild, TemplateRef } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { LiveDocService, CallCenterStats } from '@livedoc';

@Component({
  selector: 'reader-stomp-stats',
  templateUrl: './stomp-stats.component.html',
  styleUrls: ['./stomp-stats.component.scss']
})
export class StompStatsComponent {

  @Input() badgeColor: 'primary' | 'accent' | 'warn' | '' = 'warn';

  @ViewChild('statsDialog') statsDialog: TemplateRef<CallCenterStats>;

  callCenterStats: CallCenterStats;

  constructor(
    private dialog: MatDialog,
    liveDocService: LiveDocService
  ) {
    liveDocService.connectionStatistics.subscribe(stats => this.callCenterStats = stats);
  }

  showFullStats() {
    this.dialog.open(this.statsDialog);
  }

}

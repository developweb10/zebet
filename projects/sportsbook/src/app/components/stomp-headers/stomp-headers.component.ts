import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { transition, trigger, animate, keyframes, style } from '@angular/animations';

interface StompHeader {
  key: string;
  value: string;
  jitters?: number;
}


@Component({
  selector: 'reader-stomp-headers',
  templateUrl: './stomp-headers.component.html',
  styleUrls: ['./stomp-headers.component.scss'],
  animations: [
    trigger('jitter', [
      transition(':increment', [
        animate('400ms', keyframes([
          style({transform: 'translate3d(0, 0, 0)', offset: 0}),
          style({transform: 'translate3d(-10px, 0, 0)', offset: .2}),
          style({transform: 'translate3d(10px, 0, 0)', offset: .4}),
          style({transform: 'translate3d(-10px, 0, 0)', offset: .6}),
          style({transform: 'translate3d(10px, 0, 0)', offset: .8}),
          style({transform: 'translate3d(0, 0, 0)', offset: 1}),
        ]))
      ])
    ])
  ]
})
export class StompHeadersComponent implements OnInit {

  @Input()
  set defaultHeaders(h: {[key: string]: string}) {
    this.standbyHeaders = this.stompHeaders.concat(this.standbyHeaders);
    this.stompHeaders = Object.entries(h || {}).reduce((headers, [key, value]) => headers.concat({key, value}), []);
    this.emitNewHeaders();
  }
  @Output() headers = new EventEmitter<{[key: string]: string}>();

  stompHeaders: StompHeader[] = [];

  standbyHeaders: StompHeader[] = [
    {key: 'X-Top', value: '20'},
    {key: 'X-Lang', value: 'Serbian' },
    {key: 'X-Lang', value: 'Russian'},
    {key: 'X-SortBy', value: 'Date'},
    {key: 'X-SortByOrder', value: 'Ascending'},
    {key: 'X-SortByOrder', value: 'Descending'},
    {key: 'X-Brands', value: 'Nike,Adidas'},
  ];

  headerTitleControl = new FormControl('');
  headerValueControl = new FormControl('');

  editorJitterCount = 0;

  ngOnInit() {
    this.headers.emit();
    this.standbyHeaders.forEach(header => header.jitters = 0);
    this.standbyHeaders.forEach(header => header.jitters = 0);
  }

  emitNewHeaders() {
    const newHeaders = this.stompHeaders
      .reduce((headers, {key, value}) => Object.defineProperty(headers, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true,
      }), {});

    this.headers.emit(newHeaders);
  }

  removeStandby(header: StompHeader) {
    this.standbyHeaders = this.standbyHeaders.filter(h => h !== header);
  }

  removeHeader(header: StompHeader) {
    this.stompHeaders = this.stompHeaders.filter(h => h !== header);
    this.emitNewHeaders();
  }

  addHeader() {
    const key = this.headerTitleControl.value.trim();
    const value = this.headerValueControl.value.trim();

    this.headerTitleControl.reset('');
    this.headerValueControl.reset('');

    const similarHeader = this.stompHeaders.find(header => header.key === key);
    if ( similarHeader ) {
      similarHeader.value = value;
      similarHeader.jitters = typeof similarHeader.jitters === 'number' ? ++ similarHeader.jitters : 0;
    } else {
      const newHeader = {key, value, jitters: 0};
      this.stompHeaders.unshift(newHeader);
      setTimeout(() => ++newHeader.jitters);
    }

    this.standbyHeaders = this.standbyHeaders.filter(h => h.key !== key);

    this.emitNewHeaders();
    return true;
  }

  headerMoved(event: CdkDragDrop<StompHeader[]>) {
    if ( event.previousContainer === event.container ) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }

    this.emitNewHeaders();
  }

  editHeader(header: StompHeader) {
    this.headerTitleControl.setValue(header.key);
    this.headerValueControl.setValue(header.value);
    ++this.editorJitterCount;
  }

}

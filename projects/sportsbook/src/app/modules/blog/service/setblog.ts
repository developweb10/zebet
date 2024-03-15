import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private itemData: any;

  constructor() {}

  setItemData(data: any) {
    this.itemData = data;
  }

  getItemData() {
    return this.itemData;
  }
}

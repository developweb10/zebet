import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  @Input() isDataExists = true;


  Data = [
    {
      fav: "star-active.png",
      group: "UEFA - Europe Conference League",
      data:
      [
        {
          fav: 'star-active.png',
          favtxt: '40\'',
          name1: 'NOTTINGHAM FOREST',
          name2: 'SHEFFIELD UNITED',
          count1: '2',
          count2: '3',
          data1: '1.72',
          data2: '3.76',
          data3: '4.01'
        }
      ]
    },
    {
      fav: "star-1615.png",
      group: "POLAND - III LIGA, GROUP 3",
      data:
      [
        {
          fav: 'star-active.png',
          favtxt: '40\'',
          name1: 'RAKOW II CZESTOCHOWA',
          name2: 'MKP CARINA GUBIN',
          count1: '2',
          count2: '3',
          data1: '1.72',
          data2: '3.76',
          data3: '4.01'
        },
        {
          fav: 'star-active.png',
          favtxt: '40\'',
          name1: 'RAKOW II CZESTOCHOWA',
          name2: 'MKP CARINA GUBIN',
          count1: '2',
          count2: '3',
          data1: '1.72',
          data2: '3.76',
          data3: '4.01'
        },
        {
          fav: 'star-active.png',
          favtxt: '40\'',
          name1: 'RAKOW II CZESTOCHOWA',
          name2: 'MKP CARINA GUBIN',
          count1: '2',
          count2: '3',
          data1: '1.72',
          data2: '3.76',
          data3: '4.01'
        },
        {
          fav: 'star-active.png',
          favtxt: '40\'',
          name1: 'RAKOW II CZESTOCHOWA',
          name2: 'MKP CARINA GUBIN',
          count1: '2',
          count2: '3',
          data1: '1.72',
          data2: '3.76',
          data3: '4.01'
        },
      ]
    },
    {
      fav: "star-active.png",
      group: "UEFA - Europe League",
      data:
      [
        {
          fav: 'star-active.png',
          favtxt: '40\'',
          name1: 'LIVERPOOL FC',
          name2: 'AFC BOURNEMOUTH',
          count1: '2',
          count2: '3',
          data1: '1.72',
          data2: '3.76',
          data3: '4.01'
        },
        {
          fav: 'star-active.png',
          favtxt: '40\'',
          name1: 'WOLVERHAMPTON WANDERERS',
          name2: 'BRIGHTON & HOVE ALBION',
          count1: '2',
          count2: '3',
          data1: '1.72',
          data2: '3.76',
          data3: '4.01'
        }
      ]
    },
  ];
}

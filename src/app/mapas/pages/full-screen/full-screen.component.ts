import { Component, OnInit } from '@angular/core';
import * as mapboxgl  from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles:[`
    #mapa {
      width: 100%;
      height: 100%;
      
    }
  `]
})
export class FullScreenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    var map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-96.71666155074296, 17.076572614188542],
      zoom: 18
    });

  }

}

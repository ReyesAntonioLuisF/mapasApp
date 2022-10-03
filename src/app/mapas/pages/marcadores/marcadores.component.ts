import { Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro ?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`
    .mapa-container {
      width: 100%;
      height: 100%;
    }

    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
    }

    li {
      cursor: pointer
    }
  `]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef
  mapa!: mapboxgl.Map;
  nivelZoom: number = 15;
  center: [number,number] = [-96.71666155074296, 17.076572614188542]

  //Arreglo de marcadores
  marcadores: MarcadorColor[] = [];
  constructor() { }

  ngAfterViewInit(): void {
    console.log('onInit', this.divMapa);
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.nivelZoom
    })

    this.leerLocalStorage();
    //const markerHtml: HTMLElement = document.createElement('div');
    //markerHtml.innerHTML = 'Hola mundo'

    //const marker = new mapboxgl.Marker({element: markerHtml})
      //.setLngLat(this.center)
      //.addTo(this.mapa)
  }

  agregarMarcador(){
    const color = '#xxxxxx'.replace(/x/g, y => (Math.random()*16|0).toString(16))
    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    })
    .setLngLat(this.center)
    .addTo(this.mapa)

    this.marcadores.push({
      color,
      marker: nuevoMarcador
    })

    this.guardarMarcadoresLocalStorage();
    
    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    })
  }

  irMarcador(marcador: mapboxgl.Marker){
    //const {lng, lat} = marcador.getLngLat()
    this.mapa.flyTo({center: marcador.getLngLat() })
  }

  guardarMarcadoresLocalStorage(){
    const lngLatArr: MarcadorColor[] = [];
    this.marcadores.forEach( m => {
      const color = m.color;
      const {lng, lat} = m.marker!.getLngLat();

      lngLatArr.push({
        color: color,
        centro: [lng, lat]
      })
    })

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr))
  }

  leerLocalStorage(){
    if( !localStorage.getItem('marcadores')){
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!)

    lngLatArr.forEach( m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
        .setLngLat(m.centro!)
        .addTo(this.mapa)

      this.marcadores.push({
        marker: newMarker,
        color: m.color
      })

      newMarker.on('dragend', (number) => {
        this.guardarMarcadoresLocalStorage();
      })
    })
  }

  borrarMarcador(id: number){
    this.marcadores[id].marker?.remove();
    this.marcadores.splice(id, 1);
    this.guardarMarcadoresLocalStorage()
  }
}

import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../App.css';
import token from '../tokens.json';

mapboxgl.accessToken = token.mapbox;
let map = null;
let currentlayers = 0;

class Map extends Component{
  componentDidMount(){
    map = new mapboxgl.Map({
      container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v10',
        center: this.props.lnglat,
        zoom: this.props.zoom
    })
    .addControl(new mapboxgl.NavigationControl())
    .on('move', () =>{
        let coord = map.getCenter();
        this.setState({
            lnglat: [coord.lng, coord.lat]
        });
      })
    .on('zoom', () =>{
      this.setState({
        zoom: map.getZoom()
      });
    })
    .on('load', () =>{
      if(this.props.shuttles != null && this.props.shuttles.length != currentlayers && map != null)
      for (const shuttle in this.props.shuttles) {
        if (this.props.shuttles.hasOwnProperty(shuttle)) {
          const element = this.props.shuttles[shuttle];
          let parsedstops = this.parseStops(element.stops)
          let parsedroutes = this.parseRoutes(element.routes)
          console.log(parsedroutes)
          this.addShuttleStop(element.id.toString(), element.name, parsedstops);
          this.addShuttleRoute(element.id.toString(), element.name, parsedroutes);
          currentlayers++;
        }
      }
    });
  }

  parseStops(stops){
    let parsedstops = []
    for (const stop in stops) {
      let latlong = [];
      if (stops.hasOwnProperty(stop)) {
        const element = stops[stop];
        console.log(element);
        latlong.push(element.latitude);
        latlong.push(element.longitude);
        parsedstops.push(latlong);
      }
    }
    return parsedstops;
  }

  parseRoutes(routes){
    let parsedroutes = []
    for (const route in routes) {
      let latlong = [];
      if (routes.hasOwnProperty(route)) {
        const element = routes[route];
        console.log(element);
        latlong.push(element.latitude);
        latlong.push(element.longitude);
        parsedroutes.push(latlong);
      }
    }
    return parsedroutes;
  }

  addShuttleStop(id, name, stops){
    map.addLayer({
      "id": `${id}-stop`,
      "type": "symbol",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
            "geometry": {
              "type": "MultiPoint",
              "coordinates": stops
            },
            "properties": {
              "title": `${name} stop`,
              "icon": "bus"
            }
        }
      },
      "layout": {
        "icon-image": "{icon}-15",
        "text-field": "{title}",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 0.6],
        "text-anchor": "top"
      }
    });
  }

  addShuttleRoute(id, name, routes){
    console.log("routes:" + routes);
    map.addLayer({
      "id": `${id}-route`,
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": routes
          }
        }
      },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#F00",
        "line-width": 4
      }
    });
  }

  render(){
    return <div className='Map' ref={el => this.mapContainer = el}/>
  }
}

export default Map;

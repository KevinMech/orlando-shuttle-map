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
    });
  }

  
  componentDidUpdate(prevProps, prevState) {
    // Check to see if prop is available and whether the amount of buses has changed
    if(this.props.shuttles != null && this.props.shuttles.length != currentlayers && map != null)
      for (const shuttle in this.props.shuttles) {
        if (this.props.shuttles.hasOwnProperty(shuttle)) {
          const element = this.props.shuttles[shuttle];
          let parsedstops = this.parseStops(element.stops)
          this.addShuttleStop(element.id.toString(), element.name, parsedstops);
          currentlayers++;
        }
      }
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

  addShuttleStop(id, name, stops){
    map.addLayer({
      "id": id,
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

  render(){
    return <div className='Map' ref={el => this.mapContainer = el}/>
  }
}

export default Map;

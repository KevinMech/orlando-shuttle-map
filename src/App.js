import React, { Component } from 'react';
import ReactMapBoxGl, {Feature} from 'react-mapbox-gl';
import './App.css';
import busroutes from './config/busroutes.json';
import Header from './components/header.js';
import MapArea from './components/maparea.js';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      lnglat: [-81.37923649999999, 28.5383355],
      zoom: 15,
      busstops: [],
      busroutes: []
    }

    //Enum for our generateRenderedElements function
    this.Generate = {
      BusStops: 'MultiPoint',
      BusRoutes: 'LineString'
    }
  }

  componentDidMount(){
    this.generateRenderedElements(this.Generate.BusStops);
  }

  
  //Generate all the Rendered DOM elements such as bus stops and bus routes that will appear on the map
  generateRenderedElements(){
    const features = busroutes.features;

    let id = 0;
    let stops = [];
    let routes = [];
    for(let x = 0; x < features.length; x++){
      //If feature is a multipoint, parse all the coordinates into a seperate DOM Element
      if(features[x].geometry.type === 'MultiPoint'){
        for(let y = 0; y < features[x].geometry.coordinates.length; y++){
          stops.push(<Feature key={id} properties={features[x].properties.name} coordinates={features[x].geometry.coordinates[y]}/>);
        }
      }
      //For Linestrings, all coordinates assosciated with feature are stored into one DOM element
      else if(features[x].geometry.type === 'LineString'){
        routes.push(<Feature key={id} properties={features[x].properties.name} coordinates={features[x].geometry.coordinates}/>);
      }
      id++;
    }

    this.setState({
      busstops: stops,
      busroutes: routes
    });
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <MapArea lnglat={this.state.lnglat} zoom={this.state.zoom} busstops={this.state.busstops} busroutes={this.state.busroutes}/>
      </div>
    );
  }
}

export default App;

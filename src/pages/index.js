import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import L from "leaflet";
import { useMap } from "react-leaflet";

import axios from 'axios';          // part 1
import { useTracker } from 'hooks';    // part 2
import { commafy, friendlyDate } from 'lib/util';    // part 2

import Layout from "components/Layout";
import Container from "components/Container";
import Map from "components/Map";
import Snippet from "components/Snippet";

const LOCATION = {
  lat: 0,
  lng: 0,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;



const IndexPage = () => {
  const [visible, setVisible] = useState(true) // true is the initial state

  const { data: countries = [] } = useTracker({
    api: 'countries'
  });
  const hasCountries = Array.isArray(countries) && countries.length > 0;

  console.log('@WILL -- warning: countries is null');
  if (countries) { 
    console.log('@WILL -- countries.length is: ', countries.length); 
  }

  const { data: stats = {} } = useTracker({ api: 'all' });
  
  const dashboardStats = [
    { primary:   { label: 'Total Cases',   value: commafy(stats?.cases) },
      secondary: { label: 'Total Cases Per 1 Million', value: commafy(stats?.casesPerOneMillion) }
    },
    { primary:   { label: 'Total Deaths',  value: commafy(stats?.deaths) },
      secondary: { label: 'Total Deaths Per 1 Million', value: commafy(stats?.deathsPerOneMillion) }
    },
    { primary:   { label: 'Total Tests',   value: commafy(stats?.tests) },
      secondary: { label: 'Total Tests Per 1 Million', value: commafy(stats?.testsPerOneMillion) }
    }
  ];

  const dashboardStatsToday = [
    { primary:   { label: 'Total Cases Today',   value: commafy(stats?.todayCases) },
    },
    { primary:   { label: 'Total Deaths Today',  value: commafy(stats?.todayDeaths) },
    }
  ];

  const dashboardStatsRecovered = [
    { primary:   { label: 'Total Recovered',   value: commafy(stats?.recovered) },
    },
    { primary:   { label: 'Total Recovered per 1 Million',  value: commafy(stats?.recoveredPerOneMillion) },
    },
    { primary:   { label: 'Total Recovered Today',   value: commafy(stats?.todayRecovered) },
    }
  ];
  

  async function mapEffect(map) { 
    // if (!hasCountries) { 
    //   console.log('@WILL: returning -- hasCountries is false');
    //   return; 
    // }    // part 2

    let response;            // part 1
    console.log('MapEffect automatically called, calling axios.get()');

    try { 
      response = await axios.get('https://corona.lmao.ninja/v2/countries');
    } catch(e) { 
      console.log('Failed to fetch countries: ${e.message}', e);
      return;
    }

    // const { countries = [] } = response;  // part 2
    // console.log(countries);
    const { data = [] } = response;   // part 1
    console.log(data);

    // const hasData = Array.isArray(countries) && countries.length > 0;  // part 2
    // if ( !hasData ) return;

    const hasData = Array.isArray(data) && data.length > 0;  // part 1
    if ( !hasData ) return;
    
    const geoJson = {
      type: 'FeatureCollection',
      // features: countries.map((country = {}) => {    // part 2
      features: data.map((country = {}) => {      // part 1
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;
        return {
          type: 'Feature',
          properties: {
            ...country,
          },
          geometry: {
            type: 'Point',
            coordinates: [ lng, lat ]
          }
        }
      })
    }

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;
    
        const {
          country,
          updated,
          cases,
          deaths,
          recovered
        } = properties
    
        casesString = `${cases}`;
    
        if ( cases > 1000 ) {
          casesString = `${casesString.slice(0, -3)}k+`
        }
    
        if ( updated ) {
          updatedFormatted = new Date(updated).toLocaleString();
        }
    
        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${country}</h2>
              <ul>
                <li><strong>Confirmed:</strong> ${cases}</li>
                <li><strong>Deaths:</strong> ${deaths}</li>
                <li><strong>Recovered:</strong> ${recovered}</li>
                <li><strong>Last Update:</strong> ${updatedFormatted}</li>
              </ul>
            </span>
            ${ casesString }
          </span>
        `;
      
        return L.marker( latlng, {
          icon: L.divIcon({
            className: 'icon',
            html
          }),
          riseOnHover: true
        });
      }
    });
    console.log('@WILL -- about to complete geoJson');
    console.log(geoJson);

    geoJsonLayers.addTo(map);
  };

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: "OpenStreetMap",
    zoom: DEFAULT_ZOOM,
    whenCreated: mapEffect,
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

    <div className="tracker">
      <Map {...mapSettings} />

      <div>
      <button onClick={() => setVisible(!visible)}>Toggle World and Per Population</button>
    
      { visible &&
      <div className="tracker-stats">
        <ul>
          { dashboardStats.map(({ primary = {}, secondary = {} }, i ) => {
            return (
              <li key={`Stat-${i}`} className="tracker-stat">
              { primary.value && (
                <p className="tracker-stat-primary">
                  { primary.value }
                  <strong> { primary.label } </strong>
                </p>
              ) }
              { secondary.value && (
                <p className="tracker-stat-secondary">
                  { secondary.value } 
                  <strong> { secondary.label } </strong>
                </p>
              ) }
            </li>   
          );  
        }) }
      </ul>        
    </div>
    }
    {!visible &&
    <div className="tracker-stats">
        <ul>
          { dashboardStats.map(({ primary = {}, secondary = {} }, i ) => {
            return (
              <li key={`Stat-${i}`} className="tracker-stat">
              { secondary.value && (
                <p className="tracker-stat-primary">
                  { secondary.value }
                  <strong> { secondary.label } </strong>
                </p>
              ) }
              { primary.value && (
                <p className="tracker-stat-secondary">
                  { primary.value } 
                  <strong> { primary.label } </strong>
                </p>
              ) }
            </li>   
          );  
        }) }
      </ul>        
    </div>   
    }
    </div>

  </div> 
  <div className="tracker">
      <div className="tracker-stats">
        <ul>
          { dashboardStatsToday.map(({ primary = {}}, i ) => {
            return (
              <li key={`Stat-${i}`} className="tracker-stat">
              { primary.value && (
                <p className="tracker-stat-primary">
                  { primary.value }
                  <strong> { primary.label } </strong>
                </p>
              ) }
            </li>   
          );  
        }) }
      </ul>        
    </div>             
  </div> 
  <div className="tracker">
      <div className="tracker-stats">
        <ul>
          { dashboardStatsRecovered.map(({ primary = {}}, i ) => {
            return (
              <li key={`Stat-${i}`} className="tracker-stat">
              { primary.value && (
                <p className="tracker-stat-primary">
                  { primary.value }
                  <strong> { primary.label } </strong>
                </p>
              ) }
            </li>   
          );  
        }) }
      </ul>        
    </div>             
  </div> 
  <div className="tracker-last-updated">
    <p>Last Updated: { stats ? friendlyDate( stats?.updated ) : '-' } </p>
  </div>




  <Container type="content" className="text-center home-start"> 

  <div class="row">
  <div class="column">
<h3>Worldwide Recovery Stats</h3>
  <table class="table" id="dataTable2">
  <thead>
    <th>Stats </th>
    <th>Total Recoveries</th>
  </thead>
  <tbody>
    <tr>
      <td>Recoveries Worldwide</td>
      <td>{commafy(stats?.recovered)}</td>
    </tr>
    <tr>
      <td>Worldwide Recoveries Per One Million</td>
      <td>{commafy(stats?.recoveredPerOneMillion)}</td>
    </tr>
    <tr>
      <td>Worldwide Recoveries Today</td>
      <td>{commafy(stats?.todayRecovered)}</td>
    </tr>
  </tbody>
</table>
</div>

<div class="column">
<h3>Worldwide Cases Stats</h3>
  <table class="table" id="dataTable2">
  <thead>
    <th>Stats </th>
    <th>Total Cases</th>
  </thead>
  <tbody>
    <tr>
      <td>Cases Worldwide</td>
      <td>{commafy(stats?.cases)}</td>
    </tr>
    <tr>
      <td>Worldwide Cases Per One Million</td>
      <td>{commafy(stats?.casesPerOneMillion)}</td>
    </tr>
    <tr>
      <td>Worldwide Cases Today</td>
      <td>{commafy(stats?.todayCases)}</td>
    </tr>
  </tbody>
</table>
</div>
</div>

    </Container>
  </Layout>
  );
};

export default IndexPage;
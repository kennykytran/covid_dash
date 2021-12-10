import React, { useEffect } from "react";
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
  lat: 34.0522,
  lng: -118.2437,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;


const IndexPage = () => {
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
      secondary: { label: 'Per 1 Million', value: commafy(stats?.casesPerOneMillion) }
    },
    { primary:   { label: 'Total Deaths',  value: commafy(stats?.deaths) },
      secondary: { label: 'Per 1 Million', value: commafy(stats?.deathsPerOneMillion) }
    },
    { primary:   { label: 'Total Tests',   value: commafy(stats?.tests) },
      secondary: { label: 'Per 1 Million', value: commafy(stats?.testsPerOneMillion) }
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
    <h3>Country Recovery Stats</h3>
  <table class="table" id="dataTable1">
  <thead>
    <th>Country</th>
    <th>Total Recovered</th>
    <th>Total Recovered per 1 Million</th>
    <th>Total Recovered Today</th>
  </thead>
  <tbody>
    <tr>
      <td>China</td>
      <td>{commafy(countries[42].recovered)}</td>
      <td>{commafy(countries[42].recoveredPerOneMillion)}</td>
      <td>{commafy(countries[42].todayRecovered)}</td>
    </tr>
    <tr>
      <td>India</td>
      <td>{commafy(countries[93].recovered)}</td>
      <td>{commafy(countries[93].recoveredPerOneMillion)}</td>
      <td>{commafy(countries[93].todayRecovered)}</td>
    </tr>
    <tr>
      <td>United States</td>
      <td>{commafy(countries[211].recovered)}</td>
      <td>{commafy(countries[211].recoveredPerOneMillion)}</td>
      <td>{commafy(countries[211].todayRecovered)}</td>
    </tr>
    <tr>
      <td>Indonesia</td>
      <td>{commafy(countries[94].recovered)}</td>
      <td>{commafy(countries[94].recoveredPerOneMillion)}</td>
      <td>{commafy(countries[94].todayRecovered)}</td>
    </tr>
    <tr>
      <td>Pakistan</td>
      <td>{commafy(countries[151].recovered)}</td>
      <td>{commafy(countries[151].recoveredPerOneMillion)}</td>
      <td>{commafy(countries[151].todayRecovered)}</td>
    </tr>
    <tr>
      <td>Brazil</td>
      <td>{commafy(countries[26].recovered)}</td>
      <td>{commafy(countries[26].recoveredPerOneMillion)}</td>
      <td>{commafy(countries[26].todayRecovered)}</td>
    </tr>
    <tr>
      <td>Nigeria</td>
      <td>{commafy(countries[148].recovered)}</td>
      <td>{commafy(countries[148].recoveredPerOneMillion)}</td>
      <td>{commafy(countries[148].todayRecovered)}</td>
    </tr>
    <tr>
      <td>Bangladesh</td>
      <td>{commafy(countries[15].recovered)}</td>
      <td>{commafy(countries[15].recoveredPerOneMillion)}</td>
      <td>{commafy(countries[15].todayRecovered)}</td>
    </tr>
    <tr>
      <td>Russia</td>
      <td>{commafy(countries[163].recovered)}</td>
      <td>{commafy(countries[163].recoveredPerOneMillion)}</td>
      <td>{commafy(countries[163].todayRecovered)}</td>
    </tr>
    <tr>
      <td>Mexico</td>
      <td>{commafy(countries[131].recovered)}</td>
      <td>{commafy(countries[131].recoveredPerOneMillion)}</td>
      <td>{commafy(countries[131].todayRecovered)}</td>
    </tr>
  </tbody>
</table>
</div>

<div class="column">
<h3>Country Cases Stats</h3>
  <table class="table" id="dataTable2">
  <thead>
    <th>Country</th>
    <th>Total Cases</th>
    <th>Total Cases per 1 Million</th>
    <th>Total Cases Today</th>
  </thead>
  <tbody>
    <tr>
      <td>China</td>
      <td>{commafy(countries[42].cases)}</td>
      <td>{commafy(countries[42].casesPerOneMillion)}</td>
      <td>{commafy(countries[42].todayCases)}</td>
    </tr>
    <tr>
      <td>India</td>
      <td>{commafy(countries[93].cases)}</td>
      <td>{commafy(countries[93].casesPerOneMillion)}</td>
      <td>{commafy(countries[93].todayCases)}</td>
    </tr>
    <tr>
      <td>United States</td>
      <td>{commafy(countries[211].cases)}</td>
      <td>{commafy(countries[211].casesPerOneMillion)}</td>
      <td>{commafy(countries[211].todayCases)}</td>
    </tr>
    <tr>
      <td>Indonesia</td>
      <td>{commafy(countries[94].cases)}</td>
      <td>{commafy(countries[94].casesPerOneMillion)}</td>
      <td>{commafy(countries[94].todayCases)}</td>
    </tr>
    <tr>
      <td>Pakistan</td>
      <td>{commafy(countries[151].cases)}</td>
      <td>{commafy(countries[151].casesPerOneMillion)}</td>
      <td>{commafy(countries[151].todayCases)}</td>
    </tr>
    <tr>
      <td>Brazil</td>
      <td>{commafy(countries[26].cases)}</td>
      <td>{commafy(countries[26].casesPerOneMillion)}</td>
      <td>{commafy(countries[26].todayCases)}</td>
    </tr>
    <tr>
      <td>Nigeria</td>
      <td>{commafy(countries[148].cases)}</td>
      <td>{commafy(countries[148].casesPerOneMillion)}</td>
      <td>{commafy(countries[148].todayCases)}</td>
    </tr>
    <tr>
      <td>Bangladesh</td>
      <td>{commafy(countries[15].cases)}</td>
      <td>{commafy(countries[15].casesPerOneMillion)}</td>
      <td>{commafy(countries[15].todayCases)}</td>
    </tr>
    <tr>
      <td>Russia</td>
      <td>{commafy(countries[163].cases)}</td>
      <td>{commafy(countries[163].casesPerOneMillion)}</td>
      <td>{commafy(countries[163].todayCases)}</td>
    </tr>
    <tr>
      <td>Mexico</td>
      <td>{commafy(countries[131].cases)}</td>
      <td>{commafy(countries[131].casesPerOneMillion)}</td>
      <td>{commafy(countries[131].todayCases)}</td>
    </tr>
  </tbody>
</table>
</div>
</div>



    <h3>It has  covid stats via markers on our map, and stas shown in a dashboard... lots of fun!</h3>
    </Container>
  </Layout>
  );
};

export default IndexPage;
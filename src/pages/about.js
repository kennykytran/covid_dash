import React from "react";
import { Helmet } from "react-helmet";

import { useSiteMetadata } from "hooks";

import Layout from "components/Layout";
import Container from "components/Container";

const SecondPage = () => {
  const { companyName, companyUrl, authorName, authorUrl, siteDescription } =
    useSiteMetadata();

  return (
    <Layout pageName="about">
      <Helmet>
        <title>About</title>
      </Helmet>
      <Container type="content">
        <h1>About</h1>

        <h2>{companyName}</h2>
        <p class = "innerPara">{siteDescription}</p>
        <p class = "innerPara">
          <a href={companyUrl}>View on Github</a>
        </p>

        <h2>Created By</h2>
        <p class = "innerPara">
          <a href={authorUrl}>{authorName}</a>
        </p>

        <p class = "innerPara">
            Kenny Tran
        </p>
        <p class = "innerPara">
            Brian Lucero
        </p>
        <p class = "innerPara">
            Kevin Espinoza
        </p>
        <p class = "innerPara">
            Andres Jaramillo
        </p>


        <h2>API Sources</h2>
        <p class = "innerPara">
        <a href = "https://www.worldometers.info/coronavirus/">Worldometers</a>
        </p>

        <p class = "innerPara">
        <a href = "https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series">CSSEGISandData</a>
        </p>

        <p class = "innerPara">
        <a href = "https://github.com/nytimes/covid-19-data">nytimes</a>
        </p>

        <p class = "innerPara">
        <a href = "https://github.com/ActiveConclusion/COVID19_mobility">ActiveConclusion</a>
        </p>

        <p class = "innerPara">
        <a href = "https://www.canada.ca/en/public-health/services/diseases/2019-novel-coronavirus-infection.html">canada.ca</a>
        </p>

        <p class = "innerPara">
        <a href = "https://github.com/pcm-dpc/COVID-19"></a>
        </p>

        <p class = "innerPara">
        <a href = "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Situationsberichte/Gesamt.html">rki.de</a>
        </p>

        <p class = "innerPara">
        <a href = "https://info.gesundheitsministerium.at/">gesundheitsministerium</a>
        </p>

        <p class = "innerPara">
        <a href = "https://www.mohfw.gov.in/">mohfw.gov</a>
        </p>

        <p class = "innerPara">
        <a href = "https://covid19.ncdc.gov.ng/">covid19.ncdc</a>
        </p>

        <p class = "innerPara">
        <a href = "https://github.com/openZH/covid_19/">openZH</a>
        </p>

        <p class = "innerPara">
        <a href = "https://coronavirus.data.gov.uk">coronavirus.data.gov.uk</a>
        </p>

        <p class = "innerPara">
        <a href = "https://covid19.go.id">covid19.go.id</a>
        </p>

        <p class = "innerPara">
        <a href = "https://datadashboard.health.gov.il/COVID-19/general">datadashboard.health.gov.il</a>
        </p>

      </Container>
    </Layout>
  );
};

export default SecondPage;

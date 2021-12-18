# covid_dash

```
CREATING a GATSBY LEAFLET STARTER
(1) gatsby new directory_name
(2) cd directory_name
(3) yarn develop
(4) chrome on localhost:8000    (should see the (gatsby astronaut...)

############## SKIP ##################
(5) download from https://github.com/colbyfayock/gatsby-starter-leaflet
(6) manually replace the file by file, or folder by folder, as appropriate
try to run this again
(7) yarn develop (it fails, it wants sass)
######################################

(8) npm install sass --legacy-peer-deps
and after a few warnings, it will run
(9) yarn add charts.css This is for the chart css files
(10) yarn develop   (one more time, you should now see a gatsby leaflet map, 
                    with an astronaut centered on Washington, D.C.)
                   
                    
https://www.freecodecamp.org/news/how-to-add-coronavirus-covid-19-case-statistics-to-your-map-dashboard-in-gatsby-and-react-leaflet/

lsof -i tcp:8000    to find the pid of a process running on port 8000
kill -9 PID_OF_PROCESS

```

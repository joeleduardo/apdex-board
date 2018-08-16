import express from 'express';
import autoprefixer from 'express-autoprefixer';
import minify from 'express-minify';
import uglifyJs from 'uglify-js';
import json from './public/json/host-app-data.json';
import AppData from './models/AppData';

const app = express();
const data = new AppData(json, 25);

app.set('view engine', 'ejs');
app.use(minify({ uglifyJsModule: uglifyJs }));
app.use(autoprefixer({ browsers: 'last 2 versions', cascade: false }));
app.use(express.static('public'));

// GET TOP "N" APPS BY HOST, SORTED BY APDEX =============================>
// data.getTopAppsByHost(host, limit, init)
//
// host: string (optional) ---> host name (e.g. 7e6272f7-098e.dakota.biz)
// limit: int (optional) ---> how many apps do you want to display
// init: int (optional) ---> from which index do you want to display
//
// e.g. ==================================================================>
//
// data.getTopAppsByHost('128406fc-0d3f.tiana.biz', 0, 5)
//
// =======================================================================>


// ADD NEW APP TO HOST, SORTED BY APDEX ==================================>
// data.addAppToHost(appToAdd);
//
// appToAdd: object (required) ---> object with next props:
// - host: string ---> host name (e.g. 7e6272f7-098e.dakota.biz)
// - version: int ---> version number
// - apDex: int ---> apDex number between 0-100
// - name: string ---> app name
// - contributors: array --> array of contributors (e.g. ['joel', 'new relic'])
// e.g. ==================================>
//
// const appToAdd = {
//   host: '7e6272f7-098e.dakota.biz',
//   version: 5,
//   apDex: 100,
//   name: 'Joel awesome app',
//   contributors: ['Joel Ortiz']
// };
//
// const appsByHostAfterAdd = data.addAppToHost(appToAdd);
//
// ====================================>
// console.log('APPS AFTER ADD NEW APP TO HOST ===================================================>\n', appsByHostAfterAdd);
// console.log('APPS TOTAL AFTER ADD NEW APP TO HOST: ', appsByHostAfterAdd.apps.length);
// =======================================================================>

// ADD NEW APP TO HOST, SORTED BY APDEX ==================================>
// data.removeAppFromHost(host, index);
//
// host: string (required) ---> host name (e.g. 7e6272f7-098e.dakota.biz)
// index: int (required) ---> index of item that you want delete
//
// e.g. ==================================================================>
//
// const appsByHostAfterDelete = data.removeAppFromHost('128406fc-0d3f.tiana.biz', 0);
//
// =======================================================================>
// console.log('APPS AFTER DELETE A APP FROM HOST ================================================>\n', appsByHostAfterDelete);
// console.log('APPS TOTAL AFTER DELETE APP FROM HOST: ', appsByHostAfterDelete.apps.length);

app.get('/', function(req, res) {
  res.render('index', { data: data.topAppsByHost });
});

app.listen(8080, () => console.log('Let`s start!!'));

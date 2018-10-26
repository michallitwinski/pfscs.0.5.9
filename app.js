var express = require('express');
var path = require('path');
var app = express();

// Wskazanie silnika templatów (ejs)
app.set('view engine','ejs');
//Routes i przekierowanie do publicznych
var routes = require('./routes');
app.use(express.static(path.join(__dirname, 'public')));

// Lokalna / globalna zmienna zawierająca nr wersji pobrany z package.json
var packJson = require('./package.json');
app.locals.app_ver = packJson.version; // przekazuje versję programu z package.json

//Start
app.get('/', routes.home);
//Kalkulator
app.get('/kalkulator', routes.kalkulator);
app.get('/papierosy', routes.papierosy);
app.get('/tyton', routes.tyton);
app.get('/susz', routes.susz);
app.get('/spirytus', routes.spirytus);
app.get('/wodka', routes.wodka);
//wyliczanie zspólnych należności
app.get('/zlicz', routes.zlicz);
//pojazdy
app.get('/pojazdy', routes.pojazdy);
// Przesyłanie stawek w pliku jason
app.get('/stawki/:rok?', routes.wysylanieStawek);
//Sent
app.get('/sent', routes.sent);
//Kw-kks
app.get('/kw-kks', routes.kw_kks);
app.get('/kw', routes.kw);
app.get('/kks', routes.kks);
//Transport
app.get('/transport', routes.transport);

//Edytowalne protokoły
app.get('/protar', routes.protar);
app.get('/proogl', routes.proogl);
app.get('/kalkspis', routes.kalkspis);

//notFound
app.get('*', routes.notFound);

//Server
app.listen(process.env.PORT || 3000);
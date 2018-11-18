//pobranie pliku jason do zmiennej
var techJson = require('../data/technology.json');
var calcJson = require('../data/kalkulator.json');
//pobieranie tabeli z wcześniej pobranej zmiennej
var kalkulator = calcJson.kalkulator; // przekazuje pozycje kalukatra
var stawkiLata = calcJson.stawki; //przekazuje aplikacji lata stawek
var kodyKreskowe = calcJson.kodyKreskowe; //przekazywanie kodów kreskowych
// przesyłanie do templatóów najnowszych stawek
var stawkiJson = require('../data/stawki' + stawkiLata[0] + '.json');
var stawki = stawkiJson.stawki;
//Start
exports.home = function (req, res) {
    // przekazywanie zmiennych do ścieżki
    var tech = techJson.techchnology;
    res.render("home", {
        tech: tech,
    });
};
//Kalkulator
exports.kalkulator = function (req, res) {
    res.render("kalkulator", {
        kalkulator_typ: "intro",
        kalkulator: kalkulator,
    });
};
exports.papierosy = function (req, res) {
    res.render("kalkulator", {
        kalkulator_typ: "papierosy",
        kalkulator: kalkulator,
        stawkiLata: stawkiLata,
        stawki: stawki,
        kodyKreskowe: kodyKreskowe,
    });
};
exports.tyton = function (req, res) {
    res.render("kalkulator", {
        kalkulator_typ: "tyton",
        kalkulator: kalkulator,
        stawkiLata: stawkiLata,
        stawki: stawki,
        kodyKreskowe: kodyKreskowe,
    });
};
exports.susz = function (req, res) {
    res.render("kalkulator", {
        kalkulator_typ: "susz",
        kalkulator: kalkulator,
        stawkiLata: stawkiLata,
        stawki: stawki,
        kodyKreskowe: kodyKreskowe,
    });
};
exports.spirytus = function (req, res) {
    res.render("kalkulator", {
        kalkulator_typ: "spirytus",
        kalkulator: kalkulator,
        stawkiLata: stawkiLata,
        stawki: stawki,
        kodyKreskowe: kodyKreskowe,
    });
};
exports.wodka = function (req, res) {
    res.render("kalkulator", {
        kalkulator_typ: "wodka",
        kalkulator: kalkulator,
        stawkiLata: stawkiLata,
        stawki: stawki,
        kodyKreskowe: kodyKreskowe,
    });
};
// Zliczanie funkcjonlalności Add
exports.zlicz = function (req, res) {
    res.render("kalkulator", {
        kalkulator_typ: "zlicz",
        kalkulator : kalkulator
    });
};
// Pojazdy
exports.pojazdy = function (req, res) {
    res.render("kalkulator", {
        kalkulator_typ: "pojazdy",
        kalkulator: kalkulator,
        stawkiLata: stawkiLata,
        stawki: stawki,
    });
};
// Pojazdy Komis
exports.pojazdykomis = function (req, res) {
    res.render("kalkulator", {
        kalkulator_typ: "pojazdykomis",
        kalkulator: kalkulator,
        stawkiLata: stawkiLata,
        stawki: stawki,
    });
};
// wysyłanie jeson z nrvin
exports.nrvin = function (req, res) {
    var nrvinJson = require('../data/vin.json');
    res.setHeader('Content-Type', 'application/json');
    res.json(nrvinJson);
};
// wysyłanie jason z stawkani
exports.wysylanieStawek = function (req, res) {
    var stawkiOdpJson = require('../data/stawki' + req.params.rok + '.json');
    res.setHeader('Content-Type', 'application/json');
    res.json(stawkiOdpJson);
    //do poprawy
};
// Koniec Kalkulator
//Sent
exports.sent = function (req, res) {
    var sentJson = require('../data/sent.json');
    var sent = sentJson;
    res.render("sent", {
        sent: sent
    });
};
//Kw-kks
exports.kw_kks = function (req, res) {
    res.render("kwkks");
};
exports.kw = function (req, res) {
    var kwJson = require('../data/kw.json');
    var kw = kwJson;
    res.render("partials/kw", {
        kw: kw
    });
}
exports.kks = function (req, res) {
    var kksJson = require('../data/stawki2018.json');
    var kksStawka = kksJson.stawki.min_pensja;
    res.render("partials/kks", {
        min_pensja: kksStawka
    });
}
//Transport
exports.transport = function (req, res) {
    res.render("construction");
};
// Protokoły edytowalne
exports.protar = function (req, res){
    res.render("edit/protar", {
        kodyKreskowe: kodyKreskowe
    })
}
exports.proogl = function (req, res){
    res.render("edit/proogl", {
        kodyKreskowe: kodyKreskowe
    })
}
exports.kalkspis = function (req, res){
    res.render("edit/kalkspis", {
        kodyKreskowe: kodyKreskowe
    })
}
// Koniec edytowalnych
//notFound
exports.notFound = function (req, res) {
    res.send("To nie jest strona, której szukacie");
};
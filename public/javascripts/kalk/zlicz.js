// Funcjonalonść powrotu
document.getElementById('btn_back').addEventListener('click', function(){
    window.history.back();
},false);
// przypisywanie pól html do zmiennych
var addSumaNaglowek = document.getElementById('addSumaPozNaglowek');
var addSumaPozPapierosyI = document.getElementById('addSumaPozPapierosyI');
var addSumaPozPapierosyII = document.getElementById('addSumaPozPapierosyII');
var addSumaPozTytonI = document.getElementById('addSumaPozTytonI');
var addSumaPozTytonII = document.getElementById('addSumaPozTytonII');
var addSumaPozSpirytusI = document.getElementById('addSumaPozSpirytusI');
var addSumaPozSpirytusII = document.getElementById('addSumaPozSpirytusII');
var addSumaPozWodkaI = document.getElementById('addSumaPozWodkaI');
var addSumaPozWodkaII = document.getElementById('addSumaPozWodkaII');
// funkcjonalność sprawdzająca po pozycji i licząca daną pozycję
// poniżej liczenie danych należności
var tabPozSuma = [];

var iloscPozPapierosy = 0; // by było wiadomo ile jest jednej pozycji
var poz_suma_akcyza_pap = 0;
var poz_suma_clo_pap = 0;
var poz_suma_vat_pap = 0;

var iloscPozTyton = 0;
var poz_suma_akcyza_tyt = 0;
var poz_suma_clo_tyt = 0;
var poz_suma_vat_tyt = 0;

var iloscPozSpirytus = 0;
var poz_suma_akcyza_spi = 0;
var poz_suma_clo_spi = 0;
var poz_suma_vat_spi = 0;

var iloscPozWodka = 0;
var poz_suma_akcyza_wod = 0;
var poz_suma_clo_wod = 0;
var poz_suma_vat_wod = 0;

var susz_suma_akcyza = 0;
/*
Poniżej funkcja odnierająca pojedyńczą wartość z tablicy i
- dokonująca obliczeń poszczególnych pozycji
- tworząca pojedyńcze divy z zawartością każedgo
*/
function addPozBox(tab) {
    // przekazywanie i zliczanie z rozbiciem na kategorie
    if (tab.typ == "Papierosy") {
        iloscPozPapierosy += 1;
        poz_suma_akcyza_pap += tab.akcyza;
        if (tab.addtyp) {
            poz_suma_clo_pap += tab.clo;
            poz_suma_vat_pap += tab.vat;
        }
        if (tabPozSuma.includes('Papierosy') == false) {
            tabPozSuma.push('Papierosy')
        }
        // licząca przestępstwo dla papierosów
        if (sprawdzPrzestepstwoNabycie(poz_suma_akcyza_pap, tab.progpPrzestepstwa) != 'Wykroczenie' && iloscPozPapierosy > 1) {
            addSumaPozPapierosyII.innerHTML = "Papierosy - " + sprawdzPrzestepstwoPrzemyt(poz_suma_akcyza_pap, poz_suma_vat_pap, poz_suma_clo_pap, tab.progpPrzestepstwa);
        }
    }
    if (tab.typ == "Tytoń") {
        iloscPozTyton += 1;
        poz_suma_akcyza_tyt += tab.akcyza;
        if (tab.addtyp) {
            poz_suma_clo_tyt += tab.clo;
            poz_suma_vat_tyt += tab.vat;
        }
        if (tabPozSuma.includes('Tytoń') == false) {
            tabPozSuma.push('Tytoń')
        }
        if (sprawdzPrzestepstwoNabycie(poz_suma_akcyza_tyt, tab.progpPrzestepstwa) != 'Wykroczenie' && iloscPozTyton > 1) {
            addSumaPozTytonII.innerHTML = "Tytoń - " + sprawdzPrzestepstwoPrzemyt(poz_suma_akcyza_tyt, poz_suma_vat_tyt, poz_suma_clo_tyt, tab.progpPrzestepstwa);
        }
    }
    if (tab.typ == "Spirytus") {
        iloscPozSpirytus += 1;
        poz_suma_akcyza_spi += tab.akcyza;
        if (tab.addtyp) {
            poz_suma_clo_spi += tab.clo;
            poz_suma_vat_spi += tab.vat;
        }
        if (tabPozSuma.includes('Spirytus') == false) {
            tabPozSuma.push('Spirytus')
        }
        // licząca przestępstwo dla papierosów
        if (sprawdzPrzestepstwoNabycie(poz_suma_akcyza_spi, tab.progpPrzestepstwa) != 'Wykroczenie' && iloscPozSpirytus > 1) {
            addSumaPozSpirytusII.innerHTML = "Spirytus - " + sprawdzPrzestepstwoPrzemyt(poz_suma_akcyza_spi, poz_suma_vat_spi, poz_suma_clo_spi, tab.progpPrzestepstwa);
        }
    }
    if (tab.typ == "Wódka") {
        iloscPozWodka += 1;
        poz_suma_akcyza_wod += tab.akcyza;
        if (tab.addtyp) {
            poz_suma_clo_wod += tab.clo;
            poz_suma_vat_wod += tab.vat;
        }
        if (tabPozSuma.includes('Wódka') == false) {
            tabPozSuma.push('Wódka')
        }
        if (sprawdzPrzestepstwoNabycie(poz_suma_akcyza_wod, tab.progpPrzestepstwa) != 'Wykroczenie' && iloscPozWodka > 1) {
            addSumaPozWodkaII.innerHTML = "Wódka - " + sprawdzPrzestepstwoPrzemyt(poz_suma_akcyza_wod, poz_suma_vat_wod, poz_suma_clo_wod, tab.progpPrzestepstwa);
        }
    }
    if (tab.typ == "Susz tytoniowy") {
        if (tabPozSuma.includes('Susz') == false) {
            tabPozSuma.push('Susz');
            susz_suma_akcyza += tab.akcyza;
        }
    }
    // dalsza część obliczania teraz wyliczanie poszczególnych pozycji
    if (iloscPozPapierosy > 1 && tabPozSuma.length > 1) {
        addSumaNaglowek.innerHTML = '<h3 style="margin-top:5px;"> W tym: </h3>';
        var textDlaPozPap = 'Papierosy - Akcyza: ' + poz_suma_akcyza_pap + ' zł';
        if (poz_suma_clo_pap > 0) {
            textDlaPozPap += ", cło: " + poz_suma_clo_pap + " zł";
        }
        if (poz_suma_vat_pap > 0) {
            textDlaPozPap += ", VAT: " + poz_suma_vat_pap + " zł";
        }
        if (poz_suma_vat_pap > 0 && tabPozSuma.length > 1) {
            textDlaPozPap += ", <b>Łącznie: " + (poz_suma_akcyza_pap + poz_suma_clo_pap + poz_suma_vat_pap) + " zł."
        }
        addSumaPozPapierosyI.innerHTML = textDlaPozPap;
    }
    if (iloscPozTyton > 1 && tabPozSuma.length > 1) {
        addSumaNaglowek.innerHTML = '<h3 style="margin-top:5px;"> W tym: </h3>';
        var textDlaPozTyt = 'Tytoń - Akcyza: ' + poz_suma_akcyza_tyt + ' zł';
        if (poz_suma_clo_tyt > 0) {
            textDlaPozTyt += ", cło: " + poz_suma_clo_tyt + " zł";
        }
        if (poz_suma_vat_tyt > 0) {
            textDlaPozTyt += ", VAT: " + poz_suma_vat_tyt + " zł";
        }
        if (poz_suma_vat_tyt > 0 && tabPozSuma.length > 1) {
            textDlaPozTyt += ", <b>Łącznie: " + (poz_suma_akcyza_tyt + poz_suma_clo_tyt + poz_suma_vat_tyt) + " zł."
        }
        addSumaPozTytonI.innerHTML = textDlaPozTyt;
    }
    if (iloscPozSpirytus > 1 && tabPozSuma.length > 1) {
        addSumaNaglowek.innerHTML = '<h3 style="margin-top:5px;"> W tym: </h3>';
        var textDlaPozSpi = 'Spirytus - Akcyza: ' + poz_suma_akcyza_spi + ' zł';
        if (poz_suma_clo_spi > 0) {
            textDlaPozSpi += ", cło: " + poz_suma_clo_spi + " zł";
        }
        if (poz_suma_vat_spi > 0) {
            textDlaPozSpi += ", VAT: " + poz_suma_vat_spi + " zł";
        }
        if (poz_suma_vat_spi > 0 && tabPozSuma.length > 1) {
            textDlaPozSpi += ", <b>Łącznie: " + (poz_suma_akcyza_spi + poz_suma_clo_spi + poz_suma_vat_spi) + " zł."
        }
        addSumaPozSpirytusI.innerHTML = textDlaPozSpi;
    }
    if (iloscPozWodka > 1 && tabPozSuma.length > 1) {
        addSumaNaglowek.innerHTML = '<h3 style="margin-top:5px;"> W tym: </h3>';
        var textDlaPozWod = 'Wódka - Akcyza: ' + poz_suma_akcyza_wod + ' zł';
        if (poz_suma_clo_wod > 0) {
            textDlaPozWod += ", cło: " + poz_suma_clo_wod + " zł";
        }
        if (poz_suma_vat_wod > 0) {
            textDlaPozWod += ", VAT: " + poz_suma_vat_wod + " zł";
        }
        if (poz_suma_vat_wod > 0 && tabPozSuma.length > 1) {
            textDlaPozWod += ", <b>Łącznie: " + (poz_suma_akcyza_wod + poz_suma_clo_wod + poz_suma_vat_wod) + " zł."
        }
        addSumaPozWodkaI.innerHTML = textDlaPozWod;
    }
    // uruchamianie funkcji liczącej sume całkowiją
    wypiszSume();
    // Tworzenie i wypiswywanie poj div dla każdej pozycji
    var pozBox = document.createElement('div');
    var h2 = document.createElement('h2');
    var p1 = document.createElement('p');
    var p2 = document.createElement('p');
    var naglowek = "";
    var pojNalerznosci = "";
    var jednostka = " szt.";
    var kwalifikacja = "";
    var l1 = " - ";
    if (tab.typ == 'Susz tytoniowy' || tab.typ == 'Tytoń') {
        jednostka = " kg"
    }
    if (tab.typ == 'Spirytus' || tab.typ == 'Wódka') {
        jednostka = " l"
    }
    if (tab.typ == 'Susz tytoniowy') {
        l1 = " ";
    }
    pojNalerznosci += " Ilość: " + tab.ilosc + jednostka + ",  akcyza: " + tab.akcyza;
    // tworzenie tekstów
    naglowek += tab.typ + l1 + tab.nazwa;
    if (tab.addtyp) {
        naglowek += " - Przemyt" + "<br>";
        pojNalerznosci += " zł , cło: " + tab.clo + " zł, VAT: " + tab.vat + " zł<br><b>Łączne Należności; " + (tab.akcyza + tab.clo + tab.vat) + " </b>";
        // wypisanie kwalifikacji
        kwalifikacja += sprawdzPrzestepstwoPrzemyt(tab.akcyza, tab.vat, tab.clo, tab.progpPrzestepstwa);
    } else {
        naglowek += " - Nabycie" + "<br>";
        // wypisanie kwalifikacji
        kwalifikacja += sprawdzPrzestepstwoNabycie(tab.akcyza, tab.progpPrzestepstwa);
    }
    h2.innerHTML = naglowek;
    p1.innerHTML = pojNalerznosci;
    p2.innerHTML = kwalifikacja;
    pozBox.setAttribute('class', 'kalkAddPozBox border light');
    pozBox.appendChild(h2);
    pozBox.appendChild(p1);
    pozBox.appendChild(p2);
    return pozBox;
}
//pobieranie danych z tablice może można spróbować z funkcją z poprzedniego pliku
function pobierzDane() {
    var pobranyObiekt = sessionStorage.getItem("Add");
    return tablicaDane = JSON.parse(pobranyObiekt);
}
// wypisywanie sumy całkowitej
function wypiszSume() {
    var akcyza = poz_suma_akcyza_pap + poz_suma_akcyza_tyt + poz_suma_akcyza_spi + poz_suma_akcyza_wod + susz_suma_akcyza;
    var clo = poz_suma_clo_pap + poz_suma_clo_tyt + poz_suma_clo_spi + poz_suma_clo_wod;
    var vat = poz_suma_vat_pap + poz_suma_vat_tyt + poz_suma_vat_spi + poz_suma_vat_wod;
    var textSuma = "Akcyza: " + akcyza + " zł";
    if (clo > 0) {
        textSuma += ", Cło: " + clo + " zł";
    }
    if (vat > 0) {
        textSuma += ", VAT: " + vat + " zł";
    }
    textSuma += "<br><b>Łączne Należności: " + (akcyza + clo + vat) + " zł </b>";
    document.getElementById('addSuma').innerHTML = textSuma;
}
function addPoz() {
    var addBigBox = document.getElementById('addBigBox');
    var tab = pobierzDane();
    for (var i = 0; i < tab.length; i++) {
        addBigBox.appendChild(new addPozBox(tab[i]));
    }
}
function zliczLoad() {
    document.getElementById('kalkAddMenuWraper').setAttribute('class', 'ukryj');
    addPoz();
}
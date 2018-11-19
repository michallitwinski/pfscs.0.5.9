var komisMain = document.getElementById('autoKomisMain'); // Część okazująca dodane obiekty pojazd
var data_gran = document.getElementById('data_gran');
var auta_data = document.getElementById('data_input');
var auta_waluta = document.getElementById('waluta');
var auta_pojemnosc_silnika = document.getElementById('pojemnosc_silnika');
var data_input = document.getElementById('data_input');
var btn_komis_wyczysc = document.getElementById('btn_komis_wyczysc');
//wywołania funkcji
auta_waluta.addEventListener('input', ustawKurs, true);
data_input.addEventListener('input', ustawKurs, true);
//zmienne do obliczneń
var dzienMiesaca = 31;
// funkcja onload czyli uzyskiwanie aktualnej daty i wgrywanie daty do pola data
function loadWriteDate() {
    var curentDate = new Date(),
        d = curentDate.getDate(),
        m = curentDate.getMonth() + 1,
        y = curentDate.getFullYear(),
        data;
    if (d < 10) {
        d = "0" + d;
    };
    if (m < 10) {
        m = "0" + m;
    };
    dzienMiesaca = iloscDni(m - 1, y); //funkcjonalność licząca ile dni ma aktualny miesiąc
    data = y + "-" + m + "-" + d;
    auta_data.value = data;
    // pozsykiwanie terminu z zakładki stawki
    var termin = document.getElementById('auta_termin').value;
    // uzyskiwanie i wgrywanie daty granicznej do pola
    var oldDate = new Date(curentDate.setDate(curentDate.getDate() - termin)), // sprawdzić ewentualnie +1
        od = oldDate.getDate(),
        om = curentDate.getMonth() + 1,
        oy = curentDate.getFullYear(),
        oData;
    if (od < 10) {
        od = "0" + od;
    };
    if (om < 10) {
        om = "0" + om;
    };
    oData = oy + "-" + om + "-" + od;
    data_gran.value = oData;
}
//funkcja zwracająca ilość dni w podanym miesiącu
var iloscDni = function (month, year) {
    return new Date(year, month, 0).getDate();
};
// żądanie nowej waluty
function ustawKurs() {
    if (auta_waluta.value == "PLN") {
        wynik_kurs1.innerHTML = "";
        wynik_kurs2.innerHTML = "";
        wynik_kursInput.setAttribute("class", "ukryj");
        wynik_kursInput.value = 1;
    } else {
        // początek daty pobranie z pola input
        var data = auta_data.value;
        //ponowne wywołanie funkcji pobierającej kurs w przypadku gdy otrzymamy błąd 404 (dni wolne od pracy)
        var ponowneWywolanie = 0;
        var dniPoprzedniegoM = 0;
        function wywolajPonownie(zapData) {
            ponowneWywolanie += 1;
            if (ponowneWywolanie < 5) {
                var nowaData = new Date(zapData),
                    d = nowaData.getDate() - 1,// dodać funkcję sprawdzania miesiąca i liczenia dni
                    m = nowaData.getMonth() + 1,
                    y = nowaData.getFullYear(),
                    pomniejszonaData;
                if (d == 0) { // funkcjonalność zmieniająca miesiąc na poprzedni oraz odejmująca dni
                    m -= 1;
                    if (m == 0) {
                        m = 12;
                        y -= 1;
                    }
                    d = dzienMiesaca;
                    if (ponowneWywolanie > 2 + dniPoprzedniegoM) {
                        d -= 1;
                    }
                } else {
                    dniPoprzedniegoM += 1; // liczy dni które upłyneły zeszłego miesiąca i ddodaje do dni z ponownego wywołania
                }
                if (d < 10) {
                    d = "0" + d;
                };
                if (m < 10) {
                    m = "0" + m;
                };
                pomniejszonaData = y + "-" + m + "-" + d;
                zap(pomniejszonaData);
            };
        };
        //wywołanie funkcji pobierającej kurs dnia z pierwszą datą
        zap(data);
        function zap(zapData) {
            var req = createObject();
            req.open('GET', "https://api.nbp.pl/api/exchangerates/rates/a/" + auta_waluta.value + "/" + zapData + "/?format=xml", true);
            req.send(null);
            req.onreadystatechange = function () {
                if (req.readyState == 4 && req.status == 200) {
                    var doc = req.responseXML;
                    wynik_kurs1.innerHTML = "Kurs " + doc.getElementsByTagName("Code")[0].childNodes[0].nodeValue + " wynosi: ";
                    wynik_kursInput.setAttribute("class", "");
                    wynik_kursInput.value = doc.getElementsByTagName("Mid")[0].childNodes[0].nodeValue;
                    var text = "";
                    text += " pobrano z tabeli kursów NBP nr: " + doc.getElementsByTagName("No")[0].childNodes[0].nodeValue;
                    text += " z dnia: " + doc.getElementsByTagName("EffectiveDate")[0].childNodes[0].nodeValue + "<br>";
                    if (zapData != auta_data.value) {
                        text += "tabele kusów są publikowane w dni robocze w południe"
                        if (ponowneWywolanie >= 1) {
                            text += " wartość pobrano z poprzedniego dnia roboczego<br>";
                        }
                    }
                    text += "<br>";
                    wynik_kurs2.innerHTML = text;
                } else if (req.readyState == 4 && req.status == 404) {
                    wywolajPonownie(zapData);
                } else {
                    wynik_kurs2.innerHTML = " Nie udało połączyć się z tabelą kursów NBP";
                    wynik_kursInput.setAttribute("class", "");
                    wynik_kurs1.innerHTML = "Wprowadź kurs: ";
                }
            };
        };
    };
};
// Zapytanie o valutę dla przeglądarek Microsoft
document.getElementById('ieStawkiZapBtn').addEventListener('click', function(){
    ustawKurs();
},false);
// Koniec funkcjonlności pobierania kórsów walut
// Początek funkcjonalności Sessionstorage
// Pobieranie zawartości tablicy do js
function odswierzTabliceKomis() {
    var pobranyObiekt = localStorage.getItem("komis");
    return JSON.parse(pobranyObiekt);
}
// Ładowanie zawartości tablicy do local
function zaladujTabliceKomis(tab) {
    var str = JSON.stringify(tab);
    localStorage.setItem('komis', str);
}
//dodawanie pojazdu do local storage
function zapiszAuto(pojazd) {
    if (odswierzTabliceKomis() == null) {
        var tab = [];
        tab.push(pojazd);

    } else {
        var tab = odswierzTabliceKomis();
        tab.push(pojazd);
    }
    zaladujTabliceKomis(tab);
}
// kasowanie pojazdu z local storage i main
function kasujPojazd(pojazd) {
    var tab = odswierzTabliceKomis();
    tab.splice(pojazd, 1);
    zaladujTabliceKomis(tab);
    wyswietlMain();
}
// funkcjonalnoś odpowiadająca za wyświetlanie pojazdów z localStorage w main
function wyswietlMain() {
    var main = document.getElementById('autoKomisEdit');
    main.innerHTML = "";
    var tab = odswierzTabliceKomis();
    var smuaNaleznosci = 0;
    if (tab != null) {
        for (var i = 0; i < tab.length; i++) {
            main.appendChild(new stworzAuto(tab[i], i));
            // sumowanie należności za pojazdy
            smuaNaleznosci += tab[i].podatek;
        }
    } else {
        tab = [];
    }
    // wyświetlanie łącznych należności oraz ilosci pojazdow
    var pP = document.getElementById('prog_przetępstwa').value;
    var pPKomis = document.getElementById('pPKomis');
    if (smuaNaleznosci > pP) {
        pPKomis.setAttribute('class', '')
    } else {
        pPKomis.setAttribute('class', 'ukryj')
    }
    document.getElementById('sumaKomis').innerHTML = smuaNaleznosci;
    // wyświetlanie podsumowania w zależności od ilości pojazdów i przycisku wyczyść
    var autoKomisEditSuma = document.getElementById('autoKomisEditSuma');
    if (tab.length > 1) {
        autoKomisEditSuma.classList.remove('ukryj');
        btn_komis_wyczysc.setAttribute('class', 'przyciski border');
    } else {
        autoKomisEditSuma.classList.add('ukryj');
        btn_komis_wyczysc.setAttribute('class', 'ukryj');
    }
}
// Funkcjonalność budowanie i wyświetlania obiektów w main
function stworzAuto(obiekt, i) {
    var nowyElement = document.createElement('div');
    nowyElement.setAttribute('class', 'autoObiektWypisz border light');
    // Budowa napisów dla karzdego samochodu
    var span0 = document.createElement('span');
    span0.innerHTML = (i + 1) + ".";
    var span1 = document.createElement('span');
    span1.setAttribute('contenteditable', 'true');
    if (obiekt.marka != 'brak') span1.innerHTML = ' Pojazd marki: ' + obiekt.marka + ' o nr VIN: ' + obiekt.vin;
    else span1.innerHTML = ' Pojazd o nr VIN: ' + obiekt.vin;
    var span2 = document.createElement('span');
    span2.innerHTML = ', zakupiony za kwotę: ' + obiekt.kwota + " " + obiekt.waluta;
    var span3 = document.createElement('span');
    span3.setAttribute('contenteditable', 'true');
    span3.innerHTML = ', przemieszczony na terytorium kraju w dniu: ' + obiekt.data_przemieszczenia + '.<br>';
    var span4 = document.createElement('span');
    span4.innerHTML = 'Należny podatek akcyzowy wynosi: ' + obiekt.podatek;
    var span5 = document.createElement('span');
    span5.innerHTML = ' (przeliczono po kursie: ' + obiekt.kurs + ')';
    nowyElement.appendChild(span0);
    nowyElement.appendChild(span1);
    nowyElement.appendChild(span2);
    nowyElement.appendChild(span3);
    nowyElement.appendChild(span4);
    if (obiekt.waluta != "PLN") {
        nowyElement.appendChild(span5);
    }
    var btn_del = document.createElement('div');
    btn_del.setAttribute('class', 'border light komisBtnDel');
    btn_del.innerHTML = "Usuń"
    btn_del.addEventListener('click', function () {
        kasujPojazd(i);
    }, false);
    nowyElement.appendChild(btn_del);
    return nowyElement;
}
// Funkcjonlaność Przycisku Dodaj!!! 
var btn_dodaj = document.getElementById('btn_oblicz');
var wynik_1 = document.getElementById('wynik_1');
btn_dodaj.addEventListener('click', dodajPojazd, false);
// Funkcjonlaność budowania nowego obiektu pojazdu i zapisywanie go do pamięci sessionStorage
function dodajPojazd() {
    wynik_1.innerHTML = ""
    var nrVin = document.getElementById('nrVin').value.toUpperCase();
    var data = data_input.value;
    var pojemnosc = auta_pojemnosc_silnika.value;
    var kwota = document.getElementById('kwota').value;
    var waluta = auta_waluta.value;
    var kurs = wynik_kursInput.value
    var podatek = 0;
    // Validacja VIN
    if (nrVin.length != 17) {
        wynik_1.innerHTML = "Błędna długość nr VIN";
    } else if (nrVin.toUpperCase().includes('I') || nrVin.toUpperCase().includes('O') || nrVin.toUpperCase().includes('Q')) {
        wynik_1.innerHTML = "Nr VIN nie zawiera I, O lub Q";
    } else if (kwota == "" || kwota < 0) {
        wynik_1.innerHTML = "Wpisz poprawną kwotę";
    } else {
        wynik_1.innerHTML = "";
        // obliczenia podatku
        if (waluta == "PLN") {
            podatek = Math.ceil(kwota * (pojemnosc / 100));
            kurs = "";
        } else {
            podatek = Math.ceil((kwota * kurs) * (pojemnosc / 100));
        }
        // wezwanie funkcjonalności sprawdzającej vin
        var marka = sprawdziMarke(nrVin);
        // tworzenie nowego obiektu
        var obiekt = {
            "vin": nrVin,
            "data_przemieszczenia": data,
            "kwota": kwota,
            "kurs": kurs,
            "waluta": waluta,
            "podatek": podatek,
            "marka": marka
        }
        zapiszAuto(obiekt);
        wyswietlMain();
        document.getElementById('nrVin').value = "";
        document.getElementById('kwota').value = "";
    }
}
// Konice funcjonalności przycisku dodaj
// funkcjonalność przycisku Wyczyść
btn_komis_wyczysc.addEventListener('click', function () {
    localStorage.removeItem('komis');
    wyswietlMain();
}, false)
// Początek funkcjonalności pobierającej nr vin
var tablicaVin = [];
function pobierzNrVin() {
    var req = createObject();
    req.open('GET', '/nrvin', true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var doc = "(" + req.responseText + ")";
            tablicaVin = eval(doc);
        }
    }
};
// koniec funkcjonalności pobierającej tabele z nr Vin
function sprawdziMarke(vin) {
    var vin = vin.toUpperCase();
    var markapojazdu = 'brak';
    var kod1 = vin.substring(0, 2);
    var kod2 = vin.substring(0, 3);
    for (var i = 0; i < tablicaVin.length; i++) {
        if (tablicaVin[i].kod == kod1) {
            markapojazdu = tablicaVin[i].marka;
        }
    }
    for (var j = 0; j < tablicaVin.length; j++) {
        if (tablicaVin[j].kod == kod2) {
            markapojazdu = tablicaVin[j].marka;
        }
    }
    return markapojazdu;
}
// Funkcja onload uruchamiana z pliku wapólne
function autaLoadKomis() {
    document.getElementsByTagName('footer')[0].classList.add('displayPrint');// ukrywania do druku
    document.getElementById('kalkAddMenuWraper').classList.add('ukryj'); // ukrywanie panelu add
    document.getElementById('btn_komis').setAttribute('class', 'ukryj'); // ukrywanie przycisku komis
    document.getElementById('btn_oblicz').innerHTML = "Dodaj"; // zmiana napisu na btn 
    loadWriteDate();
    wyswietlMain();
    pobierzNrVin();
}



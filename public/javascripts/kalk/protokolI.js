// funkcjia wypisująca daty w protokołach
function proWypiszDate(Data) {
    if (document.getElementById('ProNrDr').innerHTML != "P-4") {
        var dataStartId = document.getElementById('dataStartId');
        var dataStartTab = dataStartId.getElementsByClassName('dataStartClass');
        for (var i = 0; i < dataStartTab.length; i++) {
            dataStartTab[i].innerHTML = Data[i + 4];
        }
    }
    var dataKoniecId = document.getElementById('dataKoniecId');
    var dataKoniecTab = dataKoniecId.getElementsByClassName('dataKoniecClass');
    for (var j = 0; j < dataKoniecTab.length; j++) {
        dataKoniecTab[j].innerHTML = Data[j];
    }
};
// Wypisywanie kodu taryfy protar
function wypiszKodTaryfy(typ) {
    var text = "";
    if (typ == "Papierosy") text = "2402 20 90";
    if (typ == "Tytoń") text = "2403 19 90";
    if (typ == "Susz tytoniowy") text = "-";
    if (typ == "Spirytus") text = "2207 10 00 17";
    if (typ == "Wódka") text = "2208 60 11";
    return text;
}
// Funkcjonalność tworzącz obiekt w tabeli protar
function proTarPoz(dane, licznik) {
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    // LP.
    td1.setAttribute('class', 'proTarTd1');
    td1.innerHTML = licznik;
    // Opis
    var td2 = document.createElement('td');
    td2.setAttribute('class', 'proTarTd2');
    var opis = dane.typ;
    if (dane.typ != "Susz tytoniowy") {
        opis += " marki: " + dane.nazwa;
    }
    opis += " w ilości: " + dane.ilosc;
    if (dane.typ == "Papierosy") {
        opis += " szt.";
    }
    if (dane.typ == "Tytoń" || dane.typ == "Susz tytoniowy") {
        opis += " kg";
    }
    if (dane.typ == "Spirytus" || dane.typ == "Wódka") {
        opis += " l";
    }
    td2.innerHTML = opis;
    var span1 = document.createElement('span');
    span1.setAttribute('contenteditable', 'true');
    span1.innerHTML = ", bez polskich znaków akcyzy";
    var span2 = document.createElement('span');
    span2.setAttribute('contenteditable', 'true');
    span2.innerHTML = ", Towar opatrzony kodem kreskowym: ";
    td2.appendChild(span1);
    td2.appendChild(span2);
    // Kod taryfy
    var td3 = document.createElement('td');
    td3.setAttribute('class', 'proTarTd3');
    td3.setAttribute('contenteditable', 'true');
    td3.innerHTML = wypiszKodTaryfy(dane.typ);
    // Cło
    var td4 = document.createElement('td');
    td4.setAttribute('class', 'proTarTd4');
    if (dane.addtyp) {
        td4.innerHTML = dane.vat + " zł";
    } else {
        td4.innerHTML = "-";
    }
    // Akcyza
    var td5 = document.createElement('td');
    td5.setAttribute('class', 'proTarTd5');
    td5.innerHTML = dane.akcyza + " zł";
    //Vat
    var td6 = document.createElement('td');
    td6.setAttribute('class', 'proTarTd6');
    if (dane.addtyp) {
        td6.innerHTML = dane.vat + " zł";
    } else {
        td6.innerHTML = "-";
    }
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    return tr;
}
// Funkcja zmieniająca wykroczenie na przestępstwo protar
function wypiszPrzestepstwo(kwalifikacja) {
    if (kwalifikacja) {
        var przestepstwoTab = document.getElementsByClassName('protarPrzestepstwo');
        for (var i = 0; i < przestepstwoTab.length; i++) {
            przestepstwoTab[i].innerHTML = "przestępstwa"
        }
    }
}
// Funkcjonalność licząca poszczegulne pozycja na przestępstwo protar
var proTarProgPrzestepstwa = 0;
var proTarAkcyzaPapierosy = 0;
var proTarAkcyzaTyton = 0;
var proTarAkcyzaSusz = 0;
var proTarAkcyzaSpirytus = 0;
var proTarAkcyzaWodka = 0;
function obliczPrzestepstwo(kwota, prog, rodzaj) {
    if (proTarProgPrzestepstwa < prog) {
        proTarProgPrzestepstwa = prog;
    }
    if (rodzaj == "Papierosy") {
        proTarAkcyzaPapierosy += kwota;
    }
    if (rodzaj == "Tytoń") {
        proTarAkcyzaTyton += kwota;
    }
    if (rodzaj == "Susz tytoniowy") {
        proTarAkcyzaSusz += kwota;
    }
    if (rodzaj == "Spirytus") {
        proTarAkcyzaSpirytus += kwota;
    }
    if (rodzaj == "Wódka") {
        proTarAkcyzaWodka += kwota;
    }
    if (proTarAkcyzaPapierosy > prog || proTarAkcyzaTyton > prog || proTarAkcyzaSusz > prog || proTarAkcyzaSpirytus > prog || proTarAkcyzaWodka > prog) {
        wypiszPrzestepstwo(true);
    }
}
// Funkcja wypisująca protokuł taryfikacji
function wypiszProTar(dane) {
    var proTarAuto = document.getElementById('proTarAuto');
    for (var i = 0; i < dane.length; i++) {
        var licznik = i + 1;
        proTarAuto.appendChild(new proTarPoz(dane[i], licznik));
        //funkcjonalność sprawdzająca czy przestępstwo
        wypiszPrzestepstwo(dane[i].przestepstwo);
        obliczPrzestepstwo(dane[i].akcyza, dane[i].progpPrzestepstwa, dane[i].typ);
    }
};
// Funkcjonalność tworząca nowy rząd w tabeli proOgl
function proOglPoz(dane, licznik) {
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    td1.setAttribute('class', 'tdw2');
    td1.setAttribute('contenteditable', 'true');
    var td2 = document.createElement('td');
    td2.setAttribute('class', 'just');
    td2.setAttribute('class', 'pad');
    td2.setAttribute('class', 'tdw');
    td2.setAttribute('contenteditable', 'true');
    if (dane != null && licznik != null) {
        td1.innerHTML = licznik;
        var opis = dane.typ;
        var opis2 = "";
        if (dane.typ != "Susz tytoniowy") {
            opis += " marki: " + dane.nazwa;
        }
        opis += " w ilości: " + dane.ilosc;
        if (dane.typ == "Papierosy") {
            opis += " szt.";
            opis2 += "Na opakowaniach jednostkowych napisy w języku ..., oraz kody kreskowe nr ... . Co wskazuje, iż krajem pochodzenia wyrobów jest .(zakładka kody).";
        }
        if (dane.typ == "Tytoń" || dane.typ == "Susz tytoniowy") {
            opis += " kg";
        }
        if (dane.typ == "Spirytus" || dane.typ == "Wódka") {
            opis += " l";
            opis2 += "Na opakowaniach jednostkowych napisy w języku ..., oraz kody kreskowe nr ... . Co wskazuje, iż krajem pochodzenia wyrobów jest .(zakładka kody).";
        }
        opis += " bez polskich znaków akcyzy " + opis2;
        td2.innerHTML = opis;
    }
    var td3 = document.createElement('td');
    td3.setAttribute('class', 'tdw2');
    td3.setAttribute('contenteditable', 'true');
    var td4 = document.createElement('td');
    td4.setAttribute('class', 'just');
    td4.setAttribute('class', 'pad');
    td4.setAttribute('contenteditable', 'true');
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    return tr;
};
// Funkcja tworząca nowy element listy w spisie i opisie
function proSpisLi(dane) {
    var li = document.createElement('li');
    var opis = dane.typ;
    var opis2 = "";
    if (dane.nazwa != "") {
        opis += " marki: " + dane.nazwa + ",";
    }
    opis += " w ilości: " + dane.ilosc;
    if (dane.typ == "Papierosy") {
        opis += " szt.";
        opis2 += "Na opakowaniach jednostkowych napisy w języku ..., oraz kody kreskowe nr ... . Co wskazuje, iż krajem pochodzenia wyrobów jest .(patrz zakładka kody).";
    }
    if (dane.typ == "Tytoń" || dane.typ == "Susz tytoniowy") {
        opis += " kg";
    }
    if (dane.typ == "Spirytus" || dane.typ == "Wódka") {
        opis += " l";
        opis2 += "Na opakowaniach jednostkowych napisy w języku ..., oraz kody kreskowe nr ... . Co wskazuje, iż krajem pochodzenia wyrobów jest .(patrz zakładka kody).";
    }
    opis += " bez polskich znaków akcyzy. " + opis2;
    li.innerHTML = opis;
    return li;
};
// Funkcja licząca pozycje w spisie i opisie
var kalkSpisIloscPoz = document.getElementById('kalkSpisIloscPoz');
function wypiszKalkSpisPoz(ilosc) {
    if (ilosc == 1) {
        kalkSpisIloscPoz.innerHTML = " 1 ";
    }
    if (ilosc == 2) {
        kalkSpisIloscPoz.innerHTML = " 1 i 2 ";
    }
    if (ilosc > 2) {
        kalkSpisIloscPoz.innerHTML = " 1 - " + ilosc;
    }
};
// Funkcja wypisująca protokuł oględzin
function wypiszProOgl(dane) {
    var proOglAuto = document.getElementById('autoTabOgl');
    if (dane != null) {
        for (var i = 0; i < dane.length; i++) {
            var licznik = i + 1;
            proOglAuto.appendChild(new proOglPoz(dane[i], licznik));
        }
    } else {
        proOglAuto.appendChild(new proOglPoz());
    }
};
// Funkcja wypisująca Spis i opis
function wypiszKalkSpis(dane) {
    var proSpisAuto = document.getElementById('proSpisAuto');
    if (dane != null) {
        var ol = document.createElement('ol');
        ol.setAttribute('id', 'proSpisAutoOl');
        proSpisAuto.appendChild(ol);
        for (var i = 0; i < dane.length; i++) {
            ol.appendChild(new proSpisLi(dane[i]));
            wypiszKalkSpisPoz(i + 1);
        }
    } else {
        proSpisAuto.innerHTML = "Tu wpisz opis"
    }
};
// Całość funkcjonalności LocalStorage
// Funkcjonalność zapisująca i wypisująca Sygnaturę, referat do local
var proTarSygn = document.getElementById('proTarSygn');
var proTarRef = document.getElementById('proTarRef');
proTarSygn.addEventListener('blur', zapiszDoLocal, false);
proTarRef.addEventListener('blur', zapiszDoLocal, false);
if (document.getElementById('ProNrDr').innerHTML != "P-6") {
    var proJednostka = document.getElementById('proJednostka');
    proJednostka.addEventListener('blur', zapiszDoLocal, false);
}
// Funkcjonalność zapisująca obiekt do local storage sprawdzający
function zapiszDoLocal() {
    var proLocal = localStorage.getItem('prolocal');
    // zmienna potrzebna wrazie braku danych w localStorage oraz dla ustawienia wartości domyślnych
    var daneLocal = {
        "sygnatura": "...........",
        "ref": "...........",
        "jednostka": "..........."
    }
    if (proLocal != null) {
        daneLocal = JSON.parse(proLocal);
    }
    var obiekt = {
        "sygnatura": daneLocal.sygnatura,
        "ref": daneLocal.ref,
        "jednostka": daneLocal.jednostka
    }
    // zmiana obiektu w zależności od pul na protokole w przypadku braku jednostki
    if (proTarSygn.innerHTML != "") {
        obiekt.sygnatura = proTarSygn.innerHTML;
    }
    if (proTarRef.innerHTM != "") {
        obiekt.ref = proTarRef.innerHTML;
    }
    if (document.getElementById('ProNrDr').innerHTML != "P-6" && proJednostka.innerHTML != "") {
        obiekt.jednostka = proJednostka.innerHTML;
    }
    var str = JSON.stringify(obiekt);
    localStorage.setItem('prolocal', str);
}
// Funkcjonalność wypisująca Sygnaturę, referat z local
function wypiszProLocal(dane) {
    proTarSygn.innerHTML = dane.sygnatura;
    proTarRef.innerHTML = dane.ref;
    if (document.getElementById('ProNrDr').innerHTML != "P-6") {
        proJednostka.innerHTML = dane.jednostka;
    };
}
// Koniec funkcjonalności do local storage
// Funkcjonalonść zapisująca i wypisująca nr sprawy local storage
var proTarSygnNr = document.getElementById('proTarSygnNr');
proTarSygnNr.addEventListener('blur', zapiszNrDoSession, false);
function zapiszNrDoSession() {
    if (proTarSygnNr.innerHTML != "") {
        var obiekt = {
            nr : proTarSygnNr.innerHTML
        }
        var str = JSON.stringify(obiekt);
        sessionStorage.setItem('sygnNr', str);
    }
};
function wypiszSygnNr(dane){
    proTarSygnNr.innerHTML = dane.nr;
}
// Koniec zapisywania i wypisywania sygnatury
// Funkcja Onload pobieranie obiektu i przekazywaniego do przetworzenia
window.onload = function () {
    // Funkcjonalność tworząca datę
    var curentDate = new Date(),
        d = curentDate.getDate(),
        m = curentDate.getMonth() + 1,
        y = curentDate.getFullYear(),
        h = curentDate.getHours(),
        min = curentDate.getMinutes(),
        aktData;
    if (d < 10) {
        d = "0" + d;
    };
    if (m < 10) {
        m = "0" + m;
    };
    if (h < 10) {
        h = "0" + h;
    };
    if (min < 10) {
        min = "0" + min;
    };
    aktData = h + "" + min + "" + d + "" + m + "" + y;
    proWypiszDate(aktData);
    // pobieranie obiektu z danych
    var pobranyObiekt = sessionStorage.getItem("Add");
    var tablicaDane = JSON.parse(pobranyObiekt);
    // dopisać ifa który będzie sprawdza który prorokól wypisujemy i odpalał odpowiedjią funkcję
    if (document.getElementById('ProNrDr').innerHTML == "P-10") {
        wypiszProTar(tablicaDane);
    }
    if (document.getElementById('ProNrDr').innerHTML == "P-6") {
        wypiszProOgl(tablicaDane);
        // Funkcja dodająca pole do protokołu oględzin
        document.getElementById('btnProAdd').addEventListener('click', function () {
            var proOglAuto = document.getElementById('autoTabOgl');
            proOglAuto.appendChild(new proOglPoz());
        }, false)
    }
    if (document.getElementById('ProNrDr').innerHTML == "P-4") {
        wypiszKalkSpis(tablicaDane);
    }
    // Funkcjonalność pobierająca z localstorage (referat, sygnatura)
    var proLocal = localStorage.getItem('prolocal');
    if (proLocal != null) {
        var daneLocal = JSON.parse(proLocal);
        wypiszProLocal(daneLocal);
    }
    // Funkcjonalność wypisukjąca nr sprawy z session
    var sygnNr = sessionStorage.getItem('sygnNr');
    if(sygnNr != null) {
        var daneSession = JSON.parse(sygnNr);
        wypiszSygnNr(daneSession);
    }
}
// Funkcjonalonść menu
document.getElementById('btn_powrot').addEventListener('click', function () {
    window.history.back();
}, false)
document.getElementById('btn_print').addEventListener('click', function () {
    window.print();
}, false)
document.getElementById('btn_kody').addEventListener('click', function () {
    document.getElementById('protoWrapper').classList.toggle('ukryj');
    document.getElementById('kody2tab').classList.toggle('ukryj');
}, false)
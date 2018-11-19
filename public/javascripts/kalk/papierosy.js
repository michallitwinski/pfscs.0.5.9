// zmienne pozyskiwane z diva stawki
var pap_stawka_cło = document.getElementById('pap_stawka_cło').value;
var pap_stawka_akcyzy_1000_szt = document.getElementById('pap_stawka_akcyzy_1000_szt').value;
var srednia_wazona_detaliczna_cena_sprzedazy = document.getElementById('srednia_wazona_detaliczna_cena_sprzedazy').value;
var stawka_akcyzy_wyroby_tyt = document.getElementById('stawka_akcyzy_wyroby_tyt').value;
var stawka_vat = document.getElementById('stawka_vat').value;
var prog_przetępstwa = document.getElementById('prog_przetępstwa').value;
//Zmienne obliczane automatycznie wyroby tytoniowe
var max_cena_detaliczna = Math.round((3 * srednia_wazona_detaliczna_cena_sprzedazy) * 100) / 100;
// zmienne do których przekazywane są wyliczenia clelm przeniesienia do par i Add
var iloscZew = 0;
var progZew = 0;
var czyPrzekroczonoProg = false;
var akcyza = 0;
var clo = 0;
var vat = 0;
var pap_obliczone = false; // część odpowiadająca za odpalanie ponowne obliczenia
// zmienna określająca pole w które wprowadzano dane papierosy
var pap_pole = 0;
// przypisywanie pul i przycisku do zmiennych do zmiennych papierosy
var pap_ilosc_szt = document.getElementById('pap_ilosc_szt');
var pap_ilosc_wpaczce = document.getElementById('pap_ilosc_wpaczce');
var pap_ilosc_paczek = document.getElementById('pap_ilosc_paczek');
var pap_ilosc_sztang = document.getElementById('pap_ilosc_sztang');
var btn_oblicz = document.getElementById('btn_oblicz');
var typ_przemyt = document.getElementById('typ_przemyt');
var typ_nabycie = document.getElementById('typ_nabycie');
//przypisanie elementu div wynik papierosy
var wynik_1 = document.getElementById("wynik_1");
var wynik_2 = document.getElementById("wynik_2");
//wywoływanie obliczneń ilości papierosów po zmianie formularzy papierosy
pap_ilosc_szt.addEventListener('input', obliczIloscSztuki, false);
pap_ilosc_wpaczce.addEventListener('input', obliczIloscSztukiWPaczce, false);
pap_ilosc_paczek.addEventListener('input', obliczIloscPaczki, false);
pap_ilosc_sztang.addEventListener('input', obliczIloscSztangi, false);
//Przypisanie wydarzeń do przycisków
btn_oblicz.addEventListener('click', obliczPapierosy, false);
//funkcje dynamicznie liczące wprowadzane pola papierosy
function obliczIloscSztuki() {
    pap_pole = 1;
    var ilosc = pap_ilosc_szt.value;
    ilosc = Math.floor(ilosc);
    pap_ilosc_szt.value = ilosc;
    var ilosc_wpaczce = pap_ilosc_wpaczce.value;

    var ilosc_paczek = ilosc / ilosc_wpaczce;
    pap_ilosc_paczek.value = ilosc_paczek;
    pap_ilosc_sztang.value = ilosc_paczek / 10;
    if (pap_obliczone == true) {
        ponowneObliczanie();
    }
};
function obliczIloscPaczki() {
    pap_pole = 2;
    var ilosc = pap_ilosc_paczek.value;
    var ilosc_wpaczce = pap_ilosc_wpaczce.value;

    pap_ilosc_szt.value = ilosc * ilosc_wpaczce;
    pap_ilosc_sztang.value = ilosc / 10;
    if (pap_obliczone == true) {
        ponowneObliczanie();
    }
};
function obliczIloscSztangi() {
    pap_pole = 3;
    var ilosc = pap_ilosc_sztang.value;
    var ilosc_wpaczce = pap_ilosc_wpaczce.value;

    pap_ilosc_szt.value = ilosc * ilosc_wpaczce * 10;
    pap_ilosc_paczek.value = ilosc * 10;
    if (pap_obliczone == true) {
        ponowneObliczanie();
    }
};
function obliczIloscSztukiWPaczce() {
    if (pap_pole == 1) obliczIloscSztuki();
    if (pap_pole == 2) obliczIloscPaczki();
    if (pap_pole == 3) obliczIloscSztangi();
};
// funkcjonalność ponownego obliczania
function ponowneObliczanie() {
    if (pap_ilosc_szt.value != 0 && pap_ilosc_szt.value != "") {
        obliczPapierosy();
    }
}
// funkcja uruchamiana po naciśnięciu przycisku oblicz papierosy
function obliczPapierosy() {
    // Sprawdzenie czy pola edytowalne nie są puste i nie soą mniejsze od zera!!
    if (pap_ilosc_szt.value == "" || pap_ilosc_szt.value <= 0 || pap_ilosc_wpaczce.value == "" || pap_ilosc_wpaczce.value <= 0) {
        wynik_1.innerHTML = "Wypełnij poprawnie pole ilość";
        wynik_2.innerHTML = "";
    }
    else {
        pap_obliczone = true;
        //czyszczenie pól wynikowych
        wynik_1.innerHTML = "";
        wynik_2.innerHTML = "";
        //Wprowadzona ilość papierosów
        var ilosc_pap = pap_ilosc_szt.value;
        //Obliczanie należności
        var ilosc_tys_szt = ilosc_pap / 1000;
        var pap_wartosc_celna = Math.round(document.getElementById('pap_wartosc_celna').value * ilosc_tys_szt);
        if (pap_wartosc_celna == 0) pap_wartosc_celna = 1;
        var pap_clo = Math.round(pap_wartosc_celna * (pap_stawka_cło / 100));
        //Wyliczenie akcyzy powodowane innym sposoem wylicania
        if (stawki_rok.value >= 2018) {
            var pap_akcyza = Math.round((ilosc_pap * pap_stawka_akcyzy_1000_szt / 1000) + (max_cena_detaliczna * ilosc_pap / 1000) * (stawka_akcyzy_wyroby_tyt / 100));
        } else {
            var pap_stawka_akcyzy_procentowa = Math.round(100 * (srednia_wazona_detaliczna_cena_sprzedazy * 3 * stawka_akcyzy_wyroby_tyt / 100)) / 100;
            var pap_stawka_akcyzy_1_szt = Math.round(10000 * (pap_stawka_akcyzy_1000_szt + pap_stawka_akcyzy_procentowa) / 1000) / 10000;
            var pap_akcyza = Math.round(ilosc_pap * pap_stawka_akcyzy_1_szt);
        }
        var pap_vat = Math.round((pap_wartosc_celna + pap_clo + pap_akcyza) * (stawka_vat / 100));
        var pap_wartosc_szacunkowa = Math.round(srednia_wazona_detaliczna_cena_sprzedazy / 1000 * ilosc_pap);
        var suma_naleznosci = pap_clo + pap_akcyza + pap_vat;

        //wypisywanie dla odpowiedniego zaznaczenia przemyt/nabycie
        if (typ_przemyt.checked == false && typ_nabycie.checked == false) {
            wynik_1.innerHTML = "Wybierz opcje nabycie lub przemyt!";
        } else if (typ_przemyt.checked == true) {
            wynik_1.innerHTML = "Wartość celna wynosi: " + pap_wartosc_celna + ",00 PLN<br>Cło wynosi: " + pap_clo + ",00 PLN<br>Akcyza wynosi: " + pap_akcyza + ",00 PLN<br> VAT wynosi: " + pap_vat + ",00 PLN<br> Wartość szacunkowa wynosi: " + pap_wartosc_szacunkowa + ",00 PLN<br> Suma należności wynosi: " + suma_naleznosci + ",00 PLN";
            //włączenie zdarzenie na radio nabycie
            typ_nabycie.addEventListener('click', obliczPapierosy, false);
            //wywołanie funkcji obliczającej przestępstwo(0-przemyt, 1-Nabycie)
            wynik_2.innerHTML = sprawdzPrzestepstwoPrzemyt(pap_akcyza, pap_vat, pap_clo, prog_przetępstwa);
        } else {
            wynik_1.innerHTML = "Akcyza wynosi: " + pap_akcyza + ",00 PLN<br> VAT wynosi: " + pap_vat + ",00 PLN<br>Wartość szacunkowa wynosi: " + pap_wartosc_szacunkowa + ",00 PLN";
            //włączenie zdarzenie na radio nabycie
            typ_przemyt.addEventListener('click', obliczPapierosy, false);
            //wywołanie funkcji obliczającej przestępstwo(0-przemyt, 1-Nabycie)
            wynik_2.innerHTML = sprawdzPrzestepstwoNabycie(pap_akcyza, prog_przetępstwa);
        }
        // wyświetlanie części odpowiedzialnej za łączne obliczenia
        if (wynik_1.value != "" && wynik_2.value != "" && (typ_przemyt.checked == true || typ_nabycie.checked == true)) {
            document.getElementById('kalkAddMenuWraper').classList.remove('ukryj');
        }
    };
    // funkcjonalność przekazująca do pamięci czy zostało popełnione przestępstwo
    var przekroczenieProgu = false;
    if (sprawdzPrzestepstwoNabycie(pap_akcyza, prog_przetępstwa) != "Wykroczenie") {
        przekroczenieProgu = true;
    } else {
        przekroczenieProgu = false;
    }
    //funkcjonalność zwracająca zmienne clelem ich zgrania przez plik wspólny do pamięci przeglądarki
    return akcyza = pap_akcyza, vat = pap_vat, clo = pap_clo, iloscZew = ilosc_pap, progZew = prog_przetępstwa, czyPrzekroczonoProg = przekroczenieProgu;
};
// Koniec funkcji oblicz papierosy
// funkcjonalność wyboru roku i zapytania ajax
var stawki_rok = document.getElementById('stawki_rok');
// Obsłóga przycisku z zapytaniem o stawki dla microsoftu
document.getElementById('ieStawkiZapBtn').addEventListener('click', function(){
    zapytanieStawki();
},false);
stawki_rok.addEventListener('input', zapytanieStawki, true);
function zapytanieStawki() {
    var req = createObject();
    req.open('GET', '/stawki/' + stawki_rok.value, true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            document.getElementById('serverError').innerHTML = "";
            var doc = "(" + req.responseText + ")";
            var noweStawki = eval(doc);
            wypiszNoweStawki(noweStawki);
            if (pap_ilosc_szt.value != "" && pap_ilosc_szt.value > 0) {
                obliczPapierosy();
            }
        } else {
            document.getElementById('serverError').innerText = "Błąd: " + req.status;
        };
    };
};
// Koniec pozyskiwania nowych stawek
function wypiszNoweStawki(noweStawki) {
    pap_wartosc_celna = document.getElementById('pap_wartosc_celna').value = noweStawki.stawki.pap_wartosc_celna;
    pap_stawka_cło = document.getElementById('pap_stawka_cło').value = noweStawki.stawki.pap_stawka_cło;
    pap_stawka_akcyzy_1000_szt = document.getElementById('pap_stawka_akcyzy_1000_szt').value = noweStawki.stawki.pap_stawka_akcyzy_1000_szt;
    srednia_wazona_detaliczna_cena_sprzedazy = document.getElementById('srednia_wazona_detaliczna_cena_sprzedazy').value = noweStawki.stawki.srednia_wazona_detaliczna_cena_sprzedazy;
    stawka_akcyzy_wyroby_tyt = document.getElementById('stawka_akcyzy_wyroby_tyt').value = noweStawki.stawki.stawka_akcyzy_wyroby_tyt;
    stawka_vat = document.getElementById('stawka_vat').value = noweStawki.stawki.stawka_vat;
    prog_przetępstwa = document.getElementById('prog_przetępstwa').value = noweStawki.stawki.prog_przetępstwa;
};
// Koniec przypisywanie nowych stawek do pól
//Zmienne stałeł wczytywane z div stawki
var wod_stawka_cło = document.getElementById('wod_stawka_cło').value; //procent w EURO
var alk_stawka_akcyzy_100_procent = document.getElementById('alk_stawka_akcyzy_100_procent').value;
var stawka_vat = document.getElementById('stawka_vat').value;
var wod_wartość_rynkowa = document.getElementById('wod_wartość_rynkowa').value;
var prog_przetępstwa = document.getElementById('prog_przetępstwa').value;
// zmienne do których przekazywane są wyliczenia clelm przeniesienia do par i Add
var iloscZew = 0;
var progZew = 0;
var akcyza = 0;
var czyPrzekroczonoProg = false;
var clo = 0;
var vat = 0;
var wod_obliczone = false; // część odpowiadająca za odpalanie ponowne obliczenia
// przypisywanie pul i przycisku do zmiennych do zmiennych spirytus	
var wod_ilosc_l = document.getElementById('wod_ilosc_l');
var wod_ilosc_procent = document.getElementById('wod_ilosc_procent');
var btn_oblicz = document.getElementById('btn_oblicz');
var typ_przemyt = document.getElementById('typ_przemyt');
var typ_nabycie = document.getElementById('typ_nabycie');
//przypisanie elementu div wynik papierosy
var wynik_1 = document.getElementById("wynik_1");
var wynik_2 = document.getElementById("wynik_2");
//wywoływanie obliczneń ilości papierosów po zmianie
// funkcjonalność ponownego obliczania
wod_ilosc_l.addEventListener('input', function () {
    if (wod_obliczone == true) {
        ponowneObliczanie();
    }
});
//funkcjonalność ponownego obliczania
wod_ilosc_procent.addEventListener('input', function () {
    if (wod_obliczone == true) {
        ponowneObliczanie();
    }
});
function ponowneObliczanie() {
    if (wod_ilosc_l.value != 0 && wod_ilosc_l.value != "" && wod_ilosc_l.value != 0 && wod_ilosc_l.value != "") {
        obliczWodka();
    }
}
btn_oblicz.addEventListener('click', obliczWodka, false);
function obliczWodka() {
    wynik_1.innerHTML = "Wypełnij poprawnie pola";
    // Sprawdzenie czy pola edytowalne nie są puste i nie soą mniejsze od zera!!
    if (wod_ilosc_l.value == "" || wod_ilosc_l.value <= 0 || wod_ilosc_procent.value == "" || wod_ilosc_procent.value <= 0) {
        wynik_1.innerHTML = "Wypełnij poprawnie pola";
        wynik_2.innerHTML = "";
    }
    else {
        wod_obliczone = true;
        //czyszczenie pól wynikowych
        wynik_1.innerHTML = "";
        wynik_2.innerHTML = "";
        //Wprowadzona ilość spirytusu
        var ilosc_l_wod = wod_ilosc_l.value;
        var procent_wod = wod_ilosc_procent.value;
        //Obliczanie należności
        var wod_wartosc_celna = Math.ceil(ilosc_l_wod * 13);
        var wod_clo = Math.round((ilosc_l_wod / 100) * wod_stawka_cło);
        var wod_akcyza = Math.round(ilosc_l_wod * (procent_wod / 100) * (alk_stawka_akcyzy_100_procent / 100));
        var wod_vat = Math.round((wod_wartosc_celna + wod_clo + wod_akcyza) * (stawka_vat / 100));
        var wod_wartosc_szacunkowa = Math.round(wod_wartość_rynkowa * ilosc_l_wod);
        var suma_naleznosci = wod_clo + wod_akcyza + wod_vat;

        //wypisywanie dla odpowiedniego zaznaczenia przemyt/nabycie
        if (typ_przemyt.checked == false && typ_nabycie.checked == false) {
            wynik_1.innerHTML = "Wybierz opcje nabycie lub przemyt!";
        } else if (typ_przemyt.checked == true) {
            wynik_1.innerHTML = "Wartość celna wynosi: " + wod_wartosc_celna + ",00 PLN<br>Cło wynosi: " + wod_clo + ",00 PLN<br>Akcyza wynosi: " + wod_akcyza + ",00 PLN<br> VAT wynosi: " + wod_vat + ",00 PLN<br> Wartość szacunkowa wynosi: " + wod_wartosc_szacunkowa + ",00 PLN<br> Suma należności wynosi: " + suma_naleznosci + ",00 PLN";
            //włączenie zdarzenie na radio nabycie
            typ_nabycie.addEventListener('click', obliczWodka, false);
            //wywołanie funkcji obliczającej przestępstwo(0-przemyt, 1-Nabycie)
            wynik_2.innerHTML = sprawdzPrzestepstwoPrzemyt(wod_akcyza, wod_vat, wod_clo, prog_przetępstwa);
        } else {
            wynik_1.innerHTML = "Akcyza wynosi: " + wod_akcyza + ",00 PLN<br> VAT wynosi: " + wod_vat + ",00 PLN<br>Wartość szacunkowa wynosi: " + wod_wartosc_szacunkowa + ",00 PLN";
            //włączenie zdarzenie na radio nabycie
            typ_przemyt.addEventListener('click', obliczWodka, false);
            //wywołanie funkcji obliczającej przestępstwo(0-przemyt, 1-Nabycie)
            wynik_2.innerHTML = sprawdzPrzestepstwoNabycie(wod_akcyza, prog_przetępstwa);
            // wyświetlanie części odpowiedzialnej za łączne obliczenia
        }
        // wyświetlanie części odpowiedzialnej za łączne obliczenia
        if (wynik_1.value != "" && wynik_2.value != "" && (typ_przemyt.checked == true || typ_nabycie.checked == true)) {
            document.getElementById('kalkAddMenuWraper').classList.remove('ukryj');
        }
        // funkcjonalność przekazująca do pamięci czy zostało popełnione przestępstwo
        var przekroczenieProgu = false;
        if (sprawdzPrzestepstwoNabycie(wod_akcyza, prog_przetępstwa) != "Wykroczenie") {
            przekroczenieProgu = true;
        } else {
            przekroczenieProgu = false;
        }
        //funkcjonalność zwracająca zmienne clelem ich zgrania przez plik wspólny do pamięci przeglądarki
        return akcyza = wod_akcyza, vat = wod_vat, clo = wod_clo, iloscZew = ilosc_l_wod, progZew = prog_przetępstwa, czyPrzekroczonoProg = przekroczenieProgu;
    }
};
// funkcjonalność wyboru roku i zapytania ajax
var stawki_rok = document.getElementById('stawki_rok');
function createObject() {
    return new XMLHttpRequest();
}
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
            if (wod_ilosc_l.value != "" && wod_ilosc_l.value > 0) {
                obliczWodka();
            }
        } else {
            document.getElementById('serverError').innerText = "Błąd: " + req.status;
        };
    };
};
// Koniec pozyskiwania nowych stawek
function wypiszNoweStawki(noweStawki) {
    wod_stawka_cło = document.getElementById('wod_stawka_cło').value = noweStawki.stawki.wod_stawka_cło;
    alk_stawka_akcyzy_100_procent = document.getElementById('alk_stawka_akcyzy_100_procent').value = noweStawki.stawki.alk_stawka_akcyzy_100_procent;
    stawka_vat = document.getElementById('stawka_vat').value = noweStawki.stawki.stawka_vat;
    wod_wartość_rynkowa = document.getElementById('wod_wartość_rynkowa').value = noweStawki.stawki.wod_wartość_rynkowa;
    prog_przetępstwa = document.getElementById('prog_przetępstwa').value = noweStawki.stawki.prog_przetępstwa;
};
// Koniec przypisywanie nowych stawek do pul
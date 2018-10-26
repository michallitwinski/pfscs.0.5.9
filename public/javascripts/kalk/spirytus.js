//Zmienne stałe wczytywane z diva stawki
var spi_stawka_cło = document.getElementById('spi_stawka_cło').value; //procent w EURO
var alk_stawka_akcyzy_100_procent = document.getElementById('alk_stawka_akcyzy_100_procent').value;
var stawka_vat = document.getElementById('stawka_vat').value;
var spi_wartość_rynkowa = document.getElementById('spi_wartość_rynkowa').value;
var prog_przetępstwa = document.getElementById('prog_przetępstwa').value;
// zmienne do których przekazywane są wyliczenia clelm przeniesienia do par i Add
var iloscZew = 0;
var progZew = 0;
var czyPrzekroczonoProg = false;
var akcyza = 0;
var clo = 0;
var vat = 0;
var spi_obliczone = false; // część odpowiadająca za odpalanie ponowne obliczenia
// przypisywanie pul i przycisku do zmiennych do zmiennych spirytus	
var spi_ilosc_l = document.getElementById('spi_ilosc_l');
var spi_ilosc_procent = document.getElementById('spi_ilosc_procent');
var kurs_euro = document.getElementById('kurs_euro');
var btn_oblicz = document.getElementById('btn_oblicz');
var typ_przemyt = document.getElementById('typ_przemyt');
var typ_nabycie = document.getElementById('typ_nabycie');
// funkcjonalność ukrywająca euro przy nabyciu
typ_nabycie.addEventListener('change', function () {
    if (this.checked) {
        var obiekty = document.getElementsByClassName('spirytusEuro');
        for (var i = 0; i < obiekty.length; i++) {
            obiekty[i].classList.add('ukryj');
        }
    }
}, false);
typ_przemyt.addEventListener('change', spiOdkryjKursEuro, false);
function spiOdkryjKursEuro() {
    if (this.checked) {
        var obiekty = document.getElementsByClassName('spirytusEuro');
        for (var i = 0; i < obiekty.length; i++) {
            obiekty[i].classList.remove('ukryj');
        }
    }
}
//przypisanie elementu div wynik papierosy
var wynik_1 = document.getElementById("wynik_1");
var wynik_2 = document.getElementById("wynik_2");
// funkcjonalność ponownego obliczania
spi_ilosc_l.addEventListener('input', function () {
    if (spi_obliczone == true) {
        ponowneObliczanie();
    }
});
//funkcjonalność ponownego obliczania
spi_ilosc_procent.addEventListener('input', function () {
    if (spi_obliczone == true) {
        ponowneObliczanie();
    }
});
function ponowneObliczanie() {
    if (spi_ilosc_l.value != 0 && spi_ilosc_l.value != "" && spi_ilosc_procent.value != 0 && spi_ilosc_procent.value != "") {
        obliczSpirytus();
        if (typ_przemyt.checked == true) {
            spiOdkryjKursEuro();
        }
    }
}
//funkcja obliczająca należności
btn_oblicz.addEventListener('click', obliczSpirytus, false);
function obliczSpirytus() {
    // Sprawdzenie czy pola edytowalne nie są puste i nie soą mniejsze od zera!!
    if (spi_ilosc_l.value == "" || spi_ilosc_l.value <= 0 || spi_ilosc_procent.value == "" || spi_ilosc_procent.value <= 0 || kurs_euro.value == "" || kurs_euro.value <= 0) {
        wynik_1.innerHTML = "Wypełnij poprawnie pola";
        wynik_2.innerHTML = "";
    } else {
        spi_obliczone = true;
        //czyszczenie pól wynikowych
        wynik_1.innerHTML = "";
        wynik_2.innerHTML = "";
        //Wprowadzona ilość spirytusu
        var ilosc_l_spi = spi_ilosc_l.value;
        var procent_spi = spi_ilosc_procent.value;
        var euro_kurs = kurs_euro.value;
        //Obliczanie należności
        var spi_wartosc_celna = Math.ceil(ilosc_l_spi * 17.5);
        var spi_clo = Math.round((ilosc_l_spi / 100) * spi_stawka_cło * euro_kurs);
        var spi_akcyza = Math.round(ilosc_l_spi * (procent_spi / 100) * (alk_stawka_akcyzy_100_procent / 100));
        var spi_vat = Math.round((spi_wartosc_celna + spi_clo + spi_akcyza) * (stawka_vat / 100));
        var spi_wartosc_szacunkowa = Math.round(spi_wartość_rynkowa * ilosc_l_spi);
        var suma_naleznosci = spi_clo + spi_akcyza + spi_vat;

        //wypisywanie dla odpowiedniego zaznaczenia przemyt/nabycie
        if (typ_przemyt.checked == false && typ_nabycie.checked == false) {
            wynik_1.innerHTML = "Wybierz opcje nabycie lub przemyt!";
        } else if (typ_przemyt.checked == true) {
            wynik_1.innerHTML = "Wartość celna wynosi: " + spi_wartosc_celna + ",00 PLN<br>Cło wynosi: " + spi_clo + ",00 PLN<br>Akcyza wynosi: " + spi_akcyza + ",00 PLN<br> VAT wynosi: " + spi_vat + ",00 PLN<br> Wartość szacunkowa wynosi: " + spi_wartosc_szacunkowa + ",00 PLN<br> Suma należności wynosi: " + suma_naleznosci + ",00 PLN";
            //włączenie zdarzenie na radio nabycie
            typ_nabycie.addEventListener('click', obliczSpirytus, false);
            //wywołanie funkcji obliczającej przestępstwo(0-przemyt, 1-Nabycie)
            wynik_2.innerHTML = sprawdzPrzestepstwoPrzemyt(spi_akcyza, spi_vat, spi_clo, prog_przetępstwa);
        } else {
            wynik_1.innerHTML = "Akcyza wynosi: " + spi_akcyza + ",00 PLN<br> VAT wynosi: " + spi_vat + ",00 PLN<br>Wartość szacunkowa wynosi: " + spi_wartosc_szacunkowa + ",00 PLN";
            //włączenie zdarzenie na radio nabycie
            typ_przemyt.addEventListener('click', obliczSpirytus, false);
            //wywołanie funkcji obliczającej przestępstwo(0-przemyt, 1-Nabycie)
            wynik_2.innerHTML = sprawdzPrzestepstwoNabycie(spi_akcyza, prog_przetępstwa);
        }
        // wyświetlanie części odpowiedzialnej za łączne obliczenia
        if (wynik_1.value != "" && wynik_2.value != "" && (typ_przemyt.checked == true || typ_nabycie.checked == true)) {
            document.getElementById('kalkAddMenuWraper').classList.remove('ukryj');
        }
    }
    // funkcjonalność przekazująca do pamięci czy zostało popełnione przestępstwo
    var przekroczenieProgu = false;
    if (sprawdzPrzestepstwoNabycie(spi_akcyza, prog_przetępstwa) != "Wykroczenie") {
        przekroczenieProgu = true;
    } else {
        przekroczenieProgu = false;
    }
    //funkcjonalność zwracająca zmienne clelem ich zgrania przez plik wspólny do pamięci przeglądarki
    return akcyza = spi_akcyza, vat = spi_vat, clo = spi_clo, iloscZew = ilosc_l_spi, progZew = prog_przetępstwa, czyPrzekroczonoProg = przekroczenieProgu;
};
//Koniec funkcji oblicz
//początek funkcji pobierającej kurs EURO on i onload
//przypisanie elementów w divie stawki
var wynik_stawki = document.getElementById('wynik_stawki');
var btn_kurs_dnia_pokaz = document.getElementById('btn_kurs_dnia_pokaz');
var kurs_dnia_input = document.getElementById('kurs_dnia_input');
var kurs_dnia_div = document.getElementById('kurs_dnia_div');
//koniec przypisania elementów
// nowy obiek żądania
function createObject() {
    return new XMLHttpRequest();
};
// Funkcja on load odpalana na onload pliku Wspólne
function spirytusLoad() {
    var req = createObject();
    req.open('GET', "http://api.nbp.pl/api/exchangerates/rates/a/eur/?format=xml", true);
    req.send(null);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var doc = req.responseXML;
            kurs_euro.value = doc.getElementsByTagName("Mid")[0].childNodes[0].nodeValue;
            wynik_stawki.innerHTML = "pobrano z tabeli kursów NBP nr: " + doc.getElementsByTagName("No")[0].childNodes[0].nodeValue;
            btn_kurs_dnia_pokaz.style.display = "block";
        } else {
            kurs_euro.value = 0;
            wynik_stawki.innerHTML = " Nie udało połączyć się z tabelą kursów NBP";
            btn_kurs_dnia_pokaz.style.display = "none";
        }
    };
};
// funkcjonalność wyboru roku i zapytania ajax
var stawki_rok = document.getElementById('stawki_rok');
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
            if (spi_ilosc_l.value != "" && spi_ilosc_l.value > 0) {
                obliczSpirytus();
            }
        } else {
            document.getElementById('serverError').innerText = "Błąd: " + req.status;
        };
    };
};
// Koniec pozyskiwania nowych stawek
function wypiszNoweStawki(noweStawki) {
    spi_stawka_cło = document.getElementById('spi_stawka_cło').value = noweStawki.stawki.spi_stawka_cło;//procent w EURO
    alk_stawka_akcyzy_100_procent = document.getElementById('alk_stawka_akcyzy_100_procent').value = noweStawki.stawki.alk_stawka_akcyzy_100_procent;
    stawka_vat = document.getElementById('stawka_vat').value = noweStawki.stawki.stawka_vat;
    spi_wartość_rynkowa = document.getElementById('spi_wartość_rynkowa').value = noweStawki.stawki.spi_wartość_rynkowa;
    prog_przetępstwa = document.getElementById('prog_przetępstwa').value = noweStawki.stawki.prog_przetępstwa;
};
// Koniec przypisywanie nowych stawek do pul
// Poczontek funkcji pobierającej kurs dnia
// funkcja wypisująca dzisiejszy dzien do input
btn_kurs_dnia_pokaz.addEventListener('click', currentDate, false);
var curent_date = 0;
function currentDate() {
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
    data = y + "-" + m + "-" + d;
    kurs_dnia_input.value = data;
    btn_kurs_dnia_pokaz.style.display = "none";
    kurs_dnia_div.style.display = "block";
    return curent_date = data;
};
// funkcja pobierająca nowy kurs z podaną datą
kurs_dnia_input.addEventListener('input', kursDnia, true);
function kursDnia() {
    //pobieranie obecnej i nowej daty i przetwarzanie
    var inputDate = new Date(kurs_dnia_input.value),
        d = inputDate.getDate(),
        m = inputDate.getMonth() + 1,
        y = inputDate.getFullYear(),
        dn = inputDate.getDay(),
        in_data;
    if (d < 10) {
        d = "0" + d;
    };
    if (m < 10) {
        m = "0" + m;
    };
    in_data = y + "-" + m + "-" + d;
    // część funkcji walidującej date
    if (curent_date < in_data) {
        wynik_stawki.innerHTML = " przyszłe kursy walut nie są dostępne";
    } else if (dn == 0 || dn == 6) {
        wynik_stawki.innerHTML = " NBP nie publikuje tabeli kursów na weekend";
    } else {
        var req = createObject();
        req.open('GET', "http://api.nbp.pl/api/exchangerates/rates/a/eur/" + in_data + "/?format=xml", true);
        req.send(null);
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                var doc = req.responseXML;
                kurs_euro.value = doc.getElementsByTagName("Mid")[0].childNodes[0].nodeValue;
                wynik_stawki.innerHTML = "pobrano z tabeli kursów NBP nr: " + doc.getElementsByTagName("No")[0].childNodes[0].nodeValue;
            } else {
                kurs_euro.value = 0;
                wynik_stawki.innerHTML = " Nie udało połączyć się z tabelą kursów NBP";
            }
        }
    }
};
//konec funkcji pobierającej kurs EURO
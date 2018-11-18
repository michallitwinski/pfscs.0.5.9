//zmienne wczytywane z dviwa stawki
var tyt_stawka_cło = document.getElementById('tyt_stawka_cło').value;
var tyt_kwotowa_stawka_akcyzy_1_kg = document.getElementById('tyt_kwotowa_stawka_akcyzy_1_kg').value;
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
var tyt_obliczone = false; // część odpowiadająca za odpalanie ponowne obliczenia
// przypisywanie pul i przycisku do zmiennych do zmiennych tytoń
var tyt_ilosc_kg = document.getElementById('tyt_ilosc_kg');
var tyt_ilosc_gr = document.getElementById('tyt_ilosc_gr');
var btn_oblicz = document.getElementById('btn_oblicz');
var typ_przemyt = document.getElementById('typ_przemyt');
var typ_nabycie = document.getElementById('typ_nabycie');
//przypisanie elementu div wynik tytoń
var wynik_1 = document.getElementById("wynik_1");
var wynik_2 = document.getElementById("wynik_2");
//wywoływanie obliczneń tytoń
tyt_ilosc_kg.addEventListener('input', obliczIloscKgTyton, false);
tyt_ilosc_gr.addEventListener('input', obliczIloscGrTyton, false);
btn_oblicz.addEventListener('click', obliczTyton, false);
//funkcje dynamicznie liczące wprowadzane pola tyton
function obliczIloscKgTyton() {
    var tyton_kg = tyt_ilosc_kg.value;
    tyt_ilosc_gr.value = tyton_kg * 1000;
    if(tyt_obliczone == true){
        ponowneObliczanie();
    }
}
function obliczIloscGrTyton() {
    var tyton_gr = tyt_ilosc_gr.value;
    tyt_ilosc_kg.value = tyton_gr / 1000;
    tyt_ilosc_gr.value = Math.round(tyton_gr);
    if(tyt_obliczone == true){
        ponowneObliczanie();
    }
}
// funkcjonalność ponownego obliczania
function ponowneObliczanie(){
    if(tyt_ilosc_kg.value != 0 && tyt_ilosc_kg.value != ""){
        obliczTyton();
    }
}
// funkcja uruchamiana po naciśnięciu przycisku oblicz tytoń
function obliczTyton() {
    if (tyt_ilosc_kg.value == "" || tyt_ilosc_kg.value <= 0) {
        wynik_1.innerHTML = "Wypełnij poprawnie pole ilość";
        wynik_2.innerHTML = "";
    }
    else {
        tyt_obliczone = true;
        wynik_1.innerHTML = "";
        wynik_2.innerHTML = "";
        //Wprowadzona ilość tytoni gr
        var ilosc_tyt = tyt_ilosc_kg.value;
        var tyt_wartosc_celna = Math.round(document.getElementById('tyt_wartosc_celna').value * ilosc_tyt);
        if (tyt_wartosc_celna == 0) tyt_wartosc_celna = 1;
        var tyt_clo = Math.round(tyt_wartosc_celna * (tyt_stawka_cło / 100));
        if (stawki_rok.value >= 2018) {
            var tyt_akcyza = Math.round((ilosc_tyt * tyt_kwotowa_stawka_akcyzy_1_kg) + (max_cena_detaliczna * ilosc_tyt) * (stawka_akcyzy_wyroby_tyt / 100));
        } else {
            var tyt_stawka_akcyzy_procentowa = Math.round(100 * (srednia_wazona_detaliczna_cena_sprzedazy * 3 * stawka_akcyzy_wyroby_tyt / 100)) / 100;
            var tyt_stawka_akcyzy_1_kg = tyt_stawka_akcyzy_procentowa + tyt_kwotowa_stawka_akcyzy_1_kg;
            var tyt_akcyza = Math.round(ilosc_tyt * tyt_stawka_akcyzy_1_kg);
        }
        var tyt_vat = Math.round((tyt_wartosc_celna + tyt_clo + tyt_akcyza) * (stawka_vat / 100));
        var tyt_wartosc_szacunkowa = Math.round(srednia_wazona_detaliczna_cena_sprzedazy * ilosc_tyt);
        var suma_naleznosci = tyt_clo + tyt_akcyza + tyt_vat;

        //wypisywanie dla odpowiedniego zaznaczenia przemyt/nabycie
        if (typ_przemyt.checked == false && typ_nabycie.checked == false) {
            wynik_1.innerHTML = "Wybierz opcje nabycie lub przemyt!";
        } else if (typ_przemyt.checked == true) {
            wynik_1.innerHTML = "Wartość celna wynosi: " + tyt_wartosc_celna + ",00 PLN<br>Cło wynosi: " + tyt_clo + ",00 PLN<br>Akcyza wynosi: " + tyt_akcyza + ",00 PLN<br> VAT wynosi: " + tyt_vat + ",00 PLN<br> Wartość szacunkowa wynosi: " + tyt_wartosc_szacunkowa + ",00 PLN<br> Suma należności wynosi: " + suma_naleznosci + ",00 PLN";
            //włączenie zdarzenie na radio nabycie
            typ_nabycie.addEventListener('click', obliczTyton, false);
            //wywołanie funkcji obliczającej przestępstwo(1-przemyt, 0-Nabycie)
            wynik_2.innerHTML = sprawdzPrzestepstwoPrzemyt(tyt_akcyza, tyt_vat, tyt_clo, prog_przetępstwa);
        } else {
            wynik_1.innerHTML = "Akcyza wynosi: " + tyt_akcyza + ",00 PLN<br> VAT wynosi: " + tyt_vat + ",00 PLN<br>Wartość szacunkowa wynosi: " + tyt_wartosc_szacunkowa + ",00 PLN";
            typ_przemyt.addEventListener('click', obliczTyton, false);
            //wywołanie funkcji obliczającej przestępstwo(1-przemyt, 0-Nabycie)
            wynik_2.innerHTML = sprawdzPrzestepstwoNabycie(tyt_akcyza, prog_przetępstwa);
        }
        // wyświetlanie części odpowiedzialnej za łączne obliczenia
        if (wynik_1.value != "" && wynik_2.value != "" && (typ_przemyt.checked == true || typ_nabycie.checked == true)) {
            document.getElementById('kalkAddMenuWraper').classList.remove('ukryj');
        }
    }
    // funkcjonalność przekazująca do pamięci czy zostało popełnione przestępstwo
    var przekroczenieProgu = false;
    if (sprawdzPrzestepstwoNabycie(tyt_akcyza, prog_przetępstwa) != "Wykroczenie") {
        przekroczenieProgu = true;
    } else {
        przekroczenieProgu = false;
    }
    //funkcjonalność zwracająca zmienne clelem ich zgrania przez plik wspólny do pamięci przeglądarki
    return akcyza = tyt_akcyza, vat = tyt_vat, clo = tyt_clo, iloscZew = ilosc_tyt, progZew = prog_przetępstwa, czyPrzekroczonoProg = przekroczenieProgu;
}
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
            if (tyt_ilosc_kg.value != "" && tyt_ilosc_kg.value > 0) {
                obliczTyton();
            }
        } else {
            document.getElementById('serverError').innerText = "Błąd: " + req.status;
        };
    };
};
// Koniec pozyskiwania nowych stawek
function wypiszNoweStawki(noweStawki) {
    tyt_wartosc_celna = document.getElementById('tyt_wartosc_celna').value = noweStawki.stawki.tyt_wartosc_celna;
    tyt_stawka_cło = document.getElementById('tyt_stawka_cło').value = noweStawki.stawki.tyt_stawka_cło;
    tyt_kwotowa_stawka_akcyzy_1_kg = document.getElementById('tyt_kwotowa_stawka_akcyzy_1_kg').value = noweStawki.stawki.tyt_kwotowa_stawka_akcyzy_1_kg;
    srednia_wazona_detaliczna_cena_sprzedazy = document.getElementById('srednia_wazona_detaliczna_cena_sprzedazy').value = noweStawki.stawki.srednia_wazona_detaliczna_cena_sprzedazy;
    stawka_akcyzy_wyroby_tyt = document.getElementById('stawka_akcyzy_wyroby_tyt').value = noweStawki.stawki.stawka_akcyzy_wyroby_tyt;
    stawka_vat = document.getElementById('stawka_vat').value = noweStawki.stawki.stawka_vat;
    prog_przetępstwa = document.getElementById('prog_przetępstwa').value = noweStawki.stawki.prog_przetępstwa;
};
// Koniec przypisywanie nowych stawek do póls
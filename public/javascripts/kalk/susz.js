//funkcja on load odpowiadająca za ukrycie dodawania nazwy uruchamiana w pliku wspólne
function suszload() {
    document.getElementById('kalkAddNazwaInput').classList.add('ukryj');
};
//zmienne wczytywane z diva 
var susz_stawka_akcyzy_1_kg = document.getElementById('susz_stawka_akcyzy_1_kg').value;
var stawka_vat = document.getElementById('stawka_vat').value;
var prog_przetępstwa = document.getElementById('prog_przetępstwa').value;
// zmienne do których przekazywane są wyliczenia clelm przeniesienia do par i Add
var iloscZew = 0;
var progZew = 0;
var czyPrzekroczonoProg = false;
var akcyza = 0;
var clo = 0;
var vat = 0;
var susz_obliczone = false; // część odpowiadająca za odpalanie ponowne obliczenia
// by działała wspólna funkcjonalność paragraf dla wszystkich zakładek
var typ_przemyt = false;
//przypisanie elementu div wynik szusz
var szusz_ilosz_kg = document.getElementById('susz_ilosc_kg');
var susz_ilosc_gr = document.getElementById('susz_ilosc_gr');
var btn_oblicz = document.getElementById('btn_oblicz');
//przypisanie elementu div wynik szusz
var wynik_1 = document.getElementById("wynik_1");
var wynik_2 = document.getElementById("wynik_2");
//wywoływanie obliczneń szusz
szusz_ilosz_kg.addEventListener('input', obliczIloscKgSusz, false);
susz_ilosc_gr.addEventListener('input', obliczIloscGrSusz, false);
btn_oblicz.addEventListener('click', obliczSusz, false);
//funkcje dynamicznie liczące wprowadzane pola szusz
function obliczIloscKgSusz() {
    var tyton_kg = szusz_ilosz_kg.value;
    susz_ilosc_gr.value = tyton_kg * 1000;
    if(susz_obliczone == true){
        ponowneObliczanie();
    }
}
function obliczIloscGrSusz() {
    var tyton_gr = susz_ilosc_gr.value;
    szusz_ilosz_kg.value = tyton_gr / 1000;
    susz_ilosc_gr.value = Math.round(tyton_gr);
}
function ponowneObliczanie(){
    if(szusz_ilosz_kg.value != 0 && szusz_ilosz_kg.value != ""){
        obliczSusz();
    }
}
// funkcja uruchamiana po naciśnięciu przycisku oblicz
function obliczSusz() {
    if (susz_ilosc_kg.value == "" || susz_ilosc_kg.value <= 0) {
        wynik_1.innerHTML = "Wypełnij poprawnie pole ilość";
        wynik_2.innerHTML = "";
    }
    else {
        susz_obliczone = true;
        wynik_1.innerHTML = "";
        wynik_2.innerHTML = "";
        //Wprowadzona ilość tytoni gr
        var susz_ilosc = susz_ilosc_kg.value;
        var susz_akcyza = Math.round(susz_ilosc * susz_stawka_akcyzy_1_kg);
        //wypisywanie dla odpowiedniego zaznaczenia przemyt/nabycie
        wynik_1.innerHTML = "Akcyza oraz wartość szacunkowa wynosi: " + susz_akcyza + " PLN";
        //wywołanie funkcji obliczającej przestępstwo(1-przemyt, 0-Nabycie)
        wynik_2.innerHTML = sprawdzPrzestepstwoNabycie(susz_akcyza, prog_przetępstwa);
        // wyświetlanie części odpowiedzialnej za łączne obliczenia
        if (wynik_1.value != "" && wynik_2.value != "") {
            document.getElementById('kalkAddMenuWraper').classList.remove('ukryj');
        }
    }
    // funkcjonalność przekazująca do pamięci czy zostało popełnione przestępstwo
    var przekroczenieProgu = false;
    if (sprawdzPrzestepstwoNabycie(susz_akcyza, prog_przetępstwa) != "Wykroczenie") {
        przekroczenieProgu = true;
    } else {
        przekroczenieProgu = false;
    }
    //funkcjonalność zwracająca zmienne clelem ich zgrania przez plik wspólny do pamięci przeglądarki
    return akcyza = susz_akcyza, iloscZew = susz_ilosc, progZew = prog_przetępstwa, czyPrzekroczonoProg = przekroczenieProgu;
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
            if (szusz_ilosz_kg.value != "" && szusz_ilosz_kg.value > 0) {
                obliczSusz();
            }
        } else {
            document.getElementById('serverError').innerText = "Błąd: " + req.status;
        };
    };
};
// Koniec pozyskiwania nowych stawek
function wypiszNoweStawki(noweStawki) {
    susz_stawka_akcyzy_1_kg = document.getElementById('susz_stawka_akcyzy_1_kg').value = noweStawki.stawki.susz_stawka_akcyzy_1_kg;
    prog_przetępstwa = document.getElementById('prog_przetępstwa').value = noweStawki.stawki.prog_przetępstwa;
};
// Koniec przypisywanie nowych stawek do pul
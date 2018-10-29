// przypisywanie pul i przycisku do zmiennych do zmiennych auta
var auta_data = document.getElementById('data_input');
var auta_pojemnosc_silnika = document.getElementById('pojemnosc_silnika');
var auta_kwota_zakupu = document.getElementById('kwota');
var auta_termin = document.getElementById('auta_termin');
var auta_waluta = document.getElementById('waluta');
var btn_oblicz = document.getElementById('btn_oblicz');
var wynik_kurs2 = document.getElementById('wynik_kurs2');
var wynik_kurs1 = document.getElementById('wynik_kurs1');
var wynik_kursInput = document.getElementById('wynik_kursInput');
//przypisanie elementu div wynik
var wynik_1 = document.getElementById("wynik_1");
var wynik_2 = document.getElementById("wynik_2");
// zmienne do których przekazywane są wyliczenia clelm przeniesienia do par i Add
var akcyza = 0;
// przypisywanie zdarzeń do funkcji
auta_data.addEventListener('input', obliczDni, false);
auta_waluta.addEventListener('input', ustawKurs, true);
btn_oblicz.addEventListener('click', obliczAuto, false);
// ponowne oblicznie poz mnianie
auta_pojemnosc_silnika.addEventListener('input', ponownieObliczAuto, false);
auta_kwota_zakupu.addEventListener('blur', ponownieObliczAuto, false);
//zmienne do obliczneń
var przekroczenie = false;
var prog_przetępstwa = document.getElementById('prog_przetępstwa').value;
var przekroczonoProg = false;
var dzienMiesaca = 31;
var dataTermin = "";
var dataPoczatek = "";
// funkcja onload czyli uzyskiwanie aktualnej daty i wgrywanie daty do pola data
function loadWriteDate(){
    var curentDate = new Date(),
        d = curentDate.getDate(),
        m = curentDate.getMonth()+1, 
        y = curentDate.getFullYear(),
        data;
    if(d < 10){
        d = "0"+d;
    };
    if(m < 10){
        m = "0"+m;
    };
    dzienMiesaca = iloscDni(m-1,y); //funkcjonalność licząca ile dni ma aktualny miesiąc
    data = y+"-"+m+"-"+d;
    auta_data.value = data;
}
// dalsza część funkcji onload zmiana wyglądu menu II (Par Add ?) na potrzeby smaochody
// Funkcja on load odpalana na onload pliku Wspólne
function autaLoad(){
    loadWriteDate();
    document.getElementById('kalkAddNazwaInput').classList.add('ukryj');
    document.getElementById('kalkAddplusBtn').setAttribute('class','ukryj');
    document.getElementById('kalkAddzapBtn').style.width = "44%";
    document.getElementById('kalkAddparBtn').style.width = "44%";
    document.getElementById('autoElementy').classList.add('ukryj');
    document.getElementById('kalkAddZlicz').classList.add('ukryj');
    document.getElementById('btn_protokoly').classList.add('ukryj');
};

//funkcja zwracająca ilość dni w podanym miesiącu
var iloscDni = function(month,year) {
    return new Date(year, month, 0).getDate();
};
// ponowne obliczenia wartość gdy wartość była wyliczona a zmieniono walutę bodź pojemność bądź datę
function ponownieObliczAuto(){
    if(wynik_2.innerHTML != ""){
        obliczAuto();
    }
}
// funkcjonalność wczytująca i porównująca daty oraz determinująca przekroczenie terminu
function obliczDni(){
    var curentDate = new Date();
    var inputDate = new Date(auta_data.value),
        d = inputDate.getDate(),
        m = inputDate.getMonth()+1,
        y = inputDate.getFullYear(),
        inputDateReturn;
    if(d < 10){
        d = "0"+d;
    };
    if(m < 10){
        m = "0"+m;
    };
    inputDateReturn = d+"-"+m+"-"+y; // data odsyłana do paragrafu
    dzienMiesaca = iloscDni(m-1,y);//funkcjonalność licząca ile dni na dany miesiąc
    var data1_ms = curentDate.getTime();
    var data2_ms = inputDate.getTime();
    var timeDiff = Math.abs(data2_ms - data1_ms);
    var dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // w przypadku licznia o dzień później zmienić na floor
    if(data1_ms<data2_ms){
        wynik_1.innerHTML = "Ten dzień jeszcze nie nastąpił!"
        przekroczenie = false;
    }else{ 
        if(dayDiff > auta_termin.value){
            przekroczenie = true;
            // funkcjonalność wyliczająca datę upłynięcia terminu (tu można spróbować wkleić część odpowiadającą z dni wolne)
            var termin = new Date(inputDate.setDate(inputDate.getDate() + 13)),
                td = termin.getDate(),
                tm = termin.getMonth()+1,
                ty = termin.getFullYear();
                if(td < 10){
                    td = "0"+td;
                };
                if(tm < 10){
                    tm = "0"+tm;
                };
                dataTermin = td+"-"+tm+"-"+ty;
            wynik_1.innerHTML = '<span style="color:red;">UWAGA!</span> - Termin na założenie deklaracji upłynął w dniu: '+dataTermin+'r.';
        }else{
            wynik_1.innerHTML = "Termin na założenie deklaracji AKC-U jeszcze nie upłynął"
            przekroczenie = false;
        }
    };
    // wywołanie funkcjonalności zapytania o walute
    if(auta_waluta.value != "PLN"){
        ustawKurs();
    };
    ponownieObliczAuto();
    return dataPoczatek = inputDateReturn;
};
// nowy obiek żądania
function createObject(){
    return new XMLHttpRequest();
};
// żądanie nowej waluty
function ustawKurs(){
    if(auta_waluta.value == "PLN"){
        wynik_kurs1.innerHTML = "";
        wynik_kurs2.innerHTML = "";
        wynik_kursInput.setAttribute("class", "ukryj");
        wynik_kursInput.value = 1;
    }else{
        // początek daty pobranie z pola input
        var data = auta_data.value;
        //ponowne wywołanie funkcji pobierającej kurs w przypadku gdy otrzymamy błąd 404 (dni wolne od pracy)
        var ponowneWywolanie = 0;
        var dniPoprzedniegoM = 0;
        function wywolajPonownie(zapData){
            ponowneWywolanie +=1;
            if(ponowneWywolanie<5){
                var nowaData = new Date(zapData),
                d = nowaData.getDate()-1,// dodać funkcję sprawdzania miesiąca i liczenia dni
                m = nowaData.getMonth()+1, 
                y = nowaData.getFullYear(),
                pomniejszonaData;
                if(d == 0){ // funkcjonalność zmieniająca miesiąc na poprzedni oraz odejmująca dni
                    m -= 1;
                        if(m == 0){
                            m = 12;
                            y -= 1;
                        }
                    d = dzienMiesaca;
                    if(ponowneWywolanie > 2+dniPoprzedniegoM){
                        d -= 1; 
                    }
                }else{
                    dniPoprzedniegoM += 1; // liczy dni które upłyneły zeszłego miesiąca i ddodaje do dni z ponownego wywołania
                }
                if(d < 10){
                d = "0"+d;
                };
                if(m < 10){
                m = "0"+m;
                };
                pomniejszonaData = y+"-"+m+"-"+d;
                zap(pomniejszonaData);
            };
        };
        //wywołanie funkcji pobierającej kurs dnia z pierwszą datą
        zap(data);
        function zap(zapData){
            var req = createObject();
            req.open('GET',"https://api.nbp.pl/api/exchangerates/rates/a/"+auta_waluta.value+"/"+zapData+"/?format=xml",true);
            req.send(null);
            req.onreadystatechange = function(){
                if(req.readyState == 4 && req.status == 200){
                    var doc = req.responseXML;
                    wynik_kurs1.innerHTML = "Kurs "+doc.getElementsByTagName("Code")[0].childNodes[0].nodeValue+" wynosi: ";
                    wynik_kursInput.setAttribute("class", "");
                    wynik_kursInput.value = doc.getElementsByTagName("Mid")[0].childNodes[0].nodeValue;
                    var text = "";
                    text += " pobrano z tabeli kursów NBP nr: "+doc.getElementsByTagName("No")[0].childNodes[0].nodeValue;
                    text += " z dnia: "+doc.getElementsByTagName("EffectiveDate")[0].childNodes[0].nodeValue+"<br>";
                    if(zapData != auta_data.value){
                        text += "tabele kusów są publikowane w dni robocze w południe"
                        if(ponowneWywolanie >= 1){
                            text += " wartość pobrano z poprzedniego dnia roboczego<br>";
                        }
                    }
                    text += "<br>";
                    wynik_kurs2.innerHTML = text;
                }else if(req.readyState ==4 && req.status == 404){
                    wywolajPonownie(zapData);
                }else{
                    wynik_kurs2.innerHTML = " Nie udało połączyć się z tabelą kursów NBP";
                    wynik_kursInput.setAttribute("class", "");
                    wynik_kurs1.innerHTML = "Wprowadź kurs: ";
                }
            };
        };  
    };
    setTimeout(function(){
        ponownieObliczAuto();
    }, 500);
};
//funkcjonalność obliczania należności
function obliczAuto(){
    wynik_1.innerHTML = "";
    if(auta_waluta.value != "PLN" && wynik_kursInput.value == 1 ){
        wynik_kursInput.value = "";
        setTimeout(function(){
            obliczAuto();
        }, 100);
    }
    if(auta_waluta.value == "PLN"){
        wynik_kursInput.value = 1;
    }
    if(auta_waluta.value != "PLN" && wynik_kursInput.value == ""){
        wynik_1.innerHTML = "Wprowadź kurs bądź wybierz ponownie walutę";
    }else{
        if(auta_kwota_zakupu.value == ""){
            wynik_1.innerHTML = "Wpisz kwotę";
        }else if(auta_kwota_zakupu.value < 0){
                wynik_1.innerHTML = "Wpisz poprawną kwotę";
        }else{
            wynik_1.innerHTML = "";
            var kwotaPln = Math.ceil(auta_kwota_zakupu.value*wynik_kursInput.value);
            var procent = Math.round(auta_pojemnosc_silnika.value*10)/1000;
            var auto_akcyza = Math.ceil(kwotaPln*procent);
            tekst = "";
            tekst += "Kwota akcyzy wynosi: "+auto_akcyza+" PLN<br>";
            if(auta_waluta.value != "PLN"){
                tekst += "Wartość w złotówkach wynosi: "+kwotaPln+" PLN<br>";
            }
            if(przekroczenie){
                tekst += ' <span style="color:red;">UWAGA!</span> - przekroczono termin w dniu: '+dataTermin+'r.';
                if(auto_akcyza < prog_przetępstwa){
                    tekst += " - Wykroczenie";
                }
                if(auto_akcyza > prog_przetępstwa){
                    var przekroczono = true;
                    tekst += " - Przestępstwo";
                }
                document.getElementById('kalkAddMenuWraper').classList.remove('ukryj')
            }       
            wynik_2.innerHTML = tekst;
            return akcyza = auto_akcyza, przekroczonoProg = przekroczono;
        }
    };
};

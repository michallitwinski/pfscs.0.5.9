//funkcjonalność uruchomiająca obliczenia na enter
document.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
        document.getElementById("btn_oblicz").click();
    }
});
//funkcjonalność druku
var btn_druk = document.getElementById('btn_druk');
btn_druk.addEventListener('click', drukujWynik, false);
function drukujWynik() {
    window.print();
};
// poniższy if jest by cały skrypt działał w zakładce zlicz
if (document.getElementById('kalkNazwa').innerHTML != "Należności") {
    // funkcja rozwijająca więcej (jest taka rozbudowana by może dodać animację)
    var btn_wiecej = document.getElementById('btn_wiecej');
    btn_wiecej.addEventListener('click', pokarzWiecej, false);
    var div_wiecej = document.getElementById('wiecej_kalk');
    var wiecej_height = "100%";
    function pokarzWiecej() {
        if (wiecej_height == "100%") {
            div_wiecej.style.height = wiecej_height;
            div_wiecej.setAttribute('class', 'border light');
            wiecej_height = "0";
        } else if (wiecej_height == "0") {
            div_wiecej.style.height = wiecej_height;
            div_wiecej.setAttribute('class', '');
            wiecej_height = "100%";
        }
    };
    //funkcjonalność pokazująca stawki
    var btn_stawki = document.getElementById('btn_stawki');
    btn_stawki.addEventListener('click', function () {
        document.getElementById('kody').classList.add('ukryj');
        document.getElementById('stawki').classList.toggle('ukryj');
    }, false);
    //funkcjonalność pokazująca kody
    var btn_kody = document.getElementById('btn_kody');
    btn_kody.addEventListener('click', function () {
        document.getElementById('stawki').classList.add('ukryj')
        document.getElementById('kody').classList.toggle('ukryj');
    }, false);
}
//funkcja obliczająca przestępstwo dla przemytu
var przekroczonoProg = false;
function sprawdzPrzestepstwoPrzemyt(akcyza, vat, clo, prog) {
    var text = "Wykroczenie";
    if (akcyza >= prog) {
        przekroczonoProg = true;
        text = '<span style="color:red;">Przestępstwo</span> - przekroczono ustawowy próg - Akcyza';
        if (vat >= prog) {
            text += ", Vat";
        }
        if (clo >= prog) {
            text += " oraz Cło";
        }
    }
    return text;
}
function sprawdzPrzestepstwoNabycie(akcyza, prog) {
    var text = "Wykroczenie";
    if (akcyza >= prog) {
        przekroczonoProg = true;
        text = '<span style="color:red;">Przestępstwo</span> - przekroczono ustawowy próg - Akcyza';
    }
    return text;
}
// Początek funkcjonalności menu II par + i ?
// usuwanie placeholdera i ustanawianie zmiennej dla inputu
var kalkAddNazwaInput = document.getElementById('kalkAddNazwaInput');
kalkAddNazwaInput.addEventListener('focus', function () {
    kalkAddNazwaInput.setAttribute('placeholder', '');
})
kalkAddNazwaInput.addEventListener('blur', function () {
    kalkAddNazwaInput.setAttribute('placeholder', 'By dodać podaj nazwę');
})
// Początek funkcjonalności paragrafu
// tworzenie i przesyłani JSON z każdej zakładki kalkulatora
var btn_par = document.getElementById('kalkAddparBtn');
btn_par.addEventListener('click', function () {
    var str = "";
    var typ = document.getElementById('kalkNazwa').innerHTML;
    if (typ == 'Papierosy' || typ == 'Tytoń' || typ == 'Susz tytoniowy' || typ == 'Spirytus' || typ == 'Wódka') {
        var parTyp = 'ue';
        if (typ_przemyt.checked == true) {
            parTyp = 'trzecie';
        }
        //obiekt tworzony z danych wyliczonych
        var obiekt = {
            "nazwa": typ,
            "ilosc": parseFloat(iloscZew),
            "typ": parTyp,
            "akcyza": akcyza,
            "vat": vat,
            "clo": clo,
            "przekroczono": przekroczonoProg
        }
        str = JSON.stringify(obiekt);
    }
    if (typ == 'Pojazdy') {
        var obiektauto = {
            "nazwa": typ,
            "akcyza": akcyza,
            "przekroczono": przekroczonoProg,
            "terminDo": dataTermin,
            "terminOd": dataPoczatek
        }
        str = JSON.stringify(obiektauto);
    }
    // dopisać kolejnego ifa dla paliwa
    sessionStorage.setItem('paragraf', str);
    window.location.href = "kks";
});
// !!!UWAGA!!!
// Części funkcjonalności Add (później może zmienią miejsce)
var kalkMenuII = document.getElementById('kalkAddMenuWraper');
var kalkAddZlicz = document.getElementById('kalkAddZlicz');
// funkcjonalność construująca obiekty do sessionStorage
function addtyp() {
    var zmienna = false;
    if (typ_przemyt.checked == true) {
        zmienna = true;
    }
    return addtyp = zmienna;
}
function Towar(prze) {
    this.typ = document.getElementById('kalkNazwa').innerHTML,
        this.ilosc = parseFloat(iloscZew),
        this.akcyza = akcyza,
        this.clo = clo,
        this.vat = vat,
        this.nazwa = document.getElementById('kalkAddNazwaInput').value,
        this.addtyp = prze,
        this.progpPrzestepstwa = progZew
    this.przestepstwo = czyPrzekroczonoProg
}
//pobieranie zawartości tablicy po załadowaniu strony
var tablicaObiektowAdd = [];
function odswierzTablice() {
    var pobranyObiekt = sessionStorage.getItem("Add");
    return tablicaObiektowAdd = JSON.parse(pobranyObiekt);
}
//budowa przycisków w menuII
function stworzBtnMenuII() {
    var autoElementy = document.getElementById('autoElementy');
    for (var i = 0; i < tablicaObiektowAdd.length; i++) {
        autoElementy.appendChild(noweElementy(i, tablicaObiektowAdd[i].typ, tablicaObiektowAdd[i].nazwa));
    }
}
// tworzenie nowego obiektu BTN do menueII
function noweElementy(noweId, typ, nazwa) {
    nowyElement = document.createElement('div');
    nowyElement.setAttribute('class', 'menuIIbtn border light');
    //nowyElement.setAttribute('id', 'NowyElementMenuII_' + noweId); //narazae id nie jest potrzebne
    nowyElement.innerHTML = typ + ": " + nazwa + " - <i>Usuń</i>";
    nowyElement.addEventListener('click', function () {
        //funkcja karzdego BTN menuII 1 usunięcie elementu tablicy
        var mod = odswierzTablice();
        mod.splice(noweId, 1);
        var str = JSON.stringify(mod);
        sessionStorage.setItem('Add', str);
        document.getElementById('autoElementy').innerHTML = "";
        stworzBtnMenuII();
        if (odswierzTablice().length <= 1) {
            kalkAddZlicz.classList.add('ukryj');
        }
    });
    return nowyElement;
}
// Onload dla całego kalkulatora
window.onload = function () {
    //Jeżeli w sessionstorage znajduje się tablica Add na onload
    if (sessionStorage.hasOwnProperty("Add") && document.getElementById('kalkNazwa').innerHTML != "Pojazdy") {
        odswierzTablice();
        stworzBtnMenuII();
        if (odswierzTablice().length > 0) {
            if (kalkMenuII.classList.contains('ukryj')) {
                kalkMenuII.classList.remove('ukryj');
            }
            if (kalkAddNazwaInput.classList.contains('ukryj')) {
                kalkAddNazwaInput.classList.remove('ukryj')
            }
        }
        if (odswierzTablice().length > 1) {
            kalkAddZlicz.classList.remove('ukryj');
        }
    }

    // znajdujemy rok by w poniższych ifach ograniczyć zapytania do serwera gdy nie zmienił się rok na stronie do której wracamy
    // rozpoznawanie przeglądatek Microsoftu
    var isIE = false || !!document.documentMode,
    isEdge = !isIE && !!window.StyleMedia;
    //Sprawdzenie daty
    var curentYear = new Date(),
        y = curentYear.getFullYear();
    //w tych ifach odpalane są funkcjie onlad poszczególnych plików js dla poszczególnych zakładek
    if (document.getElementById('kalkNazwa').innerHTML == "Papierosy") {
        if (stawki_rok.value != y) {
            zapytanieStawki();
        }
        ponowneObliczanie();
        // Odkrywanie przycisku w przypadku przeglądarek mikrosoftu
        if(isIE || isEdge) {
            document.getElementById('ieStawkiZapBtn').classList.remove('ukryj');
        }
    }
    if (document.getElementById('kalkNazwa').innerHTML == "Tytoń") {
        if (stawki_rok.value != y) {
            zapytanieStawki();
        }
        ponowneObliczanie();
        // Odkrywanie przycisku w przypadku przeglądarek mikrosoftu
        if(isIE || isEdge) {
            document.getElementById('ieStawkiZapBtn').classList.remove('ukryj');
        }
    }
    if (document.getElementById('kalkNazwa').innerHTML == "Susz tytoniowy") {
        if (stawki_rok.value != y) {
            zapytanieStawki();
        }
        suszload();
        ponowneObliczanie();
        // Odkrywanie przycisku w przypadku przeglądarek mikrosoftu
        if(isIE || isEdge) {
            document.getElementById('ieStawkiZapBtn').classList.remove('ukryj');
        }
    }
    if (document.getElementById('kalkNazwa').innerHTML == "Spirytus") {
        if (stawki_rok.value != y) {
            zapytanieStawki();
        }
        spirytusLoad();
        ponowneObliczanie();
        // Odkrywanie przycisku w przypadku przeglądarek mikrosoftu
        if(isIE || isEdge) {
            document.getElementById('ieStawkiZapBtn').classList.remove('ukryj');
        }
    }
    if (document.getElementById('kalkNazwa').innerHTML == "Wódka") {
        if (stawki_rok.value != y) {
            zapytanieStawki();
        }
        ponowneObliczanie();
        // Odkrywanie przycisku w przypadku przeglądarek mikrosoftu
        if(isIE || isEdge) {
            document.getElementById('ieStawkiZapBtn').classList.remove('ukryj');
        }
    }
    if (document.getElementById('kalkNazwa').innerHTML == "Pojazdy") {
        autaLoad();
    }
    if (document.getElementById('kalkNazwa').innerHTML == "Należności") {
        zliczLoad();
    }
}
// Funkcjonalność onclick dla ADD
function dodajNowyTowar() {
    var tabl = tablicaObiektowAdd.length;
    // tworzenie nowego obiektu dla aktulanych zmiennych i wkładanie go do sessionstorage
    var nowyObiektTowar = new Towar(typ_przemyt.checked);
    tablicaObiektowAdd.push(nowyObiektTowar);
    var str = JSON.stringify(tablicaObiektowAdd);
    sessionStorage.setItem('Add', str);
    // dodawanie pojedyńczego diva do menuII po kliknięciu
    var autoElementy = document.getElementById('autoElementy');
    autoElementy.appendChild(noweElementy(tabl, tablicaObiektowAdd[tabl].typ, tablicaObiektowAdd[tabl].nazwa));

}
//Zdarzenie Onclick + i walidacja
var btn_plus = document.getElementById('kalkAddplusBtn');
btn_plus.addEventListener('click', function () {
    if (iloscZew == 0) {
        kalkAddNazwaInput.setAttribute('placeholder', 'Najpierw oblicz');
    } else {
        if (document.getElementById('kalkNazwa').innerHTML == "Susz tytoniowy") {
            dodajNowyTowar();
        } else if (kalkAddNazwaInput.classList.contains('ukryj')) {
            kalkAddNazwaInput.classList.remove('ukryj')
        } else {
            if (kalkAddNazwaInput.value == "") {
                kalkAddNazwaInput.setAttribute('placeholder', 'Proszę podaj nazwę');
            } else {
                dodajNowyTowar();
            }
        }
        kalkAddNazwaInput.value = "";
    }
    if (sessionStorage.hasOwnProperty("Add")) {
        if (odswierzTablice().length > 1) {
            kalkAddZlicz.classList.remove('ukryj');
        }
    }
});
var btn_zap = document.getElementById('kalkAddzapBtn');
btn_zap.addEventListener('click', function () {















    // BTN ? NARAZIE TESTY
    alert('Działa');

});
kalkAddZlicz.addEventListener('click', function () {
    if (kalkAddNazwaInput.value == "") {
        window.location.href = "/zlicz";
    } else {
        btn_plus.click();
        window.location.href = "/zlicz";
    }
});
// Funkcjonalność Odpowiadająca za Protokoły edytowalne
// Przycisk Protokoły
var btn_protokoly = document.getElementById('btn_protokoly');
var btn_protar = document.getElementById('btn_protar');
var btn_proogl = document.getElementById('btn_proogl');
var btn_kalkspis = document.getElementById('btn_kalkspis');
btn_protokoly.addEventListener('click', function () {
    kalkAddNazwaInput.classList.remove('ukryj');
    btn_protar.classList.remove('ukryj');
    btn_proogl.classList.remove('ukryj');
    btn_kalkspis.classList.remove('ukryj');
    btn_protokoly.classList.add('ukryj');
}, false);
// Przycisk Taryfikacji
btn_protar.addEventListener('click', function () {
    // Sprawdzanie czy są dane do protokołów
    if (sessionStorage.hasOwnProperty("Add") == false) {
        if (kalkAddNazwaInput.value != "") {
            btn_plus.click();
            window.location.href = "/protar";
        } else {
            kalkAddNazwaInput.setAttribute('placeholder', 'Proszę podaj nazwę');
        }
    } else if (sessionStorage.hasOwnProperty("Add"))
        if (odswierzTablice().length == 0) {
            if (kalkAddNazwaInput.value != "") {
                btn_plus.click();
                window.location.href = "/protar";
            } else {
                kalkAddNazwaInput.setAttribute('placeholder', 'Proszę podaj nazwę');
            }
        }
        else {
            window.location.href = "/protar";
        }
}, false);
// Przycisk do Oględzin
btn_proogl.addEventListener('click', function () {
    // Sprawdzanie czy są dane do protokołów
    if (sessionStorage.hasOwnProperty("Add") == false) {
        if (kalkAddNazwaInput.value != "") {
            btn_plus.click();
            window.location.href = "/proogl";
        } else {
            kalkAddNazwaInput.setAttribute('placeholder', 'Proszę podaj nazwę');
        }
    } else if (sessionStorage.hasOwnProperty("Add"))
        if (odswierzTablice().length == 0) {
            if (kalkAddNazwaInput.value != "") {
                btn_plus.click();
                window.location.href = "/proogl";
            } else {
                kalkAddNazwaInput.setAttribute('placeholder', 'Proszę podaj nazwę');
            }
        }
        else {
            window.location.href = "/proogl";
        }
}, false);
// Przycisk do Spisu i opisu
btn_kalkspis.addEventListener('click', function () {
    // Sprawdzanie czy są dane do protokołów
    if (sessionStorage.hasOwnProperty("Add") == false) {
        if (kalkAddNazwaInput.value != "") {
            btn_plus.click();
            window.location.href = "/kalkspis";
        } else {
            kalkAddNazwaInput.setAttribute('placeholder', 'Proszę podaj nazwę');
        }
    } else if (sessionStorage.hasOwnProperty("Add"))
        if (odswierzTablice().length == 0) {
            if (kalkAddNazwaInput.value != "") {
                btn_plus.click();
                window.location.href = "/kalkspis";
            } else {
                kalkAddNazwaInput.setAttribute('placeholder', 'Proszę podaj nazwę');
            }
        }
        else {
            window.location.href = "/kalkspis";
        }
}, false);
// Funkcja on load - początek rozwijania divów 
window.onload = function(){
    document.getElementById('przepisySmallBox').style.height = "0px";
    document.getElementById('taryfikatorHideBox').style.height = "0px";
    document.getElementById('znakiHideBox').style.height = "0px";
    // dodanie klasy kursor do znaków które się otwierają (bravo michał)
    function ZnakiCursor(){
        var znakiWszystkie = document.getElementById('znakiWszystkie');
        var tablica = znakiWszystkie.getElementsByClassName("znakiSmallBox");
        var bBox = document.getElementById('tarSmallBoxV');
        var tarpoz = bBox.getElementsByClassName("tarPoz");
        var tarOpis = "";
        for (var i = 0; i < tablica.length; i++) {
            for (var j = 0; j < tarpoz.length; j++) {
                tarOpis = tarpoz[j].getElementsByClassName("tarOpis")[0];
                if (tarOpis.innerHTML.search(tablica[i].getElementsByClassName("nazwaZnaku")[0].innerHTML+" ") > -1 || tarOpis.innerHTML.search(tablica[i].getElementsByClassName("nazwaZnaku")[0].innerHTML+",") > -1 ){
                    tablica[i].classList.add('cursor');
                }
            }   
        }
    }
    ZnakiCursor();
}
// Koniec onload
// funkcja rozwijania kategorji - wywoływana onclickiem z odpowiednimi argumentami
function pokazDiv(nazwa, przycisk){
    var obiekt = document.getElementById(nazwa);
    var przycisk = document.getElementById(przycisk);
    if(obiekt.style.height == "0px"){
        obiekt.style.height = "100%";
        przycisk.style.transform = "rotate(-90deg)";
    }
    else{
        obiekt.style.height = "0px";
        przycisk.style.transform = "rotate(90deg)";
        if(nazwa == 'znakiHideBox'){
            zamknijWszystkieZnaki();
        }
        //zwijanie kategorji taryfikator
        if(nazwa == 'taryfikatorHideBox'){
            czyscBtn();
            ukryjWszystkiePoz();
            document.getElementById('tarInput').value = "";
            document.getElementById('taryfikatorIImenu').classList.add('ukryj');
        }
    }
}
// Taryfikator
// funkcjonalonść wyświetlania II prtzepisy dotyczące róchu pojazdów oraz znaków
function wyswietldiv(obiekt){
    var obiekt = document.getElementById(obiekt);
    obiekt.classList.toggle('ukryj');
}
// Funkcjonalność rozwijania i zwijania pozyce w zależności od stanu oraz podświetlająca btn
var stany = [];
function pokazPoz(box){
    var tarBtn = document.getElementById("btn_"+box);
    var tablica = document.getElementById(box).getElementsByClassName('tarPoz');
    if(stany.includes(box)){
        for (var i = 0; i<tablica.length; i++) {
            tablica[i].classList.add('ukryj');
        }
        tarBtn.style.backgroundColor = "white";
        tarBtn.style.color = "#DB002F";
        stany = stany.filter(item => item !== box);
        //funkcjonalność zwijająca II gdy nic nie jest zaznaczone
        pokazMenuII();
        czyscInput();
    }else{
        //funkcjonalność wyłączająca wszystkie inne kategorie poza klikniętą
        czyscBtn();
        ukryjWszystkiePoz();
        document.getElementById('tarInput').value = "";
        for (var i = 0; i<tablica.length; i++) {
            tablica[i].classList.remove('ukryj');
        }
        tarBtn.style.backgroundColor = "#d87886";
        tarBtn.style.color = "white";
        tarPozCenter(box);
        stany.push(box);
        //funkcjionalność zwijająca menu II jeżeli naciśnięty zostanie inna kategoria
        pokazMenuII();
    }
};
// zwijanie wszystkich pozycji
function ukryjWszystkiePoz(){
    var tablica = document.getElementById('tarBigBox').getElementsByClassName('tarPoz');
    for (var i = 0; i<tablica.length; i++) {
        tablica[i].classList.add('ukryj');
    } 
}
//Scrolowanie do odkrytych poz
function tarPozCenter(box){
    var tarPoz = document.getElementById(box);
    var pos = tarPoz.offsetTop;
    window.scrollTo(0, pos-5);
};
// Koniec funkcjonalności rozwijania różnych diwów kategorii
//funkcja scrolująca do wyszukiwarki
function tarWyszukiwarkaCenter(){
    var tarWyszukiwarka = document.getElementById('tarWyszukiwarka');
    var pos = tarWyszukiwarka.offsetTop;
    window.scrollTo(0, pos-5);
};
// Całość funkcjonalności wyszukiwarki
// funkcja tworząca tablicę id wszystkich przycisków 
function tablicaBtn(){
    var bBox = document.getElementById("tarBigBox");
    var tarPoz = bBox.getElementsByClassName("tarPoz");
    var tab = [];
    for (var i = 0; i<tarPoz.length; i++) {
        var id = tarPoz[i].parentNode.getAttribute('id');
        if(tab.includes(id) == false){
            tab.push(id);
        }
    }
    return tab;
}
// funkcja tworząca tablicę id przycisków menue II (rozwijanego)
function tabIdMenuII(){
    var zawartosc = document.getElementById('taryfikatorIImenu');
    var tabI = zawartosc.getElementsByClassName("tarIImenu");
    var tabII = [];
    for( var i = 0; i < tabI.length; i++ ){
        tabII.push(tabI[i].getAttribute('id'));
    }
    return tabII;
}
// główna funkcjonalność wyszukiwania
var input = document.getElementById('tarInput');
input.addEventListener('input', tarFind, true);
input.addEventListener('focus', function(){
    tarWyszukiwarkaCenter();
    input.setAttribute('placeholder', '');
}, false);
input.addEventListener('blur', function(){
    input.setAttribute('placeholder', 'Wyszukaj po opisie');
}, false)
function tarFind(){
    tarWyszukiwarkaCenter();
    czyscBtn();
    var filter = input.value.toUpperCase();
    var bBox = document.getElementById("tarBigBox");
    var tarpoz = bBox.getElementsByClassName("tarPoz");
    var tarBrak = document.getElementById("tarBrak");
    var tarOpis = "";
    var ile = 0; // oblicznae gdy zakończy się lista
    if(input.value.length <= 2){
        for (var i = 0; i < tarpoz.length; i++) {
            tarpoz[i].classList.add('ukryj');
        }
    }else{
        for (var i = 0; i < tarpoz.length; i++) {
            tarOpis = tarpoz[i].getElementsByClassName("tarOpis")[0];
            if (tarOpis.innerHTML.toUpperCase().indexOf(filter) > -1) {
                obiekt = tarpoz[i];
                obiekt.classList.remove('ukryj');
                if(stany.includes(obiekt.parentNode.getAttribute('id')) == false){
                    stany.push(obiekt.parentNode.getAttribute('id'));
                }
            }else{
                tarpoz[i].classList.add('ukryj');
                ile += 1;
            }
        }
        if(tarpoz.length == ile){
            tarBrak.innerHTML = "Nie znaleźono";
        }else{
            tarBrak.innerHTML = "";
        }
    }
    zmienBtn();
    pokazMenuII();
};
// funkcja czyszcząca kolory z przycisków i stany
function czyscBtn(){
    stany = [];
    var id = tablicaBtn();
    for( var i = 0; i < id.length; i++ ){
        document.getElementById("btn_"+id[i]).style.backgroundColor = "white";
        document.getElementById("btn_"+id[i]).style.color = "#DB002F";
    }

}
function zmienBtn(){
    for( var i = 0; i < stany.length; i++ ){
        document.getElementById("btn_"+stany[i]).style.backgroundColor = "#d87886";
        document.getElementById("btn_"+stany[i]).style.color = "white";
    }
};
// funkcjonalność odpowiadająca za pokazywanie II w zależności od zaznaczenia
function pokazMenuII(){
    var tabMenuII = tabIdMenuII();
    var stanyII = false;
    for ( var i = 0; i < stany.length; i++ ){
        if(tabMenuII.includes("btn_"+stany[i])){
            stanyII += true;
        }
    }
    if(stanyII != false){
        document.getElementById('taryfikatorIImenu').classList.remove('ukryj');
    }else{
        document.getElementById('taryfikatorIImenu').classList.add('ukryj');
    }
};
// funkcja sprawdzająca czy są pokazane jakieś pozycje i czyszcząca pole gdy nie ma żadnej
function czyscInput(){
    if(stany == 0){
        document.getElementById('tarInput').value = "";
    }
}
// koniec funkcjonalności wyszukiwarki
// funkcjonalność wyświetlająca divy na całe okno
function displayPoz(id, kategoria){
    var tarDivId = document.getElementById(kategoria+"_id_"+id);
    var imgExit = document.getElementById(kategoria+"_Exit_"+id);
    //wyłączenie scrolbara na document
    document.documentElement.style.overflow = 'hidden';
    tarDivId.style.display = "block";
    imgExit.addEventListener('click', function(){
        //włączenie scrolbara na document
        document.documentElement.style.overflow = 'auto';
        tarDivId.style.display = "none";
    });
};
// Znaki
// początek funkcjonalność odkrywającej i zakrywającej zaki
function pokazZnaki(typ){
    //zmieniająca kolory przycisków
    var tablica = document.getElementById(typ).getElementsByClassName('znakiSmallBox');
    var btnZnaki = document.getElementById(typ+"Btn");
    if(tablica[0].classList.contains('ukryj')){
        zamknijWszystkieZnaki();
        btnZnaki.style.backgroundColor = "#d87886";
        btnZnaki.style.color = "white";
    }else{
        btnZnaki.style.backgroundColor = "white";
        btnZnaki.style.color = "#DB002F";
    }
    // otwieranie pojedyńczych znaków znaków
    for (var i = 0; i<tablica.length; i++) {
        tablica[i].classList.toggle('ukryj');
    }
};
//funkcja zwijająca wszystkie znaki
function zamknijWszystkieZnaki(){
    // zamykanie wszystkich znaków
    var znakiWszystkieTablica = document.getElementById('znakiWszystkie').getElementsByClassName('znakiSmallBox');
    for (var i = 0; i<znakiWszystkieTablica.length; i++) {
        znakiWszystkieTablica[i].classList.add('ukryj');
    }
    // wyświetlanie wszystkich przycisków
    var zankiTablicaBtn = document.getElementById('znakiMenuBox').getElementsByClassName('btn');
    for (var i = 0; i<zankiTablicaBtn.length; i++) {
        zankiTablicaBtn[i].style.backgroundColor = "white";
        zankiTablicaBtn[i].style.color = "#DB002F";
    }

}
// funkcjonalność pokazująca poz wykroczenia po klinknięciu na znak.
function displayPozZnak(znak){
    var bBox = document.getElementById('tarSmallBoxV');
    var tarpoz = bBox.getElementsByClassName("tarPoz");
    var tarOpis = "";
    for (var i = 0; i < tarpoz.length; i++) {
        tarOpis = tarpoz[i].getElementsByClassName("tarOpis")[0];
        if (tarOpis.innerHTML.search(znak+" ") > -1 || tarOpis.innerHTML.search(znak+",") > -1 ){
            //przekształcenie stringu na funkcję
            eval(tarpoz[i].getAttribute("onclick"));
        }
    }
}
//Koniec znaki
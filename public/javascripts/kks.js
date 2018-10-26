window.onload = function(){
    // zmiana stanu otwierania kategorji
    document.getElementById('przepisySmallBox').style.height = "0px";
    document.getElementById('pozaUeSmallBox').style.height = "0px";
    document.getElementById('ueSmallBox').style.height = "0px";
    document.getElementById('akcSmallBox').style.height = "0px";
    document.getElementById('paliwoSmallBox').style.height = "0px";
    document.getElementById('utrudnianieSmallBox').style.height = "0px";
    //funkcjonalność paragrafu z kalkulatora
    //być może trzeba będzie dodać jeszcze jednego ifa i pentlę by przejżeć zawartość
    if(sessionStorage.hasOwnProperty("paragraf")){
        // pobieranie wyskokści małej wartości z sekcji przepisy
        var malaWartosc = parseFloat(document.getElementById('malaWartosc').innerHTML);
        //Scrolowanie do odkrytych poz
        function pozCenter(box){
        var poz = document.getElementById(box);
        var pos = poz.offsetTop;
        window.scrollTo(0, pos-5);
        };
        //pobieranie zawartości z sesji przeglądarki
        var parStr = sessionStorage.getItem('paragraf');
        var kalkDane = JSON.parse(parStr);
        // Wypełnianie danymi pól paragafu
        // Dla kategorji 
        if(kalkDane.nazwa == "Papierosy" || kalkDane.nazwa == "Tytoń" || kalkDane.nazwa == "Spirytus" || kalkDane.nazwa == "Wódka"){
            var wtisAkcyzaTab = document.getElementsByClassName('wtisAkcyza');
            for( var i = 0; i < wtisAkcyzaTab.length; i++ ){
                wtisAkcyzaTab[i].innerHTML = kalkDane.akcyza;
            }
            var wtisVatTab = document.getElementsByClassName('wtisVat');
            for( var i = 0; i < wtisVatTab.length; i++ ){
                wtisVatTab[i].innerHTML = kalkDane.vat;
            }
            var wtisCloTab = document.getElementsByClassName('wtisClo');
            for( var i = 0; i < wtisCloTab.length; i++ ){
                wtisCloTab[i].innerHTML = kalkDane.clo;
            }
            //zmiana ilości
            var parIleTab = document.getElementsByClassName('parIle');
            for( var i = 0; i < parIleTab.length; i++ ){
                parIleTab[i].innerHTML = kalkDane.ilosc;
            }

        }
        // odbieranie suszu
        if(kalkDane.nazwa == "Susz tytoniowy"){
            var wtisAkcyzaTab = document.getElementsByClassName('wtisAkcyza');
            var parIleTab = document.getElementsByClassName('parIle');
            var susztypTab = document.getElementsByClassName('parJednostkaTyp');
            // i == 2 ponieważ zmieniamy tylko dla UE
            for( var i = 2; i < wtisAkcyzaTab.length; i++ ){
                wtisAkcyzaTab[i].innerHTML = kalkDane.akcyza;
                parIleTab[i].innerHTML = kalkDane.ilosc;
                susztypTab[i].innerHTML = "kg. suszu tytoniowego";
            }
        }
        //Początek zmiana typu i jednostki miary
        //można wprowadzić modyfikacje w zależności od wielkości
        function parZmienTyp(tekstTyp){
            var typTab = document.getElementsByClassName('parJednostkaTyp');
            for( var i = 0; i < typTab.length; i++ ){
                typTab[i].innerHTML = tekstTyp;
            }
        }
        if(kalkDane.nazwa == "Papierosy"){
            parZmienTyp("szt. papierosów różnych marek");
        }
        if(kalkDane.nazwa == "Tytoń"){
            parZmienTyp("kg. tytoniu do palenia różnych marek");
        }
        if(kalkDane.nazwa == "Spirytus" || kalkDane.nazwa == "Wódka"){
            parZmienTyp("l. wyrobów alkoholowych różnych marek");
        }
        //Koniec zmiana typu i jednostki miary
        //odbieranie auta
        if(kalkDane.nazwa == "Pojazdy"){
            pokazDiv('akcSmallBox','btn_akcBox');
            pozCenter('akcBox');
            // wprowadzić zmiany do zażutu 
            document.getElementById('akcAkcyza').innerHTML = kalkDane.akcyza;
            document.getElementById('akcTermiOd').innerHTML = kalkDane.terminOd;
            document.getElementById('akcTermiDo').innerHTML = kalkDane.terminDo;
        }
        // rozwijanie odpowiedniej zakładki ma być na końcu
        if(kalkDane.typ == 'trzecie'){
            pokazDiv('pozaUeSmallBox','btn_pozaUeBox');
            pozCenter('pozaUeBox');
        }
        if(kalkDane.typ == 'ue'){
            pokazDiv('ueSmallBox','btn_ueBox');
            pozCenter('ueBox');
        }
        // wypisywanie daty 
        var dateTab = document.getElementsByClassName('akDate');
        var curentDate = new Date(),
        d = curentDate.getDate(),
        m = curentDate.getMonth()+1,
        y = curentDate.getFullYear(),
        aktDate;
        if(d < 10){
            d = "0"+d;
        };
        if(m < 10){
            m = "0"+m;
        };
        aktDate = d+"-"+m+"-"+y;
        for( var i = 0; i < dateTab.length; i++ ){
            dateTab[i].innerHTML = aktDate;
        }
        //koniec wypisywania daty
        // przetwarzanie przestęstwa to stwierdzenie czy przestępstwo i zmiana art
        if(kalkDane.przekroczono && kalkDane.akcyza < malaWartosc){
            var kwaITab = document.getElementsByClassName('kwaI');
            for( var i = 0; i < kwaITab.length; i++ ){
                kwaITab[i].innerHTML = 'przestępstwo';
            }
            var kwaIITab = document.getElementsByClassName('kwaII');
            for( var i = 0; i < kwaIITab.length; i++ ){
                kwaIITab[i].innerHTML = "art. 86§3 kks w zb. z art. 63§6 kks w zb. z art. 54§2 kks w zw. z art. 7§1 kks";
            }
            document.getElementById('kwaIII').innerHTML = "art. 65§3 kks w zb. z art. 91§3 kks w zw. z art. 7§1 kks";
            var kwaIVTab = document.getElementsByClassName('kwaIV');
            for( var i = 0; i < kwaIVTab.length; i++ ){
                kwaIVTab[i].innerHTML = "art. 63§6 kks";
            }
            document.getElementById('kwaV').innerHTML = "art. 65§3 kks";
            document.getElementById('kwaVI').innerHTML = "art. 54§2 kks";
            document.getElementById('kwaVII').innerHTML = "art. 73a§2 kks";
        }
        //zmiana art w przypadku przekroczenia małej wartości
        if(kalkDane.przekroczono && kalkDane.akcyza >= malaWartosc){
            var kwaITab = document.getElementsByClassName('kwaI');
            for( var i = 0; i < kwaITab.length; i++ ){
                kwaITab[i].innerHTML = 'przestępstwo';
            }
            var kwaIITab = document.getElementsByClassName('kwaII');
            for( var i = 0; i < kwaIITab.length; i++ ){
                kwaIITab[i].innerHTML = "art. 86§1 i 2 kks w zb. z art. 63§1-5 kks w zb. z art. 54§1 kks w zw. z art. 7§1 kks";
            }
            document.getElementById('kwaIII').innerHTML = "art. 65§1 i 2 kks w zb. z art. 91§3 kks w zw. z art. 7§1 kks";
            var kwaIVTab = document.getElementsByClassName('kwaIV');
            for( var i = 0; i < kwaIVTab.length; i++ ){
                kwaIVTab[i].innerHTML = "art. 63§1-5 kks";
            }
            document.getElementById('kwaV').innerHTML = "art. 65§1 i 2 kks";
            document.getElementById('kwaVI').innerHTML = "art. 54§1 kks";
            document.getElementById('kwaVII').innerHTML = "art. 73a§1 kks";
        }





    }
}
//funkcjonalność rozwijająca dane kategorie
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

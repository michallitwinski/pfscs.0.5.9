 // Początek funkcjonalności rozwijania różnych diwów kategorii
 window.onload = function(){
    document.getElementById('sentWykazCNTabela').style.height = "0px";
    document.getElementById('sentWykazPozostaleTabela').style.height = "0px";
    document.getElementById('sentWykazLekiTabela').style.height = "0px";
}
// funkcja wywoływana onclickiem z odpowiednimi argumentami
function pokazDiv(obiekt, img){
    var obiekt = document.getElementById(obiekt);
    var img = document.getElementById(img);

    if(obiekt.style.height == "0px"){
        obiekt.style.height = "100%";
        img.style.transform = "rotate(-90deg)";
    }
    else{
        obiekt.style.height = "0px";
        img.style.transform = "rotate(90deg)";
    }  
}
// Koniec funkcjonalności rozwijania różnych diwów kategorii
//Funkcjonalność wyszukiwania leków
var input = document.getElementById('lekiInput');
input.addEventListener('click', sentLekiCenter, false);
input.addEventListener('input', sentLekiFind, false);
input.addEventListener('focus', function(){
    sentLekiCenter();
    input.setAttribute('placeholder', '');
},false);
input.addEventListener('blur', function(){
    input.setAttribute('placeholder', 'Podaj nazwę');
}, false)
//funkcja scrolująca pole wyszukiwania na górze
function sentLekiCenter(){
    var lekiWyszukiwarka = document.getElementById('lekiWyszukiwarka');
    var pos = lekiWyszukiwarka.offsetTop;
    window.scrollTo(0, pos-5);
};
//funkcjonalość wyszukiwarki
function sentLekiFind(){
    sentLekiCenter();
    var filter = input.value.toUpperCase();
    var bBox = document.getElementById("lekiBigBox");
    var sBox = bBox.getElementsByClassName("lekiSmallBox");
    var lakiBrak = document.getElementById("lakiBrak");
    var lekiNazwa = "";
    var ile = 0; // oblicznae gdy zakończy się lista
    
    for (var i = 0; i < sBox.length; i++) {
        lekiNazwa = sBox[i].getElementsByClassName("lekiNazwa")[0];
        if (lekiNazwa.innerHTML.toUpperCase().indexOf(filter) > -1) {
            sBox[i].style.display = "";
        }else{
            sBox[i].style.display = "none";
            ile += 1;
        }
    }
    if(sBox.length == ile){
        lakiBrak.innerHTML = "Na wykazie nie znajduje się produkt o takiej nazwie";
    }else{
        lakiBrak.innerHTML = "";
    }
};
// funkcjonalność wyświetlająca divy na całe okno
function displaySent(id, kategoria){
    var sentDivId = document.getElementById(kategoria+"DivId_"+id);
    var imgExit = document.getElementById(kategoria+"BoxExit_"+id);
    //wyłączenie scrolbara na document
    document.documentElement.style.overflow = 'hidden';
    sentDivId.style.display = "block";
    imgExit.addEventListener('click', function(){
        //włączenie scrolbara na document
        document.documentElement.style.overflow = 'auto';
        sentDivId.style.display = "none";
    });
};
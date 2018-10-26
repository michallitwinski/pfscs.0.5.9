// Elementy navigacyjne do funkcjonlności rozwijania
var toogle_menu = document.getElementById('toggle_menu');
var navimg = document.getElementById('navimg')
var navh1 = document.getElementById('navh1');
var nav1 = document.getElementById('nav1');
var nav2 = document.getElementById('nav2');
var nav3 = document.getElementById('nav3');
var nav4 = document.getElementById('nav4');
var nav5 = document.getElementById('nav5');
var maxW="100%";
// funkcja rozwijająca menu ( trzeba poprawić i wprowadzić animację wyświetlania btn )
	toogle_menu.addEventListener('click', function(){
        pokazMenu();
        arrowRotate();
    });
	function pokazMenu(){
		if(toogle_menu.style.width == maxW){
            toogle_menu.style.width = "140px";
            nav1.className = "ukryj";
            nav2.className = "ukryj";
            nav3.className = "ukryj";
            nav4.className = "ukryj";
            nav5.className = "ukryj";
            navh1.className = ""
		} else {
            toogle_menu.style.width = maxW;
            navh1.className = "ukryj"
            setTimeout(function(){ nav1.className = "border"; }, 75);
            setTimeout(function(){ nav2.className = "border"; }, 150);
            setTimeout(function(){ nav3.className = "border"; }, 225);
            setTimeout(function(){ nav4.className = "border"; }, 300);
            setTimeout(function(){ nav5.className = "border"; }, 375);
		}
	}
// elementy do obracanej strzałki
var navArrow = document.getElementById('navArrow');
var drgNavArrow = 0;
// funkcja obracająca strzałkę				 
function arrowRotate(){
	if(drgNavArrow == 0){
		drgNavArrow = 180;
		navArrow.style.transform = "rotate("+drgNavArrow+"deg)";
	}else{
		drgNavArrow = 0;
		navArrow.style.transform = "rotate("+drgNavArrow+"deg)";
	}
};
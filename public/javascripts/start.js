var btn = document.getElementById('tech_btn');
var start_info = document.getElementById('start_info');
var start_tech = document.getElementById('start_tech');
btn.addEventListener('click', function(){
    start_info.style.display = "none";
    start_tech.style.display = "block";
});
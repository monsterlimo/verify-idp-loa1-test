$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}
    
var origin = document.location.pathname.split("/").slice(-2, -1).toString();

var chosenIdp = $.urlParam('idp')


$(document).ready(function(){

localStorage.setItem("verifySuccess", 'true')
localStorage.setItem("chosenIdp", chosenIdp)


console.log("chosenIdp: " + localStorage.getItem("chosenIdp"));
console.log("verifySuccess: " + localStorage.getItem("verifySuccess"));


});




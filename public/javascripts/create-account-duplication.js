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

var exemptionService = $.urlParam('requestId')
var attemeptedIdp = $.urlParam('idp')




console.log("usersIdp:" + localStorage.chosenIdp)
console.log(attemeptedIdp)

// check users idp has been specified
function defineIdp(selectedIdp){

  if (selectedIdp == undefined){
    usersIdp = localStorage.chosenIdp

    return usersIdp
  } else {
    usersIdp = selectedIdp
    return usersIdp
  }

}


$("button").click(function(){

  // specify users idp
  var selectedIdp = 'experian'

  var exemptionService = $.urlParam('requestId')
  var eidas = $.urlParam('eidas')

  defineIdp(selectedIdp)

  // ALLOW USERS THROUGH WITH CORRECT IDP
  if (usersIdp != idp){

  } else {
    
    $('.error-message').removeClass('hidden')
		$('.error-summary').css({'display':'block'})
    $('#username').addClass("error-input")
		$('#email-address').addClass("error")
		event.preventDefault();
  }

});




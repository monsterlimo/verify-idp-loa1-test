
var idp = document.location.pathname.split("/").slice(-2, -1).toString();

var  colourVerizon           = '#d4eaf9'
  	 colourVerizonLight      = '#d4eaf9'
     
     colourRoyalMail         = '#BE4130'
	   colourRoyalMailLight    = '#f4a08b'
     
     colourPostOffice        = '#C0163F'
	   colourPostOfficeLight   = '#f2bdb0'
     
     colourMorpho            = '#184183'
	   colourMorphoLight  		 = '#bfcfe7'
     
     colourExperian          = '#26478d'
	   colourExperianLight     = '#c5cce8'
     
     colourDigIdentity       = '#80BC47'
	   colourDigIdentityLight  = '#d4e6c0'
     
     colourCitizenSafe       = '#13558C'
	   colourCitizenSafeLight  = '#c9cde2'
     
     colourBarclays          = '#28ABE3'
	   colourBarclaysLight     = '#d8ebfa'


$(document).ready(function(){

  var idpColour = ""

  if (idp == "royal-mail") {
    idpColour = colourRoyalMail
    idpColourLight = colourRoyalMailLight
  } else if (idp == "post-office") {
    idpColour = colourPostOffice
    idpColourLight = colourPostOfficeLight
  } else if (idp == "morpho") {
    idpColour = colourMorpho
    idpColourLight = colourMorphoLight
  } else if (idp == "experian") {
    idpColour = colourExperian
    idpColourLight = colourExperianLight
  } else if (idp == "digidentity") {
    idpColour = colourDigIdentity
    idpColourLight = colourDigIdentityLight
  } else if (idp == "citizensafe") {
    idpColour = colourCitizenSafe
    idpColourLight = colourCitizenSafeLight
  } else if (idp == "barclays") {
    idpColour = colourBarclays
    idpColourLight = colourBarclaysLight
  } else {
    idpColour = grey
  }

  $('#header').css('border-bottom-color', idpColour)
  $('.heading-large').css('color', idpColour)
  $('.button').css('background-color', idpColour)
  $('.button').css('border-color', idpColourLight)

});




// IDP BACKGROUND COLOURS



// var country = document.location.pathname.split("/").slice(-2, -1).toString();
console.log(location)

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

  var countryColour = ""

  if (country == "Spain") {
    countryColour = colourRoyalMail
    countryColourLight = colourRoyalMailLight
  } else if (country == "austria") {
    countryColour = colourPostOffice
    countryColourLight = colourPostOfficeLight
  } else if (country == "germany") {
    countryColour = colourMorpho
    countryColourLight = colourMorphoLight
  } else if (country == "experian") {
    countryColour = colourExperian
    countryColourLight = colourExperianLight
  } else if (country == "digidentity") {
    countryColour = colourDigIdentity
    countryColourLight = colourDigIdentityLight
  } else if (country == "citizensafe") {
    countryColour = colourCitizenSafe
    countryColourLight = colourCitizenSafeLight
  } else if (country == "barclays") {
    countryColour = colourBarclays
    countryColourLight = colourBarclaysLight
  } else {
    countryColour = grey
  }

  $('#header').css('border-bottom-color', idpColour)
  $('.heading-large').css('color', idpColour)
  $('.button').css('background-color', idpColour)
  $('.button').css('border-color', idpColourLight)

});




// IDP BACKGROUND COLOURS


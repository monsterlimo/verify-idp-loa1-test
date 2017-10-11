
$("button").click(function(){

  if ($(":checked").length > 1) {
    console.log("asdassa")
    $('.error-message').addClass('hidden')
  } else {

  $('.error-message').removeClass('hidden')
  $('.validate').addClass('error')
  event.preventDefault();
    
  }
    
});
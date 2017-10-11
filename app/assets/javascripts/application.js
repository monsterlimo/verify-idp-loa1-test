function showHideCheckboxToggledContent() {

  $(".block-label input[type='checkbox']").each(function() {

    var $checkbox = $(this);
    var $checkboxLabel = $(this).parent();

    var $dataTarget = $checkboxLabel.attr('data-target');

    // Add ARIA attributes

    // If the data-target attribute is defined
    if (typeof $dataTarget !== 'undefined' && $dataTarget !== false) {

      // Set aria-controls
      $checkbox.attr('aria-controls', $dataTarget);

      // Set aria-expanded and aria-hidden
      $checkbox.attr('aria-expanded', 'false');
      $('#'+$dataTarget).attr('aria-hidden', 'true');

      // For checkboxes revealing hidden content
      $checkbox.on('click', function() {

        var state = $(this).attr('aria-expanded') === 'false' ? true : false;

        // Toggle hidden content
        $('#'+$dataTarget).toggle();

        // Update aria-expanded and aria-hidden attributes
        $(this).attr('aria-expanded', state);
        $('#'+$dataTarget).attr('aria-hidden', !state);

      });
    }

  });

}

function showHideRadioToggledContent() {

  $(".block-label input[type='radio']").each(function() {

    var $radio = $(this);
    var $radioGroupName = $(this).attr('name');
    var $radioLabel = $(this).parent();

    var $dataTarget = $radioLabel.attr('data-target');

    // Add ARIA attributes

    // If the data-target attribute is defined
    if (typeof $dataTarget !== 'undefined' && $dataTarget !== false) {

      // Set aria-controls
      $radio.attr('aria-controls', $dataTarget);

      // Set aria-expanded and aria-hidden
      $radio.attr('aria-expanded', 'false');
      $('#'+$dataTarget).attr('aria-hidden', 'true');

      // For radio buttons revealing hidden content
      $radio.on('click', function() {

        var state = $(this).attr('aria-expanded') === 'false' ? true : false;

        // Toggle hidden content
        $('#'+$dataTarget).toggle();

        // Update aria-expanded and aria-hidden attributes
        $(this).attr('aria-expanded', state);
        $('#'+$dataTarget).attr('aria-hidden', !state);
      });
    }

    // If the data-target attribute is undefined for a radio button,
    // hide visible data-target content for radio buttons in the same group
    else {

      $radio.on('click', function() {

        // Select radio buttons in the same group
        $(".block-label input[name=" + $radioGroupName + "]").each(function() {

          var groupDataTarget = $(this).parent().attr('data-target');

          // Hide toggled content
          $('#'+groupDataTarget).hide();

          // Update aria-expanded and aria-hidden attributes
          if ($(this).attr('aria-controls')) {
            $(this).attr('aria-expanded', 'false');
          }
          $('#'+groupDataTarget).attr('aria-hidden', 'true');

        });

      });
    }

  });

}

$(document).ready(function() {

  showHideCheckboxToggledContent();
  showHideRadioToggledContent();

  $( "#choose-proof-of-identity" ).submit(function( ) {
    var radioValue = $('input[name=radioName]:checked').val();
    var radioPath = radioValue.replace(/\s+/g, '-').toLowerCase();
    $( "#choose-proof-of-identity" ).attr("action", radioPath);
    e.preventDefault();
  });

  $('body').on('change', 'input', function(e){

    window.localStorage[$(this).attr('name')] = $(this).val();

  });

  try{
    $('#full-name').text(window.localStorage['firstName'] + ' ' + window.localStorage['lastName']);
  }catch(err){

  }

  $('body').on('change', 'input, select', function(){

    var $this = $(this);

    // toggle optional sections

    if ($this.is(':checkbox')){

      var $toggleTarget = $('.optional-section-'+$this.attr('name') + '[data-toggle-value="'+$this.val() + '"]');

      console.log('.optional-section-'+$this.attr('name') + '[data-toggle-value="'+$this.val() + '"]');

      if ($toggleTarget.length){

        $toggleTarget.toggle($this.is(':checked') && $this.val() == $toggleTarget.attr('data-toggle-value'));

      }

    } else if ($this.is(':radio') || $this.is('select')){

      var $toggleTarget = $('.optional-section-'+$this.attr('name'));

      console.log('.optional-section-'+$this.attr('name') + '[data-toggle-value="'+$this.val() + '"]');

      $toggleTarget.each(function(){

        $(this).toggle($this.val() == $(this).attr('data-toggle-value'));

      });
    }

  });
});
/// VALIDATION ON DRIVING LICENCE ///  

// $.urlParam = function(name){
//     var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
//     if (results==null){
//        return null;
//     }
//     else{
//        return results[1] || 0;
//     }
// }

//   var firstTime = $.urlParam('firstTime')

//   $('#drivingLicenceButton').click(function(){
//   console.log('origin');

  
//   if (firstTime == 'false') {

//      console.log('false');

//   } else {

//      console.log('true');

//       $('.error-message').removeClass('hidden')
//       $('.form-control').addClass("error-input")
//       event.preventDefault()

//     }

//     });


// });

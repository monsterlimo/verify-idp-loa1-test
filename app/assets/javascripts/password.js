$(function(){

	console.log("create account");

	// functions to check validation rules

	var field = function(name, id){

		return {

			"name": name,
			"id": id,

			"validate" : function(){

				this.valid = true;

				var value = $('#' + this.id).val();

				console.log("field: " + this.name);
				console.log("value: " + value);
				console.log("");

				if (value == ""){

					// ignore blanks so you can click through when presenting

				} else {
				
					for (var i in this.rules){

						var result = this.rules[i].test(value);

						console.log("rule:   " + i);
						console.log("result: " + result);
						console.log("");

						if (result){

							if (this.rules[i].$element){
								this.rules[i].$element.toggleClass('invalid', false);
								this.rules[i].$element.toggleClass('valid', true);
							}

						} else {

							this.valid = false;

							if (this.rules[i].$element){
								this.rules[i].$element.toggleClass('invalid', true);
								this.rules[i].$element.toggleClass('valid', false);
							}

						}

					}

				}

				console.log("valid: " + this.valid);
				console.log("");

				return ({
					"valid": this.valid,
					"field": this.name
				});

			}
		}
	}

	var fields = [];

	var username = new field("Username", "username");

	fields.push(username);

	// username.rules = {

	// 	"exists": {

	// 		"test": function(value){
	// 			return value.length > 0;
	// 		}

	// 	},

	// 	"noSpaces": {

	// 		"test": function(value){
	// 			return /\s/.test(value) == false;
	// 		},

	// 		"$element": $("#requirement-username-no-spaces")

	// 	}

	// };

	var password = new field("Password", "password");

	fields.push(password);

	password.rules = {

		"minLength": {

			"test": function(value){
				return value.length >= 8;
			},

			"$element": $("#requirement-min-length")

		},

		"symbols": {

			"test" : function(value){
				return /[-!#£@$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(value);
			},

			"$element": $("#requirement-symbols")

		},

		"capitals": {

			"test" : function(value){
				return /[A-Z]/.test(value);
			},

			"$element": $("#requirement-capitals")

		}

	};

	// var email = new field("Email", "email");

	// fields.push(email);

	// email.rules = {

	// 	"exists": {

	// 		"test": function(value){
	// 			return value.length > 0;
	// 		}

	// 	},

	// 	"validEmail": {

	// 		"test" : function(value){
	// 			return /.+@.+\..+/.test(value);
	// 		}

	// 	}

	// };

	var debounceTimeoutId = null;

	function debounce (delay, context, callback){

		clearTimeout(debounceTimeoutId);

		debounceTimeoutId = setTimeout($.proxy(callback, context), delay);

	}

	$('#password').on('keyup', function(){

		console.log("keyup");

		debounce(500, this, function(){

			console.log("debounced");

			if ($(this).val().length > 2){
				password.validate();
			}

		});

	});

	$('#main-submit-button').on('click', function(e){

		if (e.shiftKey){

			$(this).closest('form').submit();

			return false;

		}

		var valid = true;
		var invalidFields = [];

		for (var i=0; i<fields.length; i++){

			var field = fields[i];

			var fieldResult = field.validate();

			if (fieldResult.valid == false){
				valid = false;
				invalidFields.push(field.name)
			}

		}

		if (valid == false){

			var $errorSummary = $('#error-summary');

			$errorSummary.find('.fields').html('<li>' + invalidFields.join('</li><li>') + '</li>');

			$errorSummary.show();

			return false;

		}

	});

	$('#toggle-password').on('click', function(e){

		e.preventDefault();

		var $this = $(this);

		var $passwordField = $('#password');

		if ($this.text().toLowerCase() == "show password"){
			$passwordField.attr('type', 'text');
			$this.text('Hide password');
		} else {
			$passwordField.attr('type', 'password');
			$this.text('Show password');
		}

	});

});
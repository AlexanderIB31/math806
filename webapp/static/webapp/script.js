function move_center() {

	if($('.center_block').hasClass('parab')){

		$('.parab').removeClass('center_block');
		$('.parab').addClass('left_block');
		$('.main').addClass('center_block');
		setTimeout(function () {
			$('.main').removeClass('right_block');
			//
		},10);

		//setTimeout(function () {

		////
		//
		//},100);


	}
	if($('.center_block').hasClass('giperb')){

		$('.giperb').removeClass('center_block');
		$('.giperb').addClass('bottom_block');
		$('.main').addClass('center_block');
		setTimeout(function () {
			$('.main').removeClass('top_block');
			//
		},10);

		//setTimeout(function () {

		////
		//
		//},100);


	}
	if($('.center_block').hasClass('ellipt')){
//		console.log('ddd');
		$('.ellipt').removeClass('center_block');
		$('.ellipt').addClass('right_block');
		$('.main').addClass('center_block');
		setTimeout(function () {
			$('.main').removeClass('left_block');
			//
		},10);

		//setTimeout(function () {

		////
		//
		//},100);

	}
}

function change_par_t() {
	$("#time_val_par").remove();
	$('.parab .graf').append('<div id="time_val_par" class="time noUi-target noUi-ltr noUi-horizontal"></div>');

	var parabSlider = document.getElementById('time_val_par');

    window.parabolic_current_max_t = parseFloat($( ".parab [name=par_param_s4]" ).val());
    window.parabolic_current_step_t_count = parseFloat($('[name=par_param_s1]').val());

	noUiSlider.create(parabSlider, {
		start: [ 0 ],
		step:  parseFloat(window.parabolic_current_max_t / window.parabolic_current_step_t_count),
		range: {
			'min': [ 0 ],
			'max': [ window.parabolic_current_max_t ]
		}
	});

	var parab_val = document.getElementById('time_parab');

	parabSlider.noUiSlider.on('update', function( values, handle ) {
		parab_val.innerHTML = values[handle];
	});
}

function change_giperb_t() {
	$("#time_hyperb").remove();
	$('.giperb .graf').append('<div id="time_hyperb" class="time noUi-target noUi-ltr noUi-horizontal"></div>');
	var hyperbSlider = document.getElementById('time_hyperb');

    window.hyperbolic_current_max_t = parseFloat($( ".giperb [name=param_s4]" ).val());
    window.hyperbolic_current_step_t_count = parseFloat($('[name=param_s1]').val());

	noUiSlider.create(hyperbSlider, {
		start: [ 0 ],
		step: parseFloat(window.hyperbolic_current_max_t / window.hyperbolic_current_step_t_count),
		range: {
			'min':[ 0 ] ,
			'max': [ window.hyperbolic_current_max_t ]
		}
	});

	var hyperb_val = document.getElementById('slider-step-value_hyperb');

	hyperbSlider.noUiSlider.on('update', function( values, handle ) {
		hyperb_val.innerHTML = values[handle];
	});
}

function change_ellipt_x() {
//	if($("#ellipt_x").css("display") == "block") {
		$("#ellipt_x").remove();
		$('.ellipt .graf').append('<div id="ellipt_x" class="time noUi-target noUi-ltr noUi-horizontal"></div>');
		var elliptSlider = document.getElementById('ellipt_x');

		var x_min = $(".ellipt [name=ell_param_s3]").val();
		var x_max = $(".ellipt [name=ell_param_s5]").val();

		window.elliptic_current_step_x_count = parseFloat($(".ellipt [name=ell_param_s1]").val());
        window.elliptic_current_len_x = parseFloat(x_max) - parseFloat(x_min);

		noUiSlider.create(elliptSlider, {
			start: 0,
			step: parseFloat(window.elliptic_current_len_x / window.elliptic_current_step_x_count),
			range: {
				'min': [parseFloat(x_min)],
				'max': [parseFloat(x_max)]
			}
		});
		var ellipt_val = document.getElementById('ellipt_val_x');

		elliptSlider.noUiSlider.on('update', function (values, handle) {
			ellipt_val.innerHTML = values[handle];
		});
//	}
}

function change_ellipt_y() {
//    if($("#ellipt_y").css("display") == "block") {
        $("#ellipt_y").remove();
        $('.ellipt .graf').append('<div id="ellipt_y" class="time noUi-target noUi-ltr noUi-horizontal"></div>');
        var elliptSlider = document.getElementById('ellipt_y');

        var y_min = $(".ellipt [name=ell_param_s4]").val();
        var y_max = $(".ellipt [name=ell_param_s6]").val();

        window.elliptic_current_step_y_count = parseFloat($(".ellipt [name=ell_param_s2]").val());
        window.elliptic_current_len_y = parseFloat(y_max) - parseFloat(y_min);

        noUiSlider.create(elliptSlider, {
            start: 0,
            step: parseFloat(window.elliptic_current_len_y / window.elliptic_current_step_y_count),
            range: {
                'min': [parseFloat(y_min)],
                'max': [parseFloat(y_max)]
            }
        });
        var ellipt_val = document.getElementById('ellipt_val_y');

        elliptSlider.noUiSlider.on('update', function (values, handle) {
            ellipt_val.innerHTML = values[handle];
        });
//    }
}

$(window).on('load',function(){



$('#hyperbolic_solve_btn').click(function(){
if(screen.width < 760){

var ctx = document.getElementById("hyperbolic_solutions").getContext("2d");

ctx.canvas.height = 300;
var ctx = document.getElementById("hyperbolic_errors").getContext("2d");

ctx.canvas.height = 300;

}



})
$('#elliptic_solve_btn').click(function(){
if(screen.width < 760){

var ctx = document.getElementById("elliptic_solutions_x").getContext("2d");

ctx.canvas.height = 300;


var cty = document.getElementById("elliptic_solutions_y").getContext("2d");


cty.canvas.height = 300;



var ctex = document.getElementById("elliptic_errors_x").getContext("2d");

ctex.canvas.height = 300;


 var ctey = document.getElementById("elliptic_errors_y").getContext("2d");

ctey.canvas.height = 300;



}
})
$('#parabolic_solve_btn').click(function(){
if(screen.width < 760){
console.log('ddgdg');
var ctx = document.getElementById("parabolic_solutions").getContext("2d");

ctx.canvas.height = 300;
ctx = document.getElementById("parabolic_errors").getContext("2d");

ctx.canvas.height = 300;

}



})

	$('.show_or_hide').click(function () {
        $('.full_menu').show();
	});
	$('.to_solve_btn').click(function () {

		$('.preview').removeClass('center_block');
		$('.preview').addClass('top_block');
		$('.main').addClass('center_block');
		$('.main').addClass('center_block');
		setTimeout(function () {
			$('.preview').remove();
			$('.main').removeClass('bottom_block');
			$('.menu_my').fadeIn();
			$('.main').css('transform',"none")
			console.log($('.main').css("transform"));
			//
		},1000);

	})
	var hyperbSlider = document.getElementById('time_hyperb');

	var t  = $( ".giperb [name=param_s4]" ).val();

	noUiSlider.create(hyperbSlider, {
		start:  0 ,
		step: parseFloat(parseInt(t)/parseFloat($('[name=param_s1]').val())),
		range: {
			'min':[ 0] ,
			'max': [parseInt(t)]
		}
	});
	var hyperb_val = document.getElementById('slider-step-value_hyperb');

	hyperbSlider.noUiSlider.on('update', function( values, handle ) {
		hyperb_val.innerHTML = values[handle];
	});



	var parabSlider = document.getElementById('time_val_par');

	noUiSlider.create(parabSlider, {
		start: [ 0 ],
		step:  parseFloat(parseInt(t)/parseFloat($('[name=par_param_s1]').val())),
		range: {
			'min': [ 0 ],
			'max': [ parseInt(t)]
		}
	});
	var parab_val = document.getElementById('time_parab');

	parabSlider.noUiSlider.on('update', function( values, handle ) {
		parab_val.innerHTML = values[handle];
	});

	var elliptSlider = document.getElementById('ellipt_x');

	var steps_X = $(".ellipt [name=ell_param_s1]").val();
	var x_min = $(".ellipt [name=ell_param_s3]").val();
	var x_max = $(".ellipt [name=ell_param_s5]").val();

	noUiSlider.create(elliptSlider, {
		start: 0,
		step: parseFloat((parseInt(x_max) - parseInt(x_min)) / parseFloat(steps_X)),
		range: {
			'min': [parseFloat(x_min)],
			'max': [parseFloat(x_max)]
		}
	});
	var ellipt_val = document.getElementById('ellipt_val_x');

	elliptSlider.noUiSlider.on('update', function( values, handle ) {
		ellipt_val.innerHTML = values[handle];
	});
	var elliptSlidery = document.getElementById('ellipt_y');
      
    var steps_X = $(".ellipt [name=ell_param_s2]").val();
    var x_min = $(".ellipt [name=ell_param_s4]").val();
    var x_max = $(".ellipt [name=ell_param_s6]").val();

    noUiSlider.create(elliptSlidery, {
        start: 0,
        step: parseFloat((parseInt(x_max) - parseInt(x_min)) / parseFloat(steps_X)),
        range: {
            'min': [parseFloat(x_min)],
            'max': [parseFloat(x_max)]
        }
    });

	var ellipt_valy = document.getElementById('ellipt_val_y');

	elliptSlidery.noUiSlider.on('update', function( values, handle ) {
		ellipt_valy.innerHTML = values[handle];
	});

	$('.gr').click(function () {
		if(!$(this).hasClass('selected_gr')){
			if($(this).hasClass('gr1')){
				$(this).parent().find('.gr').removeClass('selected_gr');
				$(this).addClass('selected_gr');

				$(this).parent().find('.graf2').fadeOut(100,function () {
					$(this).parent().find('.graf1').fadeIn(100);
					$(this).parent().find('.time').fadeIn(100);
					$(this).parent().find('.example-val').fadeIn(100);
				});

			}
			if($(this).hasClass('gr2')){
				$(this).parent().find('.gr').removeClass('selected_gr');
				$(this).addClass('selected_gr');


				$(this).parent().find('.graf1').fadeOut(100,function () {
					$(this).parent().find('.graf2').fadeIn(100);
					//$(this).parent().find('.graf2').css("opacity","1");

					$(this).parent().find('.time').fadeOut(100);

				});

			}
		}
	})
	$('.gr_ellipt').click(function () {
		if(!$(this).hasClass('selected_gr')){
			if($(this).hasClass('gr1')){
				$(this).parent().find('.gr_ellipt').removeClass('selected_gr');
				$(this).addClass('selected_gr');
				$(this).parent().find('.graf4').fadeOut(100);
				$(this).parent().find('.graf3').fadeOut(100);
				$(this).parent().find('.time').fadeIn(100);
				$(this).parent().find('.example-val').fadeIn(100);
				$(this).parent().find('#ellipt_val_y').fadeOut(100);
				$(this).parent().find('#ellipt_y').fadeOut(100);

				$(this).parent().find('.graf2').fadeOut(100,function () {
					$(this).parent().find('.graf1').fadeIn(100);
					$(this).parent().find('.x').fadeIn(100);
					$(this).parent().find('.y').fadeOut(100);
					$(this).parent().find('#ellipt_val_x').fadeIn(100);
					$(this).parent().find('#ellipt_x').fadeIn(100);


				});

			}
			if($(this).hasClass('gr2')){
				$(this).parent().find('.gr_ellipt').removeClass('selected_gr');
				$(this).addClass('selected_gr');
				$(this).parent().find('#ellipt_val_y').fadeOut(100);
				$(this).parent().find('#ellipt_y').fadeOut(100);

				$(this).parent().find('.graf4').fadeOut(100);
				$(this).parent().find('.graf3').fadeOut(100);
				$(this).parent().find('.graf1').fadeOut(100,function () {
					$(this).parent().find('.graf2').fadeIn(100);
$(this).parent().find('#ellipt_val_x').fadeOut(100);
					$(this).parent().find('#ellipt_x').fadeOut(100);
										$(this).parent().find('.x').fadeOut(100);
					$(this).parent().find('.y').fadeOut(100);
					//$(this).parent().find('.graf2').css("opacity","1");
				});


			}
			if($(this).hasClass('gr3')){
				console.log("gr3");
				$(this).parent().find('.gr_ellipt').removeClass('selected_gr');
				$(this).addClass('selected_gr');
				$(this).parent().find('.time').fadeIn(100);
				$(this).parent().find('.example-val').fadeIn(100);
				$(this).parent().find('#ellipt_val_x').css("display","none");
				$(this).parent().find('#ellipt_x').css("display","none");

				$(this).parent().find('.graf4').fadeOut(100);
				$(this).parent().find('.graf2').fadeOut(100);
				$(this).parent().find('.graf1').fadeOut(100,function () {
					$(this).parent().find('.graf3').fadeIn(100);
					$(this).parent().find('.y').fadeIn(100);
					$(this).parent().find('.x').fadeOut(100);
					$(this).parent().find('#ellipt_val_y').css("display","inline-block");
					$(this).parent().find('#ellipt_y').css("display","block");

				});

			}
			if($(this).hasClass('gr4')){
				$(this).parent().find('.gr_ellipt').removeClass('selected_gr');
				$(this).addClass('selected_gr');


				$(this).parent().find('#ellipt_val_x').fadeOut(100);
				$(this).parent().find('#ellipt_x').fadeOut(100);

				$(this).parent().find('.graf2').fadeOut(100);
				$(this).parent().find('.graf3').fadeOut(100);

				$(this).parent().find('.graf1').fadeOut(100,function () {
					$(this).parent().find('.graf4').fadeIn(100);
                    $(this).parent().find('#ellipt_val_y').fadeOut();
					$(this).parent().find('#ellipt_y').fadeOut(100);
					$(this).parent().find('.x').fadeOut(100);
					$(this).parent().find('.y').fadeOut(100);

				});


			}
		}
	})
	$(".parab input").change(function() {


		if ($('input#explicit-parabolic').prop("checked")){
//			console.log('yes');
			var tau = parseFloat($('#max_t-parabolic').val()/$('#K-parabolic').val());
			var h  = parseFloat(($('#max_x-parabolic').val() - $('#min_x-parabolic').val())/$('#N-parabolic').val());
			var sigma =parseFloat( parseFloat($("input[name='par_param1']").val())*parseFloat($("input[name='par_param1']").val())*tau/h/h).toFixed(2);//*$("input[name='par_param1']");
			//console.log('tau',tau);
			//console.log('N',$('#N').val());
			//console.log('tau',$('#max_x').val());
			$('#sigma text:nth-child(2)').text(sigma);
			$('#sigma').css("display","block");
			return;
		} else {
			$('#sigma').fadeOut(300);
		}
	})
	$("#sor-elliptic").change(function() {


		if ($('input#sor-elliptic').prop("checked")){
//			console.log('yes');

			$('.relax').fadeIn();
			return;
		} else {
			$('.relax').fadeOut(300);
		}
	})
	$('.btn_bottom').click(function(){
//		console.log('click');
		$('.center_block').addClass('top_block');
		$('.top_block').removeClass('center_block');
		$('.bottom_block').addClass('center_block');

		setTimeout(function() {
			$('.center_block').removeClass('bottom_block');
		}, 1000);
	})
	$('.btn_left').click(function(){
//		console.log('clicl');
		$('.center_block').addClass('right_block');
		$('.right_block').removeClass('center_block');
		$('.left_block').addClass('center_block');

		setTimeout(function() {
			$('.center_block').removeClass('left_block');

		}, 1000);

	});
	$('.btn_right').click(function(){
//		console.log('clicl');
		$('.center_block').addClass('left_block');
		$('.left_block').removeClass('center_block');
		$('.right_block').addClass('center_block');

		setTimeout(function() {
			$('.center_block').removeClass('right_block');

		}, 1000);

	});
$('.full_menu .menu_item').click(function () {
$('.full_menu').hide();

})

	$('.menu_item:nth-child(1)').click(function () {

		move_center();

		//$('.giperb').addClass('.center_block');
	})
	$('.menu_item:nth-child(2)').click(function () {
		if($('.center_block').hasClass('giperb')){
		}
		else {
			move_center();
			$('.center_block').addClass('top_block');
			$('.top_block').removeClass('center_block');
			$('.bottom_block').addClass('center_block');

			setTimeout(function () {
				$('.center_block').removeClass('bottom_block');

			}, 1000);
		}
		//$('.giperb').addClass('.center_block');
	})
	$('.menu_item:nth-child(3)').click(function () {
		if($('.center_block').hasClass('ellipt')){

		}
		else {
			move_center();
			$('.center_block').addClass('left_block');
			$('.left_block').removeClass('center_block');
			$('.ellipt').addClass('center_block');

			setTimeout(function () {
				$('.center_block').removeClass('right_block');

			}, 1000);
			//$('.giperb').addClass('.center_block');
		}
	})

	$('.menu_item:nth-child(4)').click(function () {
		if($('.center_block').hasClass('parab')){

		}
		else {
			move_center();
			$('.center_block').addClass('right_block');
			$('.right_block').removeClass('center_block');
			$('.parab').addClass('center_block');

			setTimeout(function () {
				$('.parab').removeClass('left_block');

			}, 1000);
			//$('.giperb').addClass('.center_block');
		}
	})
	//plugin bootstrap minus and plus
//http://jsfiddle.net/laelitenetwork/puJ6G/
	$('.btn-number').click(function(e){
		e.preventDefault();
		var float  =0;
		if($(this).hasClass('int')){
			float  =1;
		}
		fieldName = $(this).attr('data-field');
		type      = $(this).attr('data-type');
		var input = $("input[name='"+fieldName+"']");
		if(float != 1){
			var currentVal = parseFloat(input.val());
		}
		else {
			var currentVal = parseInt(input.val());
		}
		if (!isNaN(currentVal)) {
			if(type == 'minus') {
				if(float != 1){
					var v = currentVal - 0.1;
					v = v.toFixed(2);
					input.val(v).change();
				}
				else {
					if (currentVal > parseInt(input.attr('min'))) {
						var v = currentVal - 1;
						//v = v.toFixed(2);
						input.val(v).change();
					}
				}
				if(input.val() ==parseInt(input.attr('min'))) {
					$(this).attr('disabled', true);
				}

			} else if(type == 'plus') {
				if(float != 1) {

					if(currentVal < input.attr('max')) {
						var v = currentVal + 0.1;
						v = v.toFixed(2);
						input.val(v).change();
					}

				}
				else{
					if (currentVal < parseInt(input.attr('max'))) {
						var v = currentVal + 1;
						//v = v.toFixed(2);
						input.val(v).change();
					}
				}
				if(input.val() == input.attr('max')) {
					$(this).attr('disabled', true);
				}

			}
		} else {
			input.val(0);
		}
	});
	$('.input-number').focusin(function(){
		$(this).data('oldValue', $(this).val());
	});
	$('.input-number').change(function() {
		if(!$(this).hasClass('int')) {
			minValue =  parseFloat($(this).attr('min'));
			maxValue =  parseFloat($(this).attr('max'));
			valueCurrent = parseFloat($(this).val());
			minValue = minValue.toFixed(2);
			maxValue = maxValue.toFixed(2);
			valueCurrent = valueCurrent.toFixed(2);
			console.log(maxValue);
			console.log(valueCurrent);

		}
		else {
			minValue = parseInt($(this).attr('min'));
			maxValue = parseInt($(this).attr('max'));
			console.log(maxValue);
			valueCurrent = parseInt($(this).val());
		}
//minValue = minValue.toFixed(2);
		//maxValue = maxValue.toFixed(2);
		//valueCurrent = valueCurrent.toFixed(2);
		name = $(this).attr('name');
		if(Number(valueCurrent) >=Number( minValue)) {

			$(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
		} else {
			alert('Sorry, the minimum value was reached');
			$(this).val($(this).data('oldValue'));
		}
		if(Number(valueCurrent) <= Number(maxValue)) {
			$(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
		} else {
			console.log(maxValue,valueCurrent);
			alert('Sorry, the maximum value was reached');
			$(this).val($(this).data('oldValue'));
		}


	});
	$(".input-number").keydown(function (e) {
		// Allow: backspace, delete, tab, escape, enter and .
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
			// Allow: Ctrl+A
			(e.keyCode == 65 && e.ctrlKey === true) ||
			// Allow: home, end, left, right
			(e.keyCode >= 35 && e.keyCode <= 39)) {
			// let it happen, don't do anything
			return;
		}
		// Ensure that it is a number and stop the keypress
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
			e.preventDefault();
		}
	});
	/*
	$( ".giperb [name=param_s4]" ).change(function() {
		change_giperb_t();
	});
	$( ".giperb [name=param_s1]" ).change(function() {
		change_giperb_t();
	});

	$( ".parab [name=par_param_s4]" ).change(function() {
		change_par_t();
	});
	$( ".parab [name=par_param_s1]" ).change(function() {
		change_par_t();
	});
	$( ".ellipt [name=ell_param_s1]" ).change(function() {
		change_ellipt_x();
	});
	$( ".ellipt [name=ell_param_s3]" ).change(function() {
		change_ellipt_x();
	});
	$( ".ellipt [name=ell_param_s5]" ).change(function() {
		change_ellipt_x();
	});
	$( ".ellipt [name=ell_param_s2]" ).change(function() {
		change_ellipt_y();
	});
	$( ".ellipt [name=ell_param_s4]" ).change(function() {
		change_ellipt_y();
	});
	$( ".ellipt [name=ell_param_s6]" ).change(function() {
		change_ellipt_y();
	});
	*/
	$('.collapsible').collapsible();
});

//plugin bootstrap minus and plus
//http://jsfiddle.net/laelitenetwork/puJ6G/



			jQuery(function($) {						
				if(!ace.vars['touch']) {
					$('.chosen-select').chosen({allow_single_deselect:true}); 

          $('#chosen-multiple-style .btn').on('click', function(e){
						var target = $(this).find('input[type=radio]');
						var which = parseInt(target.val());
						if(which == 2) $('#form-field-select-4').addClass('tag-input-style');
						 else $('#form-field-select-4').removeClass('tag-input-style');
					});
				}
        //For Data Range Picker
        $('.input-daterange').datepicker({autoclose:true});		
  });
		
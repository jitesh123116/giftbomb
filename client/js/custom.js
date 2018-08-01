// $(document).ready(function(){
// 			jQuery(function($) {						
// 				if(!ace.vars['touch']) {
// 					('.chosen-select').chosen({allow_single_deselect:true}); 

//           jQuery('#chosen-multiple-style .btn').on('click', function(e){
// 						var target = jQuery(this).find('input[type=radio]');
// 						var which = parseInt(target.val());
// 						if(which == 2) jQuery('#form-field-select-4').addClass('tag-input-style');
// 						 else jQuery('#form-field-select-4').removeClass('tag-input-style');
// 					});
// 				}
//         //For Data Range Picker
//         jQuery('.input-daterange').datepicker({autoclose:true});		
//   });
// 		})
// 		

jQuery(document).ready(function(){  
  jQuery(".menu_left li a").on('click', function(e){
    jQuery(".menu_left .active").removeClass('active');
    jQuery(this).parent().addClass('active'); 
    e.preventDefault();
});


  
});


app.controller('manageDesignController', function($scope,constantUrl,servercalls,$state,$rootScope,toastr,$window){
  //check user login session
  (function(){
    if(!$window.localStorage.getItem('id')){
        $state.go('login');
    }
  })();
  $scope.design = {};
  $scope.storeImage = "";
  $scope.postDesign = {
    backGroundColor : "",
    fontColor : ""
  };  
  $scope.BASEURL = constantUrl.BASE_URL; 
  
  $scope.$on('$viewContentLoaded', function() {    
    $scope.fetchStore();    
  });
  
  /**
   * 
   * @returns {undefined}
   */
  $scope.fetchStore = function(){      

    var id = $window.localStorage.getItem('id');       
    var background_color = "";
    servercalls.getData('/store/single/'+id,{}, function(err, data){        
      if(err){                      
        toastr.error("Something is wrong, please try after some time");
      }else{          
        if(data.status.status == 200){          
          $scope.design = data.data;  
          if($scope.design.designInfo!==undefined && $scope.design.designInfo.backGroundColor!==undefined){
            $(".gift_color").css("background-color", $scope.design.designInfo.backGroundColor);
            background_color = $scope.design.designInfo.backGroundColor;
          }
          if($scope.design.designInfo!==undefined && $scope.design.designInfo.fontColor!==undefined){
            $(".change_font_color").css("color", $scope.design.designInfo.fontColor);
            $(".font_color").css("background-color", background_color);
            
          } 
//          toastr.success(data.status.message);                              
        }else{
          toastr.error(data.status.message);
        }				
      }
    })
  }
  
  /**
   *@setUpdateColumns    
   */
  $scope.setUpdateColumns = function(data, storeData){
    console.log("setUpdateColumns");
    console.log("data", data);
    console.log("storeData", storeData);
    
    var postArray = {};          
    if($scope.postDesign.backGroundColor && data.designInfo!==undefined &&  data.designInfo.backGroundColor!==undefined &&  data.designInfo.backGroundColor!=$scope.postDesign.backGroundColor){
      postArray['backGroundColor'] =$scope.postDesign.backGroundColor;
    }else if(data.designInfo===undefined && $scope.postDesign.backGroundColor){
      postArray['backGroundColor'] =$scope.postDesign.backGroundColor;
    }
    if($scope.postDesign.fontColor && data.designInfo!==undefined &&  data.designInfo.fontColor!==undefined &&  data.designInfo.fontColor!=$scope.postDesign.fontColor){
      postArray['fontColor'] =$scope.postDesign.fontColor;
    }else if(data.designInfo===undefined && $scope.postDesign.fontColor){
      postArray['fontColor'] =$scope.postDesign.fontColor;
    }
       
    return postArray;
  }
  
  
  
  /**
   *@updateDesignInfo   
   */
  $scope.updateDesignInfo = function(){
    console.log("updateDesignInfo");
    // find store details    
    var pushData = $scope.setUpdateColumns($scope.design, $scope.postDesign);
    console.log("pushData",pushData);
    //return;
    var where = {
      storeId : $window.localStorage.getItem('id'),
      "requestType" : "designInfo", 
    }
    if(Object.keys(pushData).length >0 || $scope.storeImage){

      servercalls.postData('/request/fetch',where, function(err, data){           
        if(data.status.status == 200 && data.data.length>0){


          var payload = new FormData();
          payload.append('storeImage', $scope.storeImage);            
          payload.append('column', JSON.stringify({ $set: {  'updateData.designInfo'  : pushData } }));
          payload.append('where', JSON.stringify(where));
          payload.append('stringify', 1);
          
          console.log

          servercalls.editRequest('/request/updateRequestForDesign', payload, function(err, data){
          //servercalls.postData('/request/updateData',params, function(err, data){                
            if(err){                      
              toastr.error("Something is wrong, please try after some time");
            }else{          
              if(data.status.status == 200){
                toastr.success(data.status.message);
                $state.go('dashboard');
              }else{
                toastr.error(data.status.message);
              }				
            }
          })
        } else{
          var params = {
            storeId : $window.localStorage.getItem('id'),
            requestType : 'designInfo',
            updateData : { 'designInfo' : pushData}
          }              
          var payload = new FormData();
          payload.append('storeImage', $scope.storeImage);            
          payload.append('params', JSON.stringify(params));
          
          
          
          
          servercalls.createRequest('/request/createRequestForDesign', payload, function(err, data){

          //servercalls.postData('/request/',params, function(err, data){                
            if(err){                      
              toastr.error("Something is wrong, please try after some time");
            }else{          
              if(data.status.status == 200){
                toastr.success(data.status.message); 
                $state.go('dashboard');
              }else{
                toastr.error(data.status.message);
              }				
            }
          })
        }            
      }); 
    }
  }
  
  /**
  * 
  * @fileChanged
  */
  $scope.fileChanged = function($event) {  
    console.log("fileChanged");
    var files = $event.target.files;   
    $scope.storeImage = files[0];    
  }
  
  $(function(){
    
    function updateFont(color) {
      var hexColor = "transparent";
      if(color) {
        hexColor = color.toHexString();
        $scope.postDesign.fontColor = hexColor;
      }    
      $(".change_font_color").css("color", hexColor);
      if($scope.postDesign.backGroundColor!==undefined && $scope.postDesign.backGroundColor){
        $(".font_color").css("background-color", $scope.postDesign.backGroundColor);
      } 
    }
  
    function updateBox(color) {
      var hexColor = "transparent";
      if(color) {
        hexColor = color.toHexString();
        $scope.postDesign.backGroundColor = hexColor;
      }
      $(".gift_color").css("background", hexColor);
      if($scope.postDesign.fontColor!==undefined && $scope.postDesign.fontColor){
        $(".font_color").css("background-color", hexColor);
      }  
    }

    $("#flat").spectrum({
        preferredFormat: "hex",
        color: "#ECC",
        flat: true,
        showInput: true,
        move: function (color) {
          updateFont(color);
      }
    });
  
    $("#gcard").spectrum({
        preferredFormat: "hex",
        color: "#ECC",
        flat: true,
        showInput: true,
        move: function (color) {
          updateBox(color);
      }
    });
    
    
    $('#i_file').change( function(event) {
    var tmppath = URL.createObjectURL(event.target.files[0]);
        $("img").fadeIn("fast").attr('src',URL.createObjectURL(event.target.files[0]));
        //$("#disp_tmp_path").html("Temporary Path(Copy it and try pasting it in browser address bar) --> <strong>["+tmppath+"]</strong>");
    });
    
  });  
})


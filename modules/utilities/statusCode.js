module.exports = function(code , message , data , paging){
  message ? message : message = "Internal Server Error"
	data ? data : data = null;
  paging ? paging : paging = null;
	var status ={};
	switch(code) {
    case "SC200":
      status = {
        "status": {
          "status": "200",
          "message": message
        },
        "data": data
        }
      break;
    case "SC201":
      status = {
        "status": {
          "status": "201",
          "message": message
        },
        "data": data
        }
      break;
    case "SC202":
      status = {
        "status": {
          "status": "202",
          "message": message
        },
        "data": data
        }
      break;
      case "SC204":
      status = {
        "status": {
          "status": "204",
          "message": message
        },
        "data": data
        }
      break;
      
      
    default:
      status ={
        "status": {
          "status": "202",
          "message": message
        },
        "data": data
      }
	}
	return status;
};
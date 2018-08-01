var url = {
   /** Start Local Configuration **//*
   "BASEURl": "http://localhost:3001",   
   "DOCUMENT_ROOT_UPLOAD" : "/var/www/html/giftbomb_mean/uploads/",
   "DOCUMENT_ROOT_STORELOGO" : "/var/www/html/giftbomb_mean/uploads/request/StoreLogo/",
   /** End Local Configuration **/
   
   /** Start Dev Configuration **/       
   "BASEURl": "http://54.152.168.199:3000", 
   "DOCUMENT_ROOT_UPLOAD" : "/home/giftbomb/giftbomb_mean/uploads/",
   "DOCUMENT_ROOT_STORELOGO" : "/home/giftbomb/giftbomb_mean/uploads/request/StoreLogo/",
	 "THANKYOU_CRON_DAYS":7
   /** End Dev Configuration **/
}


var account_status= {
	 'ACTIVE':'ACTIVE',
	 'DELETED_BY_USER':'DELETED_BY_USER',
	 'DELETED_BY_ADMIN':'DELETED_BY_ADMIN'
}

var categories = [{
		
		"singular": "Activity Center",
		"plural": "Activity Centers"
},


	{
	
		"singular": "Art Gallery",
		"plural": "Art Galleries"
},


	{
		
		"singular": "Baby Store",
		"plural": "Baby Stores"
},


	{
		
		"singular": "Bakery",
		"plural": "Bakeries"
},

	{
	
		"singular": "Bar",
		"plural": "Bars"
},


	{
	
		"singular": "Bookstore",
		"plural": "Bookstores"
},


	{
		
		"singular": "Brewery",
		"plural": "Breweries"
},

	{
		
		"singular": "Candy Store",
		"plural": "Candy Stores"
},


	{
	
		"singular": "Coffee Shop",
		"plural": "Coffee Shops"
},


	{
		
		"singular": "Dispensary",
		"plural": "Dispensaries"
},


	{
	
		"singular": "Entertainment",
		"plural": "Entertainment"
},

	{
		
		"singular": "Food Delivery",
		"plural": "Food Delivery"
},


	{
	
		"singular": "Furniture Store",
		"plural": "Furniture Stores"
},


	{
	
		"singular": "Gas Station",
		"plural": "Gas Stations"
},


	{
		
		"singular": "Golf Course",
		"plural": "Golf Courses"
},


	{
	
		"singular": "Grocery",
		"plural": "Groceries"
},


	{
		"singular": "Hair Salon",
		"plural": "Hair Salons"
},


	{
		
		"singular": "Hardware Store",
		"plural": "Hardware Stores"
},


	{
		
		"singular": "Health Club",
		"plural": "Health Clubs"
},


	{
		
		"singular": "Health Store",
		"plural": "Health Stores"
},


	{
		
		"singular": "Home & Appliance Store",
		"plural": "Home & Appliance Stores"
},


	{
	
		"singular": "Hotel",
		"plural": "Hotels"
},


	{
		
		"singular": "Jewelry Store",
		"plural": "Jewelry Stores"
},


	{
		
		"singular": "Liquor Store",
		"plural": "Liquor Stores"
},


	{
		
		"singular": "Massage",
		"plural": "Massage"
},


	{
		
		"singular": "Nail Salon",
		"plural": "Nail Salons"
},


	{
	
		"singular": "Pet Store",
		"plural": "Pet Stores"
},


	{
	
		"singular": "Resort",
		"plural": "Resorts"
},


	{
		
		"singular": "Restaurant",
		"plural": "Restaurants"
},


	{
		
		"singular": "Retail Store",
		"plural": "Retail Stores"
},


	{
		
		"singular": "Sporting Good Store",
		"plural": "Sporting Good Stores"
},


	{
		
		"singular": "Tattoo Parlor",
		"plural": "Tattoo Parlors"
},


	{
		
		"singular": "Toy Store",
		"plural": "Toy Stores"
},


	{
		
		"singular": "University",
		"plural": "Universities"
},
	{
		
		"singular": "Other",
		"plural": "Other"
}];
module.exports = {
  "url": url,
	"account_status":account_status,
	"categories":categories
};

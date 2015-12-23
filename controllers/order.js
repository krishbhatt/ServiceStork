var express = require('express');
var OrderModel = require('../models/OrderModel');
var router = express.Router();
var moment = require('moment-timezone');
var messages = require('../messages.js');
var auth = require('../config/auth');
var expressValidator = require('express-validator');


router.post('/',auth.authorize, function (req, res, next) {

    var orderdate = req.body.orderdate;
    var customerid = req.body.customerid;
    var totalservicevalue = req.body.totalservicevalue;
    var totaltaxamount = req.body.totaltaxamount;
    var tipamount = req.body.tipamount;
    var promocode = req.body.promocode;
    var promodiscountamount = req.body.promodiscountamount;
    var netamount = req.body.netamount;
    var notes = req.body.notes;
    var orderdetails = req.body.orderdetails;
	var orderdetailaddons=req.body.orderdetailaddons;
    var addedby = req.body.userid;
    var modifiedby = req.body.userid;
	var ordercode="";
    var errors = req.validationErrors();
    if (errors) {
        return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
    }
    else {
       		OrderModel.find( function (err, orderCodeExist) {
            if (err) {
                return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
            }
			else if(orderCodeExist.length>0)
			{
						OrderModel.findOne({},null, {sort: {ordercode: -1}}, function (err, maxOrderCode) {
							
					if (err) {
						return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
					}
					else if(maxOrderCode.ordercode!="")
					{
							ordercode=(parseInt(maxOrderCode.ordercode)+1).toString();
							  var _newsorder = new OrderModel({
						'ordercode':ordercode,
						'orderdate': orderdate,
						'customerid': customerid,
						'totalservicevalue': totalservicevalue,
						'totaltaxamount': totaltaxamount,
						'tipamount': tipamount,
						'promocode': promocode,
						'promodiscountamount': promodiscountamount,
						'netamount': netamount,
						'notes':notes,
						'orderdetails':orderdetails,
						'orderdetailaddons':orderdetailaddons,
						'addedby': addedby,
						'modifiedby': modifiedby
					});
					_newsorder.save(function (error) {
					  // console.log(error);
						if (error)
							return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
						else
							return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted",req.headers.responsetype));
					});
			
					}
				});
			}
			
			else
			{
					  ordercode=10001;
					  var _newsorder = new OrderModel({
						'ordercode':ordercode,
						'orderdate': orderdate,
						'customerid': customerid,
						'totalservicevalue': totalservicevalue,
						'totaltaxamount': totaltaxamount,
						'tipamount': tipamount,
						'promocode': promocode,
						'promodiscountamount': promodiscountamount,
						'netamount': netamount,
						'notes':notes,
						'orderdetails':orderdetails,
						'orderdetailaddons':orderdetailaddons,
						'addedby': addedby,
						'modifiedby': modifiedby
					});
					_newsorder.save(function (error) {
					  // console.log(error);
						if (error)
							return res.send(messages.CustomExceptionHandler("systemerror", error.message,req.headers.responsetype));
						else
							return res.send(messages.CustomExceptionHandler("success", "Successfully Inserted",req.headers.responsetype));
					});
			}
		});
    }  
});


router.get('/',auth.authorize, function (req, res, next) {
    OrderModel.find(
		{ "isactive": true, "isdeleted": false }
	    ).populate(["customerid","OrderDetailsSchema","orderdetailaddons"]).exec(function (err, orders) {
	        if (err) 
	            return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
        else
             return res.send(messages.CustomExceptionHandler("success", orders,req.headers.responsetype));
	        
	    });
});

router.get('/:id',auth.authorize, function (req, res, next) {
    var _orderid = req.params.id;
    OrderModel.findOne(
		{ "_id": _orderid ,"isactive": true, "isdeleted": false }
	    ).populate(["customerid","OrderDetailsSchema","orderdetailaddons"]).exec(function (err, order) {
	        if (err) 
			return res.send(messages.CustomExceptionHandler("systemerror", err.message,req.headers.responsetype));
        else
             return res.send(messages.CustomExceptionHandler("success", order,req.headers.responsetype));
	    });
});

router.put('/',auth.authorize, function (req, res, next) {
	 req.check('isdeleted', 'Deleted status should be ture or false(boolean).').isBoolean();
	   req.check('isactive', 'Active status should be ture or false(boolean).').isBoolean();
	var _orderid = req.body.orderid;
	var orderdate = req.body.orderdate;
    var customerid = req.body.customerid;
    var totalservicevalue = req.body.totalservicevalue;
    var totaltaxamount = req.body.totaltaxamount;
    var tipamount = req.body.tipamount;
    var promocode = req.body.promocode;
    var promodiscountamount = req.body.promodiscountamount;
    var netamount = req.body.netamount;
    var notes = req.body.notes;
    var orderdetails = req.body.orderdetails;
    var orderdetailaddons=req.body.orderdetailaddons;
    var addedby = req.body.userid;
    var modifiedby = req.body.userid;
    var modifieddate = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var isdeleted = req.body.isdeleted;
    var isactive = req.body.isactive;
    var isvisible = req.body.isvisible;
   
            OrderModel.findOne({
                '_id': _orderid
            }, function (error, findorder) {
                if (error) {
                   return res.send(messages.CustomExceptionHandler("requiredparams", errors,req.headers.responsetype));
                }
                else if (findorder) {
                    OrderModel.update({
                        '_id': _orderid
                    }, {
                        $set: {
							        'orderdate': orderdate,
									'customerid': customerid,
									'totalservicevalue': totalservicevalue,
									'totaltaxamount': totaltaxamount,
									'tipamount': tipamount,
									'promocode': promocode,
									'promodiscountamount': promodiscountamount,
									'netamount': netamount,
									'notes':notes,
									'orderdetails':orderdetails,
									'orderdetailaddons':orderdetailaddons,
									'addedby': addedby,
									'modifiedby': modifiedby,
									'modifieddate': modifieddate,
									'isdeleted': isdeleted,
									'isactive': isactive,
									'isvisible': isvisible
                        }
                    }, function (errupdate, orderupdate) {
                        if (errupdate)
                           return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
					    else
						return res.send(messages.CustomExceptionHandler("success", "Successfully updated.",req.headers.responsetype));
                    });
                }
                else {
               return res.send(messages.CustomExceptionHandler("authorization", "Order could not found!",req.headers.responsetype));                }
            });
        
});

router.delete('/:orderid',auth.authorize, function (req, res, next) {
    var _orderid = req.params.orderid;
    OrderModel.findOne({ '_id': _orderid }, function (err, orderExist) {
        if (err) {
            return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
        }
        else if (orderExist) {
            OrderModel.update({
                '_id': _orderid
            }, {
                $set: {
                    'isdeleted': true
                }
            }, function (errupdate, orderupdate) {
                if (errupdate)
                     return res.send(messages.CustomExceptionHandler("systemerror", errupdate.message,req.headers.responsetype));
			else
			   return res.send(messages.CustomExceptionHandler("success", "Successfully deleted.",req.headers.responsetype));        });
        }
        else {
					return res.send(messages.CustomExceptionHandler("authorization", "Order could not found!",req.headers.responsetype));

        }
    });
});


module.exports = router;
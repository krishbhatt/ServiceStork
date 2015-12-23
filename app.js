var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var http = require('http');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy
var UsersModel = require('./models/UsersModel');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var morgan = require('morgan')

var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});


var app = express();

app.use(morgan('combined', {stream: accessLogStream}));
var region = require('./controllers/region');
var subregion = require('./controllers/subregion');
var country = require('./controllers/country');
var city = require('./controllers/city');
var appointmenttype = require('./controllers/appointmenttype');
var serviceprovider = require('./controllers/serviceprovider');
var service = require('./controllers/service');
var supply = require('./controllers/supply');
var assignmenttype = require('./controllers/assignmenttype');
var user = require('./controllers/user');
var userrole = require('./controllers/userrole');
var serviceregion = require('./controllers/serviceregion');
var currency = require('./controllers/currency');
var duration = require('./controllers/duration');
var servicelocation = require('./controllers/servicelocation');
var servicepackageaddon = require('./controllers/servicepackageaddon');
var servicepackage = require('./controllers/servicepackage');
var companyinfo = require('./controllers/companyinfo');
var customertype = require('./controllers/customertype');
var customer = require('./controllers/customer');
var paymentmode = require('./controllers/paymentmode');
var taxmaster = require('./controllers/taxmaster');
var order = require('./controllers/order');
var paymentlog = require('./controllers/paymentlog');

/*app.set('views', require('path').join(__dirname, 'views'));  
app.engine('html', require('ejs').renderFile); 
app.set('view engine', 'html');*/

//app.use(logger('dev'));
//app.use(messages);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/region', region);
app.use('/api/subregion', subregion);

app.use('/api/country', country);
app.use('/api/city', city);
app.use('/api/appointmenttype', appointmenttype);
app.use('/api/serviceprovider', serviceprovider);
app.use('/api/service', service);
app.use('/api/supply', supply);
app.use('/api/assignmenttype', assignmenttype);
app.use('/api/user', user);
app.use('/api/userrole', userrole);
app.use('/api/serviceregion', serviceregion);
app.use('/api/currency', currency);
app.use('/api/duration', duration);
app.use('/api/servicelocation', servicelocation);
app.use('/api/servicepackageaddon', servicepackageaddon);
app.use('/api/servicepackage', servicepackage);
app.use('/api/companyinfo', companyinfo);
app.use('/api/customertype', customertype);
app.use('/api/customer', customer);
app.use('/api/paymentmode', paymentmode);
app.use('/api/taxmaster', taxmaster);
app.use('/api/order', order);
app.use('/api/paymentlog', paymentlog);

/*passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    UsersModel.findOne({
      'name': username, 
    }, function(err, user) {
      console.log(user)
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      if (user.password != password) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
}));*/

passport.use(new BearerStrategy(
  function(token, done) {
    console.log("tokendcgbcv");
    UsersModel.findOne({ access_token: token }, function (err, user) {
      console.log(user)
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'read' });
    });
  }
));


passport.use(new LocalStrategy(function(username, password, done) {
  
  process.nextTick(function() {
    UsersModel.findOne({
      'name': username, 
    }, function(err, user) {
      console.log(user)
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      if (user.password != password) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
}));

    

   

options = {
        clientID: "528950910586691",
        clientSecret: "08219649a47ff3ad72197cb798b0c106",
        callbackURL: 'http://45.79.185.199:8080/api/user/auth/facebook/callback'
    };

    passport.use(
        new FacebookStrategy(
            options,
            function(accessToken, refreshToken, profile, done) {
              console.log(profile);
                UsersModel.findOrCreate(
                    { facebookId: profile.id },
                    function (err, result) {
                        if(result) {                          
                            result.access_token = accessToken;
                            result.name=profile.displayName;
                            result.save(function(err, doc) {
                                done(err, doc);
                            });
                        } else {
                            done(err, result);
                        }
                    }
                );
            }
        )
    );

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
/*app.use(express.cookieParser());
app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session 
*/




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {      
         res.send(err.status || 500,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":err.status || 500},"Result":err.message});
        
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {  
console.log("krish") 
     res.send(err.status || 500,{"ResponseDetails":{"ResponseCode":"Bad Request","ResponseStatus":err.status || 500},"Result":err.message});
});


app.set('port', process.env.PORT || 8080);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});


module.exports = app;


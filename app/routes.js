var dir = require('node-dir');
var idps = require(__dirname+"/lib/idps.json");
var userInfo = require(__dirname+"/lib/user.json");
var verifyRoot = process.env.VERIFY_ROOT || "http://localhost:3000";
var request = require("request");
var marked = require("marked");
var queryString = require("query-string");
var dbURL = 'http://govuk-verify-db.herokuapp.com/prototypes/stable';

var NotifyClient = require('notifications-node-client').NotifyClient;

console.log(process.env.NOTIFYAPIKEY);
notifyClient = new NotifyClient(process.env.NOTIFYAPIKEY);

console.log("Verify root: " + verifyRoot);

module.exports = {
  bind : function (app) {

    function getServices(callback){

      console.log("get services data");

      request(dbURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {

          services = JSON.parse(body);

          callback();

        } else {
          callback(error);
        }
      });

    };

    function getService(req){

      var requestId = "passport";

      if (req.query){

        // request object

        requestId = req.query.requestId ;

      } else {

        // string

        requestId = req;

      }

      console.log("getService("+requestId+")");

      return services[requestId];

    };

    app.use(function (req, res, next) {

      // send common data to every view:
      // service, IDP root

      var requestId = req.query.requestId || "dvla";
      var request = req.query.request || "2";

      getServices(function(error){

        if (error){
          req.status(500).send(error);
          return;
        }

        var service = getService(requestId);


        if (!service){
          res.status(404).send("Service not found");
          return;
        }

        res.locals.formData = "";
        res.locals.formQuery = "?";
        res.locals.formHash = {};

        for (var name in req.query){
          var value = req.query[name];
          res.locals.formHash[name] = value;
          res.locals.formData += '<input type="hidden" name="'+name+'" value="' + value + '">\n';
          res.locals.formQuery += name + "=" + value + "&";
        }

        res.locals.formQuery = res.locals.formQuery.slice(0,-1);

        res.locals.requestId = requestId;
        res.locals.request = request;
        res.locals.serviceName = service.name;
        res.locals.serviceLOA = service.LOA;
        res.locals.serviceAcceptsLOA1 = (service.LOA == "2,1");
        res.locals.userLOAis2 = (req.query.userLOA == "2");
        res.locals.serviceNameLower = service.name[0].toLowerCase() + service.name.substring(1);
        res.locals.serviceProvider = service.provider;
        res.locals.serviceOtherWays = (service.otherWays) ? marked(service.otherWays) : "";

        if (req.query.idp){
          res.locals.idpSlug = req.query.idp;
          res.locals.idpName = idps[req.query.idp];
        }

        res.locals.action = req.query.action || "register";
        res.locals.verifyRoot = verifyRoot;
        res.locals.isRegister = res.locals.action == "register";

        var path = (req.url);

        var pathParts = path.split('/');

        var idpSlug = "idp";

        if (pathParts.length > 2){

          idpSlug = pathParts[1];

        } else if (path != "/"){

          res.redirect("/idp"+path);
          return;

        }

        res.locals.idp = idps[idpSlug];
        res.locals.idpSlug = idpSlug;
        res.locals.baseURL = "/" + idpSlug;

        res.locals.useGOVUKTemplate = (idpSlug == "govuk");

        next();

      });

    });

    var listing = function (req, res){
      // Create a view data object
      var viewData = {};
      viewData.files = [];
      viewData.title = [];

      dir.readFiles(__dirname+"/views/", {
        match: /.html$/,
        exclude: ['template.html', 'layout.html', 'listing.html', 'test-form-page.html'],
        excludeDir: ['examples', 'includes'],
      },
      function(err, content, filename, next) {
        if (err) throw err;
        var file = {};
        file.path = filename.split("/views/").pop().replace(".html", "");
        file.name = file.path.replace(/-/g, " ");
        viewData.files.push(file);
        next();
      },
      function(err, files){
        if (err) throw err;
        // Callback to render page
        res.render('listing', viewData);
      });
    };

    app.get('/favicon.ico', function(req,res){

      res.send(200);

    });

    app.get('/', listing);
    app.get('/govuk', listing);

    app.get('/:idp/verify', function(req, res){

      res.redirect('/' + req.params.idp + '/create-account'+res.locals.formQuery);
      res.redirect('/' + req.params.idp + '/sign-in-register?requestId='+res.locals.requestId);

    });

    app.get('/:idp/sign-in-register', function (req, res) {

      var query = req.query;
      verify = query.verify

      res.render("sign-in-register", query);
    });

    app.post('/:idp/security-code', function(req, res){

      // if (req.query.idp == "experian"){

      //   res.redirect('/' + req.params.idp + "/memorable-word" + res.locals.formQuery);

      // } else {

      notifyClient.sendSms("5c179906-df50-44c9-b42e-f71de4c26b50", req.body.mobileNumber);
      res.redirect('/' + req.params.idp + '/security-code-2?' + queryString.stringify(req.body));
    // }

    });

    // app.get('/:idp/security-code', function(req, res){

    //   if (req.query.idp == "experian"){

    //     res.redirect('/' + req.params.idp + "/memorable-word" + res.locals.formQuery);

    //   } else {

    //   res.redirect('/' + req.params.idp + '/security-code-2?' + queryString.stringify(req.body));
    // }

    // });

    app.get('/:idp/sign-in-eidas', function (req, res) {

      var query = req.query;
      country = query.country

      res.render("sign-in-eidas", query);
    });

    app.get('/:idp/create-account', function (req, res) {

      var query = req.query;
      idp = query.idp

      res.render("create-account", query);
    });

    app.get('/:idp/sign-in', function (req, res) {

      var query = req.query;
      idp = query.idp

      res.render("sign-in", query);
    });

    app.get('/:idp/uplift-details-playback', function (req, res) {

      var data = {};
      data.userInfo = userInfo;

        console.log(data)


      res.render("uplift-details-playback", data);
    });


    app.get('/:idp/security-code-2', function(req, res){

    // PRE REG EXPERIAN SIGN IN ROUTING
      // if (req.query.idp == "experian"){

      //   res.redirect('/' + req.params.idp + "/memorable-word" + res.locals.formQuery);

      // } else {

      res.render('security-code-2', {mobileNumber:req.query.mobileNumber || "07777 123456"});
      // }
    });

    // fix this for <LOA2
    app.get('/:idp/security-code-done', function(req, res){


      if (res.locals.serviceLOA == '0' || res.locals.serviceLOA == '1'){

          if (req.query.action == 'sign-in'){

            res.redirect(verifyRoot +"/wait-for-match" + res.locals.formQuery + "&idp=" + req.params.idp + "&action=sign-in");

          } else {

          res.redirect('/' + req.params.idp + "/name" + res.locals.formQuery);

          }

      } else if (res.locals.serviceLOA === '2'){

        if (req.query.userLOA ==  "0"){
          res.redirect('/' + req.params.idp + "/name" + res.locals.formQuery);

        } else if (req.query.userLOA ==  "1"){
          res.redirect('/' + req.params.idp + "/uplift-start" + res.locals.formQuery);

        } else if (req.query.userLOA ==  "2") {
          res.redirect(verifyRoot +"/verify-success" + res.locals.formQuery + "&idp=" + req.params.idp + "&action=sign-in");
        }

      } else if (req.query.standalone == "true" || req.query.eidas == "true") {
          res.redirect('/' + req.params.idp + "/name" + res.locals.formQuery);

      } else if (req.query.action == "date-of-birth"){

        res.redirect('/' + req.params.idp + "/date-of-birth" + res.locals.formQuery);

      } else {

        res.redirect(verifyRoot +"/verify-success" + res.locals.formQuery + "&idp=" + req.params.idp + "&action=sign-in");

      }

    });


    ///// document input routing /////

    app.get('/:idp/name', function(req, res){

      var query = req.query;

      // routing for LOA 1 users uplifting to LOA2
      if (res.locals.serviceLOA === 2 && req.query.userLOA ==  "1"){
        res.redirect('/' + req.params.idp + "/uplift-start" + res.locals.formQuery);

      // routing for LOA 2 users in LOA2 journey
      } else if (res.locals.serviceLOA === 2 && req.query.userLOA ==  "2"){
        res.redirect('/' + req.params.idp + "/verified" + res.locals.formQuery);

      // routing for pre-reg docs
      } else {
        res.render("name");
      }
    });

    app.get('/:idp/select-documents', function(req, res){

      var query = req.query;

      var today = new Date();
      var minDate = new Date();
      minDate.setMonth(minDate.getMonth()-3);

      function dateCompare(date1, date2){
        return new Date(date2) > new Date(date1); //Returns true if date2 is later, false otherwise.
      }

      var moveDate = new Date(query.movemonth + '-1-' + query.moveyear );

      console.log(moveDate);
      console.log(minDate);

      if(dateCompare(minDate, moveDate)){
        console.log('moveDate is within 3 months ago. enter another address');
        res.redirect('address-manual-2' + res.locals.formQuery)
      }else{
        console.log('moveDate is not within 3 months ago. proceed');
      }

      if (res.locals.serviceLOA <= 1 && req.query.userLOA == '0'){
        res.redirect('/' + req.params.idp + "/select-loa1-method" + res.locals.formQuery);

      }

      // routing for LOA 1 docs
      else if (res.locals.serviceLOA <= 1 && query.loa1_kbv_done != 'true'){
        res.redirect('/' + req.params.idp + "/identity-test-question-1" + res.locals.formQuery);

      // routing for LOA 2 docs
      // removed query.standalone != 'true' ||
      } else if (query.passport == 'true' || query.driving_licence == 'true'){
        res.redirect('/' + req.params.idp + "/passport" + res.locals.formQuery);

      // routing for pre-reg docs
      } else {
        res.render("select-documents");
      }
    });


    app.get('/:idp/select-loa1-method', function(req, res){

      var query = req.query;
      passport = query.passport
      driving_licence = query.driving_licence
      apps = query.apps
      bank_account = query.bank_account

      if (query.passport != 'true' && query.driving_licence != "true" && query.bank_account != "true") {
        res.redirect('identity-test-question-loa1' + res.locals.formQuery)

      } else {

      res.render("select-loa1-method", query);

      }
    });

    app.get('/:idp/identity-test-intro', function(req, res){

      if (req.query.loa1route == 'true'){
        res.redirect('/' + req.params.idp + "/verified-loa1" + res.locals.formQuery);
      } else {
        res.render("identity-test-intro");
      }
    });

    app.get('/:idp/identity-test-question-1', function(req, res){

      var query = req.query;

      // routing for LOA 1 docs
       if (res.locals.serviceLOA <= 1 && query.loa1_kbv_done != 'true'){
        res.redirect('/' + req.params.idp + "/identity-test-question-loa1" + res.locals.formQuery);
      } else {
        res.render("identity-test-question-1", query);
      }
    });

    app.get('/:idp/identity-test-question-loa1', function(req, res){

      var query = req.query;

      // routing for LOA 1 docs
       if (query.loa1Method == 'bank'){
        res.redirect('/' + req.params.idp + "/faster-payment-1" + res.locals.formQuery + "&loa1route=true");
      } else if (query.loa1Method == 'driving_licence'){
        res.redirect('/' + req.params.idp + "/driving-licence" + res.locals.formQuery + "&loa1route=true");
      } else if (query.loa1Method == 'passport'){
        res.redirect('/' + req.params.idp + "/passport" + res.locals.formQuery + "&loa1route=true");
      } else {
        res.render("identity-test-question-loa1", query);
      }
    });

    app.get('/:idp/passport', function(req, res){

      var query = req.query;

      if (query.passport != 'true'){
        res.redirect('/' + req.params.idp + "/driving-licence" + res.locals.formQuery);
      } else if (query.passport == 'true' && query.passport_done == 'true') {
        res.redirect('/' + req.params.idp + "/driving-licence" + res.locals.formQuery)
      } else {
        res.render("passport");
      }
    });

    app.get('/:idp/driving-licence', function(req, res){

      var query = req.query;

      if (query.loa1route == 'true' && query.driving_licence != 'true') {
        res.redirect('/' + req.params.idp + "/verified-loa1" + res.locals.formQuery)
      } else if (query.driving_licence != 'true'){
        res.redirect('/' + req.params.idp + "/passport-non-uk" + res.locals.formQuery);
      } else if (query.driving_licence == 'true' && query.driving_licence_done == 'true') {
        res.redirect('/' + req.params.idp + "/passport-non-uk" + res.locals.formQuery)
      } else {
        res.render("driving-licence");
      }
    });

    app.get('/:idp/passport-non-uk', function(req, res){

      var query = req.query;

      if (query.non_uk_passport != 'true'){
        res.redirect('/' + req.params.idp + "/bank-account" + res.locals.formQuery);
      } else if (query.driving_licence_done == 'true'){
        res.redirect('/' + req.params.idp + "/bank-account" + res.locals.formQuery);
      } else if (query.non_uk_passport == 'true' && query.non_uk_passport_done == 'true') {
        res.redirect('/' + req.params.idp + "/bank-account" + res.locals.formQuery)
      } else {
        res.render("passport-non-uk");
      }
    });


    app.get('/:idp/bank-account', function(req, res){

      var query = req.query;

      if (query.loa1route == 'true') {
        res.redirect('/' + req.params.idp + "/verified-loa1" + res.locals.formQuery)
      } else if (query.bank_account != 'true') {
        res.redirect('/' + req.params.idp + "/card-transaction" + res.locals.formQuery)
      } else if (query.bank_account == 'true' && query.bank_account_done == 'true') {
        res.redirect('/' + req.params.idp + "/card-transaction" + res.locals.formQuery)
      } else if (query.bank_account != 'true'){
        res.redirect('/' + req.params.idp + "/card-transaction" + res.locals.formQuery);
      } else {
        res.render("bank-account");
      }
    });

    app.get('/:idp/card-transaction', function(req, res){

      var query = req.query;

       if (res.locals.serviceLOA == 2 && query.faster_payment_done == "true") {
        res.redirect('/' + req.params.idp + "/identity-test-intro" + res.locals.formQuery);
      } else if (query.credit_card != 'true') {
        res.redirect('/' + req.params.idp + "/identity-test-intro" + res.locals.formQuery);
      } else if (query.bank_account_done == 'true') {
        res.redirect('/' + req.params.idp + "/identity-test-intro" + res.locals.formQuery);
      } else if (query.credit_card == 'true' && query.credit_card_done == 'true') {
        res.redirect('/' + req.params.idp + "/identity-test-intro" + res.locals.formQuery)
      } else {
        res.render("card-transaction");
      }
    });

    app.get('/:idp/mobile-contract-2', function(req, res){

      var query = req.query;

      res.render("mobile-contract-2", query);
    });


    app.get('/:idp/uplift-start', function(req, res){

      var query = req.query;

      res.render('uplift-start', query);

    });

    app.get('/:idp/verified-loa1', function(req, res){

      var query = req.query;

      //force user to fail
      if (query.force_outcome == 'false'){
        res.redirect('/' + req.params.idp + "/failed-loa2" + res.locals.formQuery);
      //
      } else if (query.force_outcome == 'true'){
        res.redirect('/' + req.params.idp + "/verified-loa1" + res.locals.formQuery);
      //
      } else {
        res.render('verified-loa1');
      }
    });


    app.get('/:idp/verified', function(req, res)  {
    var query = req.query;

      if (req.query.verify === "false" && req.query.standalone != 'true' && req.query.third_cycle_done !== "true" ){
        res.redirect('/' + req.params.idp + '/failed-loa2'+ res.locals.formQuery);
        return;
      } else if (req.query.verify === "false" && req.query.standalone == 'true'){
        res.redirect('/' + req.params.idp + '/failed-standalone'+ res.locals.formQuery);
        return;
      } else if (req.query.third_cycle_done === "true" && query.verify === "true"){
        res.redirect('/' + req.params.idp + '/uplift-verified'+ res.locals.formQuery);
        return;
      } else if (req.query.third_cycle_done === "true" && query.verify === "false"){
        res.redirect('/' + req.params.idp + '/uplift-fail'+ res.locals.formQuery);
        return;
      } else {
        res.render('verified');
      }

    });

  }
};

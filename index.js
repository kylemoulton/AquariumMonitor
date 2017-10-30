var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    User            = require("./models/user");

mongoose.connect("mongodb://localhost/aquarium_monitor", {useMongoClient: true});
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "f89heejhshgjuithdkskehghhlislwuehjebjebv",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

var aquariumRoutes      = require("./routes/aquariums");
var readingRoutes       = require("./routes/readings");
var waterChangeRoutes   = require("./routes/waterChanges");
var fishRoutes          = require("./routes/fish");
var plantRoutes         = require("./routes/plants");
var indexRoutes         = require("./routes/index");


app.use("/aquariums", aquariumRoutes);
app.use("/aquariums/:id/readings", readingRoutes);
app.use("/aquariums/:id/water-changes", waterChangeRoutes);
app.use("/aquariums/:id/fish", fishRoutes);
app.use("/aquariums/:id/plants", plantRoutes);
app.use("/", indexRoutes);

app.listen(3000, function() {
    console.log("Server started");
});


/*
RESTful Routes

Index       /items              GET     Lists all items                                         Item.find()
New         /items/new          GET     Shows new item form                                     N/A
Create      /items              POST    Creates new item and redirects somewhere                Item.create()
Show        /items/:id          GET     Show info about one specific items                      Item.findById()
Edit        /items/:id/edit     GET     Show edit form for one item                             Item.findById()
Update      /items/:id          PUT     Update a particular item, then redirect somewhere       Item.findByIdAndUpdate()
Destroy     /items/:id          DELETE  Delete a particular item, then redirect somewhere       Item.findByIdAndRemove()


Comments

New         /items/:id/comments/new     GET
Create      /items/:id/comments         POST

*/

// Default starting date to a date 1 month back or so
// Have ability to expand readings to readings further in the past
// Make it easy to use...
// Add option to add water change - Red dot on line if possible
// Suggest water change - 
// Add water changing schedule
// Alert when parameters beyond a certain point

// Add option to add water change OR notable input on a particular event
// (No heater/filter for specified period of time)
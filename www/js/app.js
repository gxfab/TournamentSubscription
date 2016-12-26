// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('tournament-subscription', ['ionic', 'lokijs']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.factory('TbService', ['$q', 'Loki', TbService]);

function TbService($q, Loki) {  
    var _db;
    var _tournaments;

    function initDB() {          
        var adapter = new LokiCordovaFSAdapter({"prefix": "loki"});  
        _db = new Loki('tournamentsDB',
                {
                    autosave: true,
                    autosaveInterval: 1000, // 1 second
                    adapter: adapter
                });
    };

    return {
        initDB: initDB,
        getAllTbs: getAllTbs,
        //addTb: addTb,
        //updateBirthday: updateBirthday,
        //deleteBirthday: deleteBirthday
    };
};

function getAllTbs() {        

    return $q(function (resolve, reject) {
        var options = {};

        _db.loadDatabase(options, function () {
            _tournaments = _db.getCollection('tournaments');

            if (!_tournaments) {
                _tournaments = _db.addCollection('tournaments');
            }

            resolve(_tournaments.data);
        });
    });
};

var options = {  
    tournaments: {
        proto: Object,
        inflate: function (src, dst) {
            var prop;
            for (prop in src) {
                if (prop === 'date_debut') {
                    dst.date_debut = new Date(src.date_debut);
                } else if (prop === 'date_fin') {
                    dst.date_fin = new Date(src.date_fin);
                } else {
                    dst[prop] = src[prop];
                }
            }
        }
    }
};
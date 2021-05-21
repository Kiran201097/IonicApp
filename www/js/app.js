// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform,$rootScope,$cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.backgroundColorByHexString("#008000");
    }
    $rootScope.db = $cordovaSQLite.openDB({name:"SWAD.db",location:"default"});
    $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS orders (id integer primary key, items text, totalQuantity integer,totalPrice integer,date text)");
    $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS users (id integer primary key, username text, email text,phone integer,password text)");
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.location', {
    url: '/location',
    views: {
      'tab-dash': {
        templateUrl: 'templates/location.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.categories', {
    url: '/categories',
    views: {
      'tab-dash': {
        templateUrl: 'templates/categories.html',
        controller: 'CategoriesCtrl'
      }
    }
  })
  .state('tab.cart', {
    url: '/cart',
    views: {
      'tab-dash': {
        templateUrl: 'templates/cart.html',
        controller: 'CartCtrl'
      }
    }
  })
  .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.orders', {
      url: '/orders',
      views: {
        'tab-orders': {
          templateUrl: 'templates/tab-orders.html',
          controller: 'OrdersCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })
   
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
    
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
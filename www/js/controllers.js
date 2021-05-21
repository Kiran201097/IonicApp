var orders = [];
var OrderHistory = [];
angular.module('starter.controllers', ['ionic', 'ngCordova'])

  .controller('DashCtrl', function ($scope, $rootScope) {
    $rootScope.location1 = "Choose Delivery Location";
    $rootScope.location2 = "Please select a store";
    $scope.showClass1 = "";
    $scope.showClass2 = "dis-none";
    $scope.changeDeco1 = "dis-underline";
    $scope.changeDeco2 = "";

    $scope.getLocation = function () {
      var onSuccess = function (position) {
        console.log('Latitude: ' + position.coords.latitude + '\n' +
          'Longitude: ' + position.coords.longitude
        );
        nativegeocoder.reverseGeocode(success, failure, position.coords.latitude, position.coords.longitude, { useLocale: true, maxResults: 1 });

        function success(result) {
          var firstResult = result[0];
          console.log("First Result: " + firstResult.areasOfInterest[0] + ", " + firstResult.thoroughfare + ", " + firstResult.subLocality + ", " + firstResult.locality + ", " + firstResult.administrativeArea + ", " + firstResult.countryName + ", " + firstResult.postalCode + ".");
          $rootScope.location = firstResult.areasOfInterest[0] + ", " + firstResult.thoroughfare + ", " + firstResult.subLocality + ", " + firstResult.locality + ", " + firstResult.administrativeArea + ", " + firstResult.countryName + ", " + firstResult.postalCode + ".";
        }

        function failure(err) {
          console.log(err);
        }
      };

      // onError Callback receives a PositionError object
      //
      function onError(error) {
        alert('code: ' + error.code + '\n' +
          'message: ' + error.message + '\n');
      }

      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    $scope.changeDecoration1 = function () {
      $scope.showClass1 = "";
      $scope.showClass2 = "dis-none";
      $scope.changeDeco1 = "dis-underline";
      $scope.changeDeco2 = "";
    }
    $scope.changeDecoration2 = function () {
      $scope.showClass1 = "dis-none";
      $scope.showClass2 = "";
      $scope.changeDeco1 = "";
      $scope.changeDeco2 = "dis-underline";
    }

  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })
  .controller('CategoriesCtrl', function ($scope, foodService, $rootScope) {
    console.log("working catego ctrl");
    $scope.value = 1;
    $rootScope.foods = foodService.foods;
    $scope.decrement = function () {
      if ($scope.value > 1) {
        $scope.value = $scope.value - 1;
      }
    }
    $scope.increment = function () {
      $scope.value = $scope.value + 1;
    }
  })
  .controller('CartCtrl', function ($scope, $cordovaSQLite, $rootScope, $state, $ionicPopup) {
    $scope.addToCart = function (id, title, price) {
      //console.log("HI "+$scope.value);

      var order = new Order(id, title, price, $scope.value);
      //console.log(order);
      //console.log(orders);
      for (var i = 0; i < orders.length; i++) {
        if (order.id == orders[i].id) {
          orders[i].quantity = order.quantity;
          return;
        }
      }
      orders.push(order);

      function Order(id, title, price, quantity) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.quantity = quantity;
      }
    }

    $scope.showCart = function () {
      $rootScope.totalQuantity = 0;
      $rootScope.totalPrice = 0;
      console.log(orders.length);
      $rootScope.cartnone = "dis-none";
      if (orders.length == 0) {
        $rootScope.cartnone = "";
        $rootScope.totalQuantity = "";
        $rootScope.totalPrice = "";
      }

      console.log(orders);
      $rootScope.Orders = orders;
      for (var i = 0; i < orders.length; i++) {
        $rootScope.totalQuantity += orders[i].quantity;
        $rootScope.totalPrice += (orders[i].quantity * orders[i].price);
      }
    }

    $scope.delete = function (id) {
      var order = null;
      for (var i = 0; i < orders.length; i++) {
        if (i == orders.length - 1) {
          order = orders[i];
          orders.pop();
          break;
        }
        if (id == orders[i].id) {
          order = orders[i];
          for (var j = i; j < orders.length - 1; j++) {
            orders[j] = orders[j + 1];
          }
          orders.pop();
          break;
        }
      }
      $rootScope.totalQuantity = $rootScope.totalQuantity - order.quantity;
      $rootScope.totalPrice = $rootScope.totalPrice - (order.quantity * order.price);
      $rootScope.Orders = orders;
      if (orders.length == 0) {
        $rootScope.cartnone = "";
        $rootScope.totalQuantity = "";
        $rootScope.totalPrice = "";
      }
    }


    $scope.decrement = function (id) {
      for (var i = 0; i < orders.length; i++) {
        if (id == orders[i].id) {
          if (orders[i].quantity == 1) {
            break;
          }
          orders[i].quantity -= 1;
        }
      }
    }

    $scope.increment = function (id) {

      for (var i = 0; i < orders.length; i++) {
        if (id == orders[i].id) {
          orders[i].quantity += 1;
        }
      }

    }

    $rootScope.class1 = "";
    $rootScope.class2 = "dis-none";
    $rootScope.class3 = "col-50";
    $rootScope.class4 = "";
    $scope.edit = function () {
      $rootScope.class1 = "dis-none";
      $rootScope.class2 = "";
      $rootScope.class3 = "col-33";
      $rootScope.class4 = "col-33";

    }
    $scope.submit = function () {
      $rootScope.class1 = "";
      $rootScope.class2 = "dis-none";
      $rootScope.class3 = "col-50";
      $rootScope.class4 = "";
      $scope.showCart();
    }

    $scope.makePayment = function (payment_id) {
      var alertPopup = $ionicPopup.alert({
        title: 'Payment',
        template: 'Payment Successful id is ' + payment_id
      });

      alertPopup.then(function (res) {
        var query = "INSERT INTO orders (items, totalQuantity,totalPrice,date) VALUES (?,?,?,?)";
        var currentDate = new Date();
        var date = currentDate.getDate() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getFullYear();
        $cordovaSQLite.execute($rootScope.db, query, [JSON.stringify(orders), $rootScope.totalQuantity, $rootScope.totalPrice, date]).then(function (res) {
          console.log("INSERT ID -> " + res.insertId + "  " + res);
          for (var i = orders.length - 1; i >= 0; i--) {
            orders.pop();
          }
          $scope.value = 1;
        }, function (err) {
          console.error(err);
        });

        $state.go('tab.dash');
        $scope.value = 1;
      });
    }

  })
  .controller('OrdersCtrl', function ($scope, $cordovaSQLite, $rootScope) {
    console.log("working order ctrl");
    function order(id, items, quantity, price, date) {
      this.id = id;
      this.items = items;
      this.totalQuantity = quantity;
      this.totalPrice = price;
      this.date = date;
    }



    $scope.selectOrders = function () {
      var query = "SELECT id,items,totalQuantity,totalPrice,date FROM orders";
      $cordovaSQLite.execute($rootScope.db, query).then(function (res) {
        //console.log(res.rows.item(0));
        //console.log(res.rows.length);
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            //console.log(res.rows.item(i));
            var ord = new order(res.rows.item(i).id, JSON.parse(res.rows.item(i).items), res.rows.item(i).totalQuantity, res.rows.item(i).totalPrice, res.rows.item(i).date);
            //console.log(ord);
            OrderHistory.push(ord);
          }
          $scope.orderHistory = OrderHistory;
        } else {
          console.log("No results found");
        }
      }, function (err) {
        console.error(err);
      });
    }
    document.addEventListener("deviceready", check, false);
    function check() {
      //console.log(localStorage.getItem("userdetails"));
      if (localStorage.getItem("userdetails") == null) {
        $rootScope.hide = "";
        $rootScope.show = "dis-none";
        $scope.orderHistory = "";
      }
      else {
        $rootScope.hide = "dis-none";
        $rootScope.show = "";
        $scope.selectOrders();
      }
    }
  })
  .controller('PaymentCtrl', function ($scope, $ionicPlatform) {
    var options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_1DP5mmOlF5G5ag',
      amount: '5000',
      name: 'SWAD',
      prefill: {
        email: 'xyz@razorpay.com',
        contact: '1234567890',
        name: 'xyz abc'
      },
      theme: {
        color: '#008000'
      }
    };

    var called = false

    var successCallback = function (payment_id) {
      //alert('payment_id: ' + payment_id);
      $scope.makePayment(payment_id);
      called = false;
    };

    var cancelCallback = function (error) {
      alert(error.description + ' (Error ' + error.code + ')');
      called = false;
    };

    $ionicPlatform.ready(function () {
      $scope.pay = function () {
        if (!called) {
          RazorpayCheckout.open(options, successCallback, cancelCallback);
          called = true;
        }
      }
    });
  })
  .controller('AccountCtrl', function ($scope, $ionicModal, $ionicPopup, $state, $cordovaSQLite, $rootScope) {

    // ---------------------------Login--------------------------------------
    document.addEventListener("deviceready", check, false);
    function check() {
      //console.log(localStorage.getItem("userdetails"));
      if (localStorage.getItem("userdetails") == null) {
        $rootScope.hide = "";
        $rootScope.show = "dis-none";
      }
      else {
        //console.log(JSON.parse(localStorage.getItem("userdetails")));
        $scope.user = JSON.parse(localStorage.getItem("userdetails"));
        $rootScope.hide = "dis-none";
        $rootScope.show = "";
      }
    }
    $rootScope.loginData = {};
    $rootScope.registerData = {};
    //var userdetails = { "username": "Sam Sharma", "phone": 1234567890, "email": "sam.sharma@gmail.com", "password": "Sam@2021", "imgurl": "img/adam.jpg" };

    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
      $scope.message = "";
    });

    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    $scope.login = function () {
      $scope.modal.show();
    };

    $scope.doLogin = function () {
      console.log('Doing login', $rootScope.loginData);

      var query = "SELECT id,username,email,phone,password FROM users where phone=?";
      $cordovaSQLite.execute($rootScope.db, query, [$rootScope.loginData.phone]).then(function (res) {
        if (res.rows.length > 0) {
          if ($rootScope.loginData.phone == res.rows.item(0).phone && $rootScope.loginData.password == res.rows.item(0).password) {
            console.log(res.rows.item(0));
            localStorage.setItem("userdetails", JSON.stringify(res.rows.item(0)));
            $rootScope.user = res.rows.item(0);
            $scope.closeLogin();
            $rootScope.hide = "dis-none";
            $rootScope.show = "";
            $scope.selectOrders();
            $scope.message = "";

          }
          else {

            $scope.message = "Invalid Phone or Password";
          }
        } else {
          console.log("No results found");
          $scope.message = "Invalid Phone or Password";

        }
      }, function (err) {
        console.error(err);
      });

    };
    $scope.logout = function () {
      localStorage.removeItem("userdetails");
      $rootScope.hide = "";
      $rootScope.show = "dis-none";
      OrderHistory = [];
      $rootScope.loginData = {};
    };


    // -------------------------------Register User-----------------------------
    $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modalr = modal;
      $scope.message = "";
    });

    $scope.closeRegister = function () {
      $scope.modalr.hide();
    };

    $scope.register = function () {
      $scope.message = "";
      $scope.modalr.show();
    };

    $scope.doRegister = function () {
      console.log('Doing Registration', $rootScope.registerData);
      if ($rootScope.registerData.username != null && $rootScope.registerData.email != null && $rootScope.registerData.phone != null && $rootScope.registerData.password != null) {
        console.log($rootScope.registerData);
        $scope.makeEntry();
        //$scope.closeRegister();
      }
      else {
        $scope.message = "All fields are compulsory. ";
      }
    };

    $scope.makeEntry = function () {
      var query = "INSERT INTO users (username,email,phone,password) VALUES (?,?,?,?)";
      $cordovaSQLite.execute($rootScope.db, query, [$rootScope.registerData.username, $rootScope.registerData.email, $rootScope.registerData.phone, $rootScope.registerData.password]).then(function (res) {
        console.log("INSERT ID -> " + res.insertId + "  " + res);
        var alertPopup = $ionicPopup.alert({
          title: 'Register',
          template: 'Registration Successful login to continue. '
        });
        alertPopup.then(function (res) {
          $scope.closeRegister();
          $state.go('tab.account');
        });
      }, function (err) {
        console.error(err);
      });
    }
  })
  .config(['$ionicConfigProvider', function ($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
  }]);

var janusApp = angular.module('janusApp', ['ngRoute', 'ngCookies', 'editableBinding', 'ngMask'])
janusApp.controller('mainController', function($scope, $http, $location, $cookies, $timeout){
//===================
// -- VARIABLES --
//===================
	var path = 'http://localhost:5000/';

//===================
// -- MODAL --
//===================
$scope.openModal = function($event){
    $('#inputModal').css({
	    // top: e.clientY, 
	    // left: e.clientX, 
	    // transform: 'scale(0.2, 0.2)'
    });
    $('#inputModal').modal()
}

//===================
// -- REGISTER --
//===================
	$scope.register = function(){
		if($scope.password != $scope.password2){
			$scope.passwordNoMatch = true;
			$timeout(function(){
					$scope.passwordNoMatch = false;
			}, 1500);
		}else{
			$http.post(path + 'register_submit', {
				username: $scope.username,
				firstname: $scope.firstName,
				lastname: $scope.lastName,
				email: $scope.email,
				password: $scope.password,
				phone: $scope.phone
			}).then(function successCallback(response){
				if(response.data == 'reg successful'){
					$scope.regSuccessful = true;
					$scope.login();
					console.log('i did ittttt')
				}
				else if(response.data = 'username taken'){
					$scope.loggedIn = false;
					$scope.usernameTaken = true;
					$timeout(function(){
						$scope.usernameTaken = false;
				}, 1500);
				}
			})
		}	
	}
//===================
// -- LOGIN --
//===================
	$scope.login = function(){
		$http.post(path + 'login_submit', {
			username: $scope.username,
			password: $scope.password
		}).then(function successCallback(response){
			console.log(response.data);
			if(response.data == 'no match'){
				$scope.loggedIn = false;
				$scope.badUser = true;
				$timeout(function(){
					$scope.badUser = false;
			}, 1500);
			}
			else if(response.data == 'login successful'){
				$scope.loggedIn = true;
				$scope.signedInAs = $scope.username;
				$cookies.put('username', $scope.username);
				$timeout(function(){
					$('.dropdown.open .dropdown-toggle').dropdown('toggle');
				}, 2000);
				$location.path('/dash');
			}
		})
	}
//===================
// -- LOGOUT --
//===================
	$scope.logout = function(){
		$cookies.remove('username');
		$scope.signedInAs = null;
		$scope.loggedIn = false;
	}


//===================
// -- SUBMIT NEW NOTE --
//===================
	$scope.submitNewNote = function(){
		console.log($scope.username)
		var notes = {
			title: $scope.noteTitle,
			contents: $scope.noteContent,
			username: $scope.username
		}
		console.log(notes);
		//Getting 404 error in the post here - let's work on this
		$http.post('http://localhost:5000/new_note', notes)
			.then(function successCallback(response){
			if(response.data == 'new note saved!'){
				console.log('note saved!');
			}
		})	
	}

})

janusApp.config(function($routeProvider){
	$routeProvider.when('/dash', {
		templateUrl: '/static/partials/dash.html',
		controller: 'mainController'
	})
})
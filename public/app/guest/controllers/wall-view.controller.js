guest
	.controller('wallViewController', ['$scope', '$mdMedia', '$mdDialog', '$mdSidenav', '$mdToast', 'Helper', function($scope, $mdMedia, $mdDialog, $mdSidenav, $mdToast, Helper){
		$scope.toggleSidenav = function(menuID){
			$mdSidenav(menuID).toggle();
		}

		$scope.menu = {};

		Helper.get('/link')
			.success(function(data){
				$scope.menu.static = data;
			})
	}]);
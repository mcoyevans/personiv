app
	.controller('homeToolbarController', ['$scope', 'Helper', function($scope, Helper){
		$scope.toolbar.childState = 'Home';

		$scope.toolbar.hideSearchIcon = true;
	}]);
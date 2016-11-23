app
	.controller('slideshowToolbarController', ['$scope', '$stateParams', 'Helper', function($scope, $stateParams, Helper){
		$scope.toolbar.parentState = 'Slideshow';

		if(!$stateParams.slideshowID)
		{
			$scope.toolbar.childState = 'New';
		}
		else{
			$scope.toolbar.childState = 'Edit';
		}

		$scope.toolbar.hideSearchIcon = true;
	}]);
app
	.controller('postsContentContainerController', ['$scope', function($scope){
		$scope.$emit('closeSidenav');
		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
	}]);
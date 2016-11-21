guest
	.controller('homeContentContainerController', ['$scope', 'Helper', function($scope, Helper){
		$scope.$emit('closeSidenav');

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.init = function(){
			var query = {};

			query.with = [
				{
					'relation': 'slides',
					'withTrashed': false,
				}
			]
			query.first = true;

			Helper.post('/slideshow/enlist', query)
				.success(function(data){
					$scope.slideshow = data;
				});
		}();
	}]);
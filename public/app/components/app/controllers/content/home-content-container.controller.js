app
	.controller('homeContentContainerController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		$scope.$emit('closeSidenav');

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-presentation';
		$scope.fab.label = 'New';

		$scope.fab.action = function(){
			$state.go('main.slideshow', {'slideshowID': null});
		}

		$scope.init = function(){
			var query = {};

			query.with = [
				{
					'relation': 'slides',
					'withTrashed': false,
				}
			]
			query.first = true;

			Helper.post('/user/check')
				.success(function(data){
					angular.forEach(data.roles, function(role){
						if(role.name == 'slideshow')
						{
							data.can_post = true;
							$scope.fab.show = true;
						}
					});

					$scope.current_user = data;
				});

			Helper.post('/slideshow/enlist', query)
				.success(function(data){
					$scope.slideshow = data;
				});
		}();
	}]);
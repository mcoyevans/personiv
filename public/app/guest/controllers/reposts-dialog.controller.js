guest
	.controller('repostsDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.cancel = function(){
			Helper.cancel();
		}

		var post = Helper.fetch();

		var query = {};

		query.with = [
			{
				'relation': 'post',
				'withTrashed': false,
			}
		];

		query.where = [
			{
				'label': 'post_id',
				'condition' : '=',
				'value': post.id
			}
		];

		query.orderBy = [
			{
				'column':'created_at',
				'order':'desc',
			},
		];

		query.paginate = 10;

		$scope.repost = {};
		$scope.repost.items = [];
		$scope.repost.page = 2;

		var pushItem = function(data){
			data.created_at = new Date(data.created_at);
		}

		Helper.post('/repost/enlist', query)
			.success(function(data){
				$scope.repost.details = data;
				$scope.repost.items = data.data;
				$scope.repost.show = true;

				if(data.data.length){
					angular.forEach(data.data, function(item){
						pushItem(item);
					})
				}

				$scope.repost.paginateLoad = function(){
					// kills the function if ajax is busy or pagination reaches last page
					if($scope.repost.busy || ($scope.repost.page > $scope.repost.details.last_page)){
						$scope.isLoading = false;
						return;
					}
					/**
					 * Executes pagination call
					 *
					*/
					// sets to true to disable pagination call if still busy.
					$scope.repost.busy = true;
					$scope.isLoading = true;
					// Calls the next page of pagination.
					Helper.post('/repost/enlist' + '?page=' + $scope.repost.page, query)
						.success(function(data){
							// increment the page to set up next page for next AJAX Call
							$scope.repost.page++;

							// iterate over each data then splice it to the data array
							angular.forEach(data.data, function(item, key){
								pushItem(item);
								$scope.repost.items.push(item);
							});

							// Enables again the pagination call for next call.
							$scope.repost.busy = false;
							$scope.isLoading = false;
						});
				}
			});
	}]);
var guest = angular.module('guest', ['shared']);
guest
	.config(['$stateProvider', function($stateProvider){
		$stateProvider
			.state('wall', {
				url: '/',
				views: {
					'': {
						templateUrl: '/app/guest/views/guest.view.html',
						controller: 'wallViewController',
					},
					'content-container@wall': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'wallContentContainerController',
					},
					'toolbar@wall': {
						templateUrl: '/app/guest/templates/toolbar.template.html',
					},
					'content@wall':{
						templateUrl: '/app/components/posts/templates/content/posts.template.html',
					}
				}
			})
	}]);
guest
	.controller('wallContentContainerController', ['$scope', 'Helper', function($scope, Helper){
		$scope.$emit('closeSidenav');

		$scope.fetchComments = function(post){
			if(!post.comments)
			{
				var query= {};

				query.where = [
					{
						'label':'post_id',
						'condition': '=',
						'value': post.id
					}
				];

				query.with = [
					{
						'relation':'user',
						'withTrashed':true,
					}
				]
				query.paginate = 10;

				Helper.post('/comment/enlist', query)
					.success(function(data){
						post.comments = data.data;
					})
			}
		}

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.request.search = $scope.toolbar.searchText;
			$scope.refresh();
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			data.created_at = new Date(data.created_at);
			data.chips = [];

			angular.forEach(data.hashtags, function(hashtag){
				data.chips.push(hashtag.tag);
			});
			
			var item = {};

			item.display = data.name;

			$scope.toolbar.items.push(item);
		}

		$scope.init = function(query){
			$scope.post = {};
			$scope.post.items = [];
			$scope.toolbar.items = [];
			$scope.currentTime = Date.now();

			// 2 is default so the next page to be loaded will be page 2 
			$scope.post.page = 2;

			Helper.post('/post/enlist', query)
				.success(function(data){
					$scope.post.details = data;
					$scope.post.items = data.data;
					$scope.post.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.post.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.post.busy || ($scope.post.page > $scope.post.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.post.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post('/post/enlist' + '?page=' + $scope.post.page, query)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.post.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.post.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.post.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.post.show = false;

  			$scope.init($scope.request);
		};

		$scope.request = {};

		$scope.request.withTrashed = false;
		$scope.request.paginate = 10;

		$scope.request.with = [
			{
				'relation':'user',
				'withTrashed': false,
			},
			{
				'relation':'hashtags',
				'withTrashed': false,	
			},
		];
		
		$scope.request.withCount = [
			{
				'relation':'comments',
				'withTrashed': false,
			}
		]

		$scope.request.whereNull = ['group_id'];

		$scope.request.orderBy = [
			{
				'column':'pinned',
				'order':'desc',
			},
			{
				'column':'created_at',
				'order':'desc',
			},	
		]

		$scope.isLoading = true;
		$scope.$broadcast('close');

		$scope.init($scope.request);
	}]);
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
//# sourceMappingURL=guest.js.map

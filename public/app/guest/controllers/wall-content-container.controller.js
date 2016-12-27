guest
	.controller('wallContentContainerController', ['$scope', '$stateParams', '$state', 'Helper', function($scope, $stateParams, $state, Helper){
		$scope.$emit('closeSidenav');

		$scope.today = new Date();

		$scope.viewReposts = function(post){
			var dialog = {
				'template':'/app/components/posts/templates/dialogs/reposts-dialog.template.html',
				'controller': 'repostsDialogController',
			}

			Helper.set(post);

			Helper.customDialog(dialog);
		}

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
						post.comment_details = data;

						post.comments = [];

						angular.forEach(data.data, function(item){
							item.created_at = new Date(item.created_at);
							item.updated_at = new Date(item.updated_at);
							post.comments.unshift(item);
						});
					})
			}
		}

		$scope.previousComments = function(post)
		{
			var next_page = post.comment_details.current_page + 1;
			
			if(next_page <= post.comment_details.last_page)
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

				Helper.post('/comment/enlist?page=' + next_page, query)
					.success(function(data){
						post.comment_details = data;

						angular.forEach(data.data, function(item){
							item.created_at = new Date(item.created_at);
							item.updated_at = new Date(item.updated_at);
							post.comments.unshift(item);
						});
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

			if(data.repost_id)
			{
				data.repost.post.created_at = new Date(data.repost.post.created_at);

				data.repost.post.chips = [];

				angular.forEach(data.repost.post.hashtags, function(hashtag){
					data.repost.post.chips.push(hashtag.tag);
				});
			}
			
			data.chips = [];

			angular.forEach(data.hashtags, function(hashtag){
				data.chips.push(hashtag.tag);
			});
			
			var item = {};

			item.display = data.title;

			$scope.toolbar.items.push(item);
		}

		$scope.searchHashTag = function(chip){
			$scope.toolbar.searchText = chip;
			$scope.$broadcast('open');
		}

		$scope.init = function(query){
			$scope.post = {};
			$scope.post.items = [];
			$scope.toolbar.items = [];
			$scope.currentTime = Date.now();

			var birthday_query = {
				'whereMonth': 
				{
					'label': 'birthdate',
					'value' : new Date().getMonth() + 1,
				},
				'whereDay': 
				{
					'label': 'birthdate',
					'value' : new Date().getDate(),
				},
			}

			Helper.post('/birthday/enlist', birthday_query)
				.success(function(data){
					$scope.birthdays = data;
				})

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
			if(!$stateParams.postID)
			{
				$scope.isLoading = true;
	  			$scope.post.show = false;
	  			$scope.currentTime = Date.now();
				$scope.request.where = null;

	  			$scope.init($scope.request);
			}
			else{
	  			$state.go('main.posts', {'postID':null});
			}
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
			{
				'relation':'repost.post',
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
				'column':'created_at',
				'order':'desc',
			},	
		]

		if($stateParams.postID)
		{		
			$scope.request.where = [
				{
					'label': 'id',
					'condition': '=',
					'value': $stateParams.postID,
				}
			];
		}

		$scope.isLoading = true;
		$scope.$broadcast('close');

		$scope.init($scope.request);
	}]);
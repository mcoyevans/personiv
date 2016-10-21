app
	.controller('postsContentContainerController', ['$scope', 'Helper', function($scope, Helper){
		$scope.$emit('closeSidenav');

		$scope.commentSection = function(post){
		    angular.element('#comment-' + post.id).trigger('focus');
		    angular.element('#submit-' + post.id).addClass('primary');
		};

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

		$scope.submit = function(post)
		{
			console.log(post);
		}
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
		$scope.fab.icon = 'mdi-message-text';

		$scope.fab.label = 'Post';

		$scope.fab.action = function(){
			var dialog = {
				'template':'/app/components/posts/templates/dialogs/post-dialog.template.html',
				'controller': 'postDialogController',
			}

			dialog.action = 'create';

			Helper.set(dialog);

			Helper.customDialog(dialog)
				.then(function(){
					Helper.notify('Post created.');
					$scope.refresh();
				}, function(){
					return;
				});
		}

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

		$scope.updatePost = function(data){
			var dialog = {
				'template':'/app/components/posts/templates/dialogs/post-dialog.template.html',
				'controller': 'postDialogController',
			}

			data.action = 'edit';

			Helper.set(data);

			Helper.customDialog(dialog)
				.then(function(){
					$scope.refresh();
					Helper.notify('Post updated.');
				}, function(){
					return;
				});
		}

		$scope.deletePost = function(data){
			var dialog = {};
			dialog.title = 'Delete';
			dialog.message = 'Delete this post?'
			dialog.ok = 'Delete';
			dialog.cancel = 'Cancel';

			Helper.confirm(dialog)
				.then(function(){
					Helper.delete('/post/' + data.id)
						.success(function(){
							$scope.refresh();
							Helper.notify('Post deleted.');
						})
						.error(function(){
							Helper.error();
						});
				}, function(){
					return;
				})
		}

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

			// 2 is default so the next page to be loaded will be page 2 
			$scope.post.page = 2;

			Helper.post('/post/enlist', query)
				.success(function(data){
					$scope.post.details = data;
					$scope.post.items = data.data;
					$scope.post.show = true;

					$scope.fab.show = true;

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
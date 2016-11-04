app
	.controller('postsContentContainerController', ['$scope', 'Helper', function($scope, Helper){
		$scope.$emit('closeSidenav');

		Helper.post('/user/check')
			.success(function(data){
				angular.forEach(data.roles, function(role){
					if(role.name == 'posts')
					{
						data.can_post = true;
					}
				});

				$scope.current_user = data;
			});

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

		$scope.repost = function(post){
			if(!post.repost_id)
			{			
				var dialog = {
					'template':'/app/components/posts/templates/dialogs/repost-dialog.template.html',
					'controller': 'repostDialogController',
				}

				post.action = 'create';

				Helper.set(post);

				Helper.customDialog(dialog)
					.then(function(){
						Helper.notify('Repost successful.');
						$scope.refresh();
					}, function(){
						return;
					});
			}
			else{
				var dialog = {
					'template':'/app/components/posts/templates/dialogs/repost-dialog.template.html',
					'controller': 'repostDialogController',
				}

				post.repost.post.action = 'create';

				Helper.set(post.repost.post);

				Helper.customDialog(dialog)
					.then(function(){
						Helper.notify('Repost successful.');
						$scope.refresh();
					}, function(){
						return;
					});
			}
		}

		$scope.commentSection = function(post){
		    angular.element('#comment-' + post.id).trigger('focus');
		    $scope.fetchComments(post);
		};

		$scope.submit = function(post)
		{
			$scope.busy = true;
			if(post.new_comment)
			{
				$scope.fetchComments(post);

				Helper.post('/comment', post)
					.success(function(data){
						post.error = false;
						data.created_at = new Date(data.created_at);
						post.comments_count += 1;
						post.comments.push(data);
						post.new_comment = null;

						$scope.busy = false;
					})
					.error(function(){
						$scope.busy = false;
						post.error = true;
					})
			}
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

		$scope.$on('read-post', function(){
			$scope.request.where = [
				{
					'label':'id',
					'condition':'=',
					'value': Helper.fetch()
				}
			];

			$scope.isLoading = true;
  			$scope.post.show = false;
  			$scope.currentTime = Date.now();

			$scope.init($scope.request);
		});

		$scope.$on('read-post-and-comments', function(){
			$scope.request.where = [
				{
					'label':'id',
					'condition':'=',
					'value': Helper.fetch()
				}
			];

			$scope.isLoading = true;
  			$scope.post.show = false;
  			$scope.currentTime = Date.now();

			$scope.init($scope.request, true);
		});

		$scope.updatePost = function(data){
			if(!data.repost_id)
			{			
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
			else{
				var dialog = {
					'template':'/app/components/posts/templates/dialogs/repost-dialog.template.html',
					'controller': 'repostDialogController',
				}

				data.action = 'edit';

				Helper.set(data);

				Helper.customDialog(dialog)
					.then(function(){
						Helper.notify('Repost updated.');
						$scope.refresh();
					}, function(){
						return;
					});
			}
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

		$scope.editComment = function(comment, post){
			angular.forEach(post.comments, function(item){
				item.edit = false;
			});

			comment.edit = true;

			comment.new_message = comment.message;
		}

		$scope.updateComment = function(comment){
			$scope.busy = true;

			Helper.put('/comment/' + comment.id, comment)
				.success(function(data){
					data.updated_at = new Date(data.updated_at);
					comment.message = data.message;
					comment.error = false;
					comment.edit = false;
					
					$scope.busy = false;

					Helper.notify('Comment updated.');
				})
				.error(function(){
					$scope.busy = false;
					comment.error = true;
				});			
		}

		$scope.deleteComment = function(comment, post){
			var dialog = {};
			dialog.title = 'Delete';
			dialog.message = 'Delete this comment?'
			dialog.ok = 'Delete';
			dialog.cancel = 'Cancel';

			Helper.confirm(dialog)
				.then(function(){
					Helper.delete('/comment/' + comment.id)
						.success(function(){
							var index = post.comments.indexOf(comment);

							post.comments.splice(index, 1);
							post.comments_count--;

							Helper.notify('Comment deleted.');
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

		$scope.init = function(query, withComments){
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

					$scope.fab.show = $scope.user.can_post ? true : false;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);

							if(withComments){
								$scope.fetchComments(item);
							}
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
  			$scope.currentTime = Date.now();
			$scope.request.where = null;

  			$scope.init($scope.request);
		};

		$scope.request = {};

		$scope.request.withTrashed = false;
		$scope.request.paginate = 10;

		$scope.request.with = [
			{
				'relation':'user',
				'withTrashed': true,
			},
			{
				'relation':'hashtags',
				'withTrashed': false,	
			},
			{
				'relation':'group',
				'withTrashed': true,	
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
			},
			{
				'relation':'reposts',
				'withTrashed': false,
			}			
		]	

		$scope.request.orderBy = [
			{
				'column':'pinned',
				'order':'desc',
			},
			{
				'column':'updated_at',
				'order':'desc',
			},
		]

		$scope.isLoading = true;
		$scope.$broadcast('close');

		$scope.init($scope.request);
	}]);
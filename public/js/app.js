var app = angular.module('app', ['shared']);
app
	.config(['$stateProvider', function($stateProvider){
		$stateProvider
			.state('main', {
				url: '/',
				views: {
					'': {
						templateUrl: '/app/shared/views/main.view.html',
						controller: 'mainViewController',
					},
					'content-container@main': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'postsContentContainerController',
					},
					'toolbar@main': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'postsToolbarController',
					},
					'left-sidenav@main': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main':{
						templateUrl: '/app/components/posts/templates/content/posts.template.html',
					}
				}
			})
			.state('main.approvals', {
				url: 'approvals/{reservationID}',
				params: {'reservationID':null},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'approvalsContentContainerController',
					},
					'toolbar@main.approvals': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'approvalsToolbarController',
					},
					'subheader@main.approvals': {
						templateUrl: '/app/components/reservations/templates/subheaders/reservations-subheader.template.html',
						controller: 'approvalsSubheaderController',
					},
					'left-sidenav@main.approvals': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.approvals':{
						templateUrl: '/app/components/approvals/templates/content/approvals-content.template.html',
					}
				}
			})
			.state('main.reservations', {
				url: 'reservations',
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'reservationsContentContainerController',
					},
					'toolbar@main.reservations': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'reservationsToolbarController',
					},
					'subheader@main.reservations': {
						templateUrl: '/app/components/reservations/templates/subheaders/reservations-subheader.template.html',
						controller: 'reservationsSubheaderController',
					},
					'left-sidenav@main.reservations': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.reservations':{
						templateUrl: '/app/components/reservations/templates/content/reservations-content.template.html',
					}
				}
			})
			.state('main.equipment', {
				url: 'settings/equipment',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/equipment/create')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'equipmentContentContainerController',
					},
					'toolbar@main.equipment': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'equipmentToolbarController',
					},
					'subheader@main.equipment': {
						templateUrl: '/app/components/settings/templates/subheaders/equipment-subheader.template.html',
						controller: 'equipmentSubheaderController',
					},
					'left-sidenav@main.equipment': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.equipment':{
						templateUrl: '/app/components/settings/templates/content/settings-content.template.html',
					}
				}
			})
			.state('main.groups', {
				url: 'settings/groups',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/group/create')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'groupsContentContainerController',
					},
					'toolbar@main.groups': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'groupsToolbarController',
					},
					'left-sidenav@main.groups': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.groups':{
						templateUrl: '/app/components/settings/templates/content/settings-content.template.html',
					}
				}
			})
			.state('main.links', {
				url: 'settings/links',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/link/create')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'linksContentContainerController',
					},
					'toolbar@main.links': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'linksToolbarController',
					},
					'left-sidenav@main.links': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.links':{
						templateUrl: '/app/components/settings/templates/content/settings-content.template.html',
					}
				}
			})
			.state('main.locations', {
				url: 'settings/locations',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/location/create')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'locationsContentContainerController',
					},
					'toolbar@main.locations': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'locationsToolbarController',
					},
					'left-sidenav@main.locations': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.locations':{
						templateUrl: '/app/components/settings/templates/content/settings-content.template.html',
					}
				}
			})
			.state('main.users', {
				url: 'settings/users',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/user/create')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'usersContentContainerController',
					},
					'toolbar@main.users': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'usersToolbarController',
					},
					'left-sidenav@main.users': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.users':{
						templateUrl: '/app/components/settings/templates/content/settings-content.template.html',
					}
				}
			})
			.state('main.notifications', {
				url: 'notifications',
				views: {
					'content-container':{
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'notificationsContentContainerController',
					},
					'toolbar@main.notifications': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'notificationsToolbarController',
					},
					'left-sidenav@main.notifications': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.notifications':{
						templateUrl: '/app/components/notifications/templates/content/notifications-content.template.html',
					},
				}
			})
	}]);
app
	.controller('mainViewController', ['$scope', '$filter', '$state', '$mdDialog', '$mdSidenav', '$mdToast', 'Helper', 'FileUploader', function($scope, $filter, $state, $mdDialog, $mdSidenav, $mdToast, Helper, FileUploader){
		$scope.toggleSidenav = function(menuID){
			$mdSidenav(menuID).toggle();
		}

		$scope.menu = {};
		$scope.menu.pages = [];

		$scope.menu.static = [
			{
				'state': 'main',
				'icon': 'mdi-bulletin-board',
				'label': 'Posts',
			},
			{
				'state': 'main.reservations',
				'icon': 'mdi-format-list-numbers',
				'label': 'Reservations',
			},
		];

		$scope.menu.section = [
			{
				'name':'Apps',
				'icon':'mdi-application',
			},
		];

		// set section as active
		$scope.setActive = function(index){
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').toggleClass('active'));
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').siblings().removeClass('active'));
		};
		
		$scope.logout = function(){
			Helper.post('/user/logout')
				.success(function(){
					window.location.href = '/';
				});
		}

		$scope.changePassword = function()
		{
			$mdDialog.show({
		      controller: 'changePasswordDialogController',
		      templateUrl: '/app/shared/templates/dialogs/change-password-dialog.template.html',
		      parent: angular.element(document.body),
		      fullscreen: true,
		    })
		    .then(function(){
		    	Helper.notify('Password changed.')
		    });
		}

		var uploader = {};

		uploader.filter = {
            name: 'photoFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        uploader.sizeFilter = {
		    'name': 'enforceMaxFileSize',
		    'fn': function (item) {
		        return item.size <= 2000000;
		    }
        }

        uploader.error = function(item /*{File|FileLikeObject}*/, filter, options) {
            $scope.fileError = true;
            $scope.photoUploader.queue = [];
        };

        uploader.headers = { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')};

		$scope.clickUpload = function(){
		    angular.element('#upload').trigger('click');
		};

		$scope.markAllAsRead = function(){
			Helper.post('/user/mark-all-as-read')
				.success(function(){
					$scope.user.unread_notifications = [];
				})
		}

		var fetchUnreadNotifications = function(){
			Helper.post('/user/check')
	    		.success(function(data){
	    			$scope.user = data;
	    		});
		}

		Helper.post('/user/check')
			.success(function(data){
				var settings = false;
				var settings_menu = [];

				angular.forEach(data.roles, function(role){
					if(role.name == 'posts')
					{
						data.can_post = true;
					}
					else if(role.name == 'approvals')
					{
						var item = {
							'state': 'main.approvals',
							'icon': 'mdi-clipboard-check',
							'label': 'Approvals',
						}

						$scope.menu.static[2] = item;
					}
					else if(role.name == 'manage-groups')
					{
						settings = true;

						var item = {
							'label': 'Groups',
							action: function(){
								$state.go('main.groups');
							},
						}

						settings_menu.push(item);
					}
					else if(role.name == 'manage-users')
					{
						settings = true;

						var item = {
							'label': 'Users',
							action: function(){
								$state.go('main.users');
							},
						}

						settings_menu.push(item); 
					}
					else if(role.name == 'manage-locations')
					{
						settings = true;

						var item = {
							'label': 'Locations',
							action: function(){
								$state.go('main.locations');
							},
						}

						settings_menu.push(item); 
					}
					else if(role.name == 'manage-equipment')
					{
						settings = true;

						var item = {
							'label': 'Equipment',
							action: function(){
								$state.go('main.equipment');
							},
						}

						settings_menu.push(item); 
					}
					else if(role.name == 'manage-links')
					{
						settings = true;

						var item = {
							'label': 'Links',
							action: function(){
								$state.go('main.links');
							},
						}

						settings_menu.push(item); 
					}

				});

				if(settings)
				{
					$scope.menu.section[1] = {
						'name':'Settings',
						'icon':'mdi-settings',
					}

					$scope.menu.pages[1] = settings_menu;
				}

				$scope.user = data;

				$scope.currentTime = Date.now();

				Helper.setAuthUser(data);

				/* Photo Uploader */
				$scope.photoUploader = new FileUploader({
					url: '/user/upload-avatar/' + $scope.user.id,
					headers: uploader.headers,
					queueLimit : 1
				})

				// FILTERS
		        $scope.photoUploader.filters.push(uploader.filter);
		        $scope.photoUploader.filters.push(uploader.sizeFilter);
		        
				$scope.photoUploader.onWhenAddingFileFailed = uploader.error;
				$scope.photoUploader.onAfterAddingFile  = function(){
					$scope.fileError = false;
					if($scope.photoUploader.queue.length)
					{	
						$scope.photoUploader.uploadAll()
					}
				};

				$scope.photoUploader.onCompleteItem  = function(data, response){
					$scope.currentTime = Date.now();
					$scope.photoUploader.queue = [];
				}

				var pusher = new Pusher('73a46f761ea4637481b5', {
			      	encrypted: true,
			      	auth: {
					    headers: {
					      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
					    }
				  	}
			    });

				var channel = {};

				channel.user = pusher.subscribe('private-App.User.' + $scope.user.id);

				channel.user.bindings = [
				 	channel.user.bind('Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', function(data) {
				 		// formating the notification
				 		data.created_at = data.attachment.created_at;

				 		data.data = {};
				 		data.data.attachment = data.attachment;
				 		data.data.url = data.url;
				 		data.data.withParams = data.withParams;
				 		data.data.sender = data.sender;
				 		data.data.message = data.message;

				 		// pushes the new notification in the unread_notifications array
				 		$scope.$apply(function(){
					    	$scope.user.unread_notifications.unshift(data);
				 		});

				 		// notify the user with a toast message
				 		Helper.notify(data.sender.name + ' ' + data.message);
				    }),
				];
			})

		$scope.markAsRead = function(notification){
			Helper.post('/user/mark-as-read', notification)
				.success(function(){
					var index = $scope.user.unread_notifications.indexOf(notification);

					$scope.user.unread_notifications.splice(index, 1);
				})
				.error(function(){
					Helper.error();
				});
		}

		$scope.read = function(notification){
			if(notification.data.withParams)
			{
				$state.go(notification.data.url, {'id':notification.data.attachment.id});
			}
			else{
				$state.go(notification.data.url);
				
				if(notification.type == 'App\\Notifications\\PostCreated' || notification.type == 'App\\Notifications\\RepostCreated')
				{	
					Helper.set(notification.data.attachment.id);
					$scope.$broadcast('read-post');
				}
				else if(notification.type == 'App\\Notifications\\CommentCreated')
				{
					Helper.set(notification.data.attachment.post_id);
					$scope.$broadcast('read-post-and-comments');
				}
				else if(notification.type == 'App\\Notifications\\ReservationCreated')
				{
					$state.go(notification.data.url, {'reservationID':notification.data.attachment.id});
					// Helper.set(notification.data.attachment.id);
					// $scope.$broadcast('read-approval');
				}
			}

			$scope.markAsRead(notification);
		}


		$scope.fetchLinks = function(){		
			Helper.get('/link')
				.success(function(data){
					var links = [];

					angular.forEach(data, function(link){
						var item = {};

						item.label = link.name;	
						item.action = function(){
							window.open(link.link);
						}

						links.push(item);
					});
					
					$scope.menu.pages[0] = links;
				})
		}

		$scope.fetchLinks();

		$scope.$on('closeSidenav', function(){
			$mdSidenav('left').close();
		});

		$scope.$on('fetchLinks', function(){
			$scope.fetchLinks();
		});
	}]);
app
	.controller('postsContentContainerController', ['$scope', 'Helper', function($scope, Helper){
		$scope.$emit('closeSidenav');

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

			Helper.post('/user/check')
				.success(function(data){
					angular.forEach(data.roles, function(role){
						if(role.name == 'posts')
						{
							data.can_post = true;
						}
					});

					$scope.current_user = data;

					Helper.post('/post/enlist', query)
						.success(function(data){
							$scope.post.details = data;
							$scope.post.items = data.data;
							$scope.post.show = true;

							$scope.fab.show = $scope.current_user.can_post ? true : false;

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
app
	.controller('reservationsContentContainerController', ['$scope', '$compile', 'Helper', 'uiCalendarConfig', function($scope, $compile, Helper, uiCalendarConfig){
		$scope.$emit('closeSidenav');

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		/*
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.show = true;
		$scope.subheader.current = {};
		
		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Reservation';

		$scope.fab.action = function(){
			Helper.set($scope.subheader.current.fab);

			Helper.customDialog($scope.subheader.current.fab)
				.then(function(){
					Helper.notify('Reservation created.');
					$scope.refresh();
				}, function(){
					return;
				});
		}

	    $scope.viewReservation = function(data){
	    	Helper.set(data);

	    	var dialog = {
	    		'template':'/app/components/reservations/templates/dialogs/approved-reservation-dialog.template.html',
				'controller': 'approvedReservationDialogController',
	    	}

	    	Helper.customDialog(dialog);
	    }

	    $scope.editReservation = function(data){
	    	data.action = 'edit';

	    	Helper.set(data);

	    	var dialog = {
	    		'template':'/app/components/reservations/templates/dialogs/reservation-dialog.template.html',
				'controller': 'reservationDialogController',
	    	}

			Helper.customDialog(dialog)
				.then(function(){
					Helper.notify('Reservation updated.');
					$scope.refresh();
				}, function(){
					return;
				});
	    }

	    $scope.deleteReservation = function(data){
	    	var dialog = {};
			dialog.title = 'Delete';
			dialog.message = 'Delete this reservation?'
			dialog.ok = 'Delete';
			dialog.cancel = 'Cancel';

			Helper.confirm(dialog)
				.then(function(){
					Helper.delete('/reservation/' + data.id)
						.success(function(){
							$scope.refresh();
							Helper.notify('Reservation deleted.');
						})
						.error(function(){
							Helper.error();
						});
				}, function(){
					return;
				})
	    }

		/*
		 *
		 * Object for calendar
		*/
		$scope.uiConfig = {
		    calendar: {
		    	height: 500,
		        editable: false,
		        header:{
		          	left: 'title',
		          	center: '',
		          	right: 'today prev,next'
		        },
		        eventClick: $scope.viewReservation,
		        eventDrop: $scope.alertOnDrop,
		        eventResize: $scope.alertOnResize,
		        viewRender: function(date) {
		            $scope.dateRange = {};

		            $scope.dateRange.start = new Date(date.start._d).toDateString();
		            $scope.dateRange.end = new Date(date.end._d).toDateString();

		            Helper.set($scope.dateRange);

		            $scope.$broadcast('dateRange');

		            $scope.init($scope.subheader.current);
		        }
		    }
	    };


	    $scope.eventSources = [];

	    $scope.changeView = function(view){
	    	uiCalendarConfig.calendars.reservationCalendar.fullCalendar('changeView', view);
	    }

	    $scope.calendarType = 'month';

		/* Action originates from subheader */
		$scope.$on('setInit', function(){
			$scope.isLoading = true;
			$scope.$broadcast('close');
			
			var current = Helper.fetch();

			$scope.subheader.current = current;
			$scope.init(current);
		});

		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.subheader.current.request.search = $scope.toolbar.searchText;
			$scope.refresh();
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.subheader.current.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			data.deleted_at =  data.deleted_at ? new Date(data.deleted_at) : null;
			data.created_at = new Date(data.created_at);
			data.start = new Date(data.start);
			data.end = new Date(data.end);

			var item = {};

			item.display = data.title;
			
			$scope.toolbar.items.push(item);
		}

		$scope.init = function(query){
			$scope.reservation = {};
			$scope.toolbar.items = [];

			Helper.post('/user/check')
				.success(function(data){
					angular.forEach(data.roles, function(role){
						if(role.name == 'reservations')
						{
							data.can_reserve = true;
						}
					});

					$scope.current_user = data;

					Helper.post('/reservation/enlist', query.request)
						.success(function(data){
							$scope.eventSources.splice(0,1);

							$scope.reservation.approved = [];
							$scope.reservation.pending = [];

							if(data.length){
								// iterate over each record and set the format
								angular.forEach(data, function(item){
									pushItem(item);

									if(item.schedule_approver_id && item.equipment_approver_id)
									{
										$scope.reservation.approved.push(item);
									}
									else{
										$scope.reservation.pending.push(item);
									}
								});

								$scope.eventSources.push($scope.reservation.approved);
							
								$scope.fab.show = $scope.current_user.can_reserve ? true : false;
							}

							$scope.refresh = function(){
								$scope.isLoading = true;

								Helper.set($scope.dateRange);

					            $scope.$broadcast('dateRange');

					  			$scope.init($scope.subheader.current);
							};
						});
				});
		}
	}]);
app
	.controller('equipmentContentContainerController', ['$scope', 'Helper', function($scope, Helper){
		$scope.$emit('closeSidenav');

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}
		$scope.toolbar.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		/*
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.show = true;

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';

		/* Action originates from subheader */
		$scope.$on('setInit', function(){
			var current = Helper.fetch();

			$scope.subheader.current = current;
			$scope.isLoading = true;
			$scope.init(current);
			$scope.$broadcast('close');
			$scope.showInactive = false;
		});

		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.subheader.current.request.search = $scope.toolbar.searchText;
			$scope.refresh();
			$scope.showInactive = true;
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.subheader.current.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		$scope.updateModel = function(data){
			var dialog = {
				'template':'/app/components/settings/templates/dialogs/equipment-dialog.template.html',
				'controller': 'equipmentDialogController',
			}

			data.action = 'edit';

			Helper.set(data);

			Helper.customDialog(dialog)
				.then(function(){
					$scope.refresh();
					Helper.notify('Equipment updated.');
				}, function(){
					return;
				});
		}

		$scope.deleteModel = function(data){
			var dialog = {};
			dialog.title = 'Delete';
			dialog.message = 'Delete ' + data.asset_tag + '?'
			dialog.ok = 'Delete';
			dialog.cancel = 'Cancel';

			Helper.confirm(dialog)
				.then(function(){
					Helper.delete('/equipment/' + data.id)
						.success(function(){
							$scope.refresh();
							Helper.notify('Equipment deleted.');
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
			data.deleted_at =  data.deleted_at ? new Date(data.deleted_at) : null;

			var item = {};

			item.display = data.asset_tag;
			item.brand = data.brand;
			item.model = data.model;

			$scope.toolbar.items.push(item);
		}

		$scope.init = function(query, refresh){
			$scope.model = {};
			$scope.model.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.model.page = 2;

			Helper.post('/equipment/enlist', query.request)
				.success(function(data){
					$scope.model.details = data;
					$scope.model.items = data.data;
					$scope.model.show = true;

					$scope.fab.label = query.label;
					$scope.fab.action = function(){
						Helper.set(query.fab);

						Helper.customDialog(query.fab)
							.then(function(){
								Helper.notify(query.fab.message);
								$scope.refresh();
							}, function(){
								return;
							});
					}
					$scope.fab.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.model.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.model.busy || ($scope.model.page > $scope.model.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.model.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post('/equipment/enlist' + '?page=' + $scope.model.page, query.request)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.model.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.model.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.model.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.model.show = false;

  			$scope.init($scope.subheader.current);
		};
	}]);
app
	.controller('groupsContentContainerController', ['$scope', 'Helper', function($scope, Helper){
		$scope.$emit('closeSidenav');
		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}
		$scope.toolbar.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';

		$scope.fab.label = 'Groups';

		$scope.fab.action = function(){
			var dialog = {
				'template':'/app/components/settings/templates/dialogs/group-dialog.template.html',
				'controller': 'groupDialogController',
			}

			dialog.action = 'create';

			Helper.set(dialog);

			Helper.customDialog(dialog)
				.then(function(){
					Helper.notify('Group created.');
					$scope.refresh();
				}, function(){
					return;
				});
		}


		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.showInactive = true;
			$scope.request.search = $scope.toolbar.searchText;
			$scope.refresh();
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		$scope.updateModel = function(data){
			var dialog = {
				'template':'/app/components/settings/templates/dialogs/group-dialog.template.html',
				'controller': 'groupDialogController',
			}

			data.action = 'edit';

			Helper.set(data);

			Helper.customDialog(dialog)
				.then(function(){
					$scope.refresh();
					Helper.notify('Group updated.');
				}, function(){
					return;
				});
		}

		$scope.deleteModel = function(data){
			var dialog = {};
			dialog.title = 'Delete';
			dialog.message = 'Delete ' + data.name + '?'
			dialog.ok = 'Delete';
			dialog.cancel = 'Cancel';

			Helper.confirm(dialog)
				.then(function(){
					Helper.delete('/group/' + data.id)
						.success(function(){
							$scope.refresh();
							Helper.notify('Group deleted.');
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
			data.deleted_at =  data.deleted_at ? new Date(data.deleted_at) : null;

			if(data.users_count)
			{
				data.hideDelete = true;
			}

			var item = {};

			item.display = data.name;

			$scope.toolbar.items.push(item);
		}

		$scope.init = function(query){
			$scope.model = {};
			$scope.model.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.model.page = 2;

			Helper.post('/group/enlist', query)
				.success(function(data){
					$scope.model.details = data;
					$scope.model.items = data.data;
					$scope.model.show = true;

					$scope.fab.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.model.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.model.busy || ($scope.model.page > $scope.model.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.model.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post('/group/enlist' + '?page=' + $scope.model.page, query)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.model.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.model.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.model.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.model.show = false;

  			$scope.init($scope.request);
		};

		$scope.request = {};

		$scope.request.withTrashed = true;
		$scope.request.paginate = 20;

		$scope.request.withCount = [
			{
				'relation':'users',
				'withTrashed': false,
			},
		];	

		$scope.isLoading = true;
		$scope.$broadcast('close');

		$scope.init($scope.request);
	}]);
app
	.controller('linksContentContainerController', ['$scope', 'Helper', function($scope, Helper){
		$scope.$emit('closeSidenav');
		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}
		$scope.toolbar.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';

		$scope.fab.label = 'Links';

		$scope.fab.action = function(){
			var dialog = {
				'template':'/app/components/settings/templates/dialogs/link-dialog.template.html',
				'controller': 'linkDialogController',
			}

			dialog.action = 'create';

			Helper.set(dialog);

			Helper.customDialog(dialog)
				.then(function(){
					Helper.notify('Link created.');
					$scope.refresh();
				}, function(){
					return;
				});
		}


		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.showInactive = true;
			$scope.request.search = $scope.toolbar.searchText;
			$scope.refresh();
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.showInactive = false;
			$scope.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		$scope.updateModel = function(data){
			var dialog = {
				'template':'/app/components/settings/templates/dialogs/link-dialog.template.html',
				'controller': 'linkDialogController',
			}

			data.action = 'edit';

			Helper.set(data);

			Helper.customDialog(dialog)
				.then(function(){
					$scope.refresh();
					Helper.notify('Link updated.');
				}, function(){
					return;
				});
		}

		$scope.deleteModel = function(data){
			var dialog = {};
			dialog.title = 'Delete';
			dialog.message = 'Delete ' + data.name + '?'
			dialog.ok = 'Delete';
			dialog.cancel = 'Cancel';

			Helper.confirm(dialog)
				.then(function(){
					Helper.delete('/link/' + data.id)
						.success(function(){
							$scope.refresh();
							Helper.notify('Link deleted.');
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
			data.deleted_at =  data.deleted_at ? new Date(data.deleted_at) : null;

			var item = {};

			item.display = data.name;

			$scope.toolbar.items.push(item);
		}

		$scope.init = function(query){
			$scope.model = {};
			$scope.model.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.model.page = 2;

			Helper.post('/link/enlist', query)
				.success(function(data){
					$scope.model.details = data;
					$scope.model.items = data.data;
					$scope.model.show = true;

					$scope.fab.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.model.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.model.busy || ($scope.model.page > $scope.model.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.model.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post('/link/enlist' + '?page=' + $scope.model.page, query)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.model.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.model.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.model.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.model.show = false;

  			$scope.init($scope.request);
  			$scope.$emit('fetchLinks');
		};

		$scope.request = {};

		$scope.request.withTrashed = true;
		$scope.request.paginate = 20;

		$scope.request.withCount = [
			{
				'relation':'users',
				'withTrashed': false,
			},
		];	

		$scope.isLoading = true;
		$scope.$broadcast('close');

		$scope.init($scope.request);
	}]);
app
	.controller('locationsContentContainerController', ['$scope', 'Helper', function($scope, Helper){
		$scope.$emit('closeSidenav');
		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}
		$scope.toolbar.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';

		$scope.fab.label = 'Locations';

		$scope.fab.action = function(){
			var dialog = {
				'template':'/app/components/settings/templates/dialogs/location-dialog.template.html',
				'controller': 'locationDialogController',
			}

			dialog.action = 'create';

			Helper.set(dialog);

			Helper.customDialog(dialog)
				.then(function(){
					Helper.notify('Location created.');
					$scope.refresh();
				}, function(){
					return;
				});
		}


		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.showInactive = true;
			$scope.request.search = $scope.toolbar.searchText;
			$scope.refresh();
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.showInactive = false;
			$scope.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		$scope.updateModel = function(data){
			var dialog = {
				'template':'/app/components/settings/templates/dialogs/location-dialog.template.html',
				'controller': 'locationDialogController',
			}

			data.action = 'edit';

			Helper.set(data);

			Helper.customDialog(dialog)
				.then(function(){
					$scope.refresh();
					Helper.notify('Location updated.');
				}, function(){
					return;
				});
		}

		$scope.deleteModel = function(data){
			var dialog = {};
			dialog.title = 'Delete';
			dialog.message = 'Delete ' + data.name + '?'
			dialog.ok = 'Delete';
			dialog.cancel = 'Cancel';

			Helper.confirm(dialog)
				.then(function(){
					Helper.delete('/location/' + data.id)
						.success(function(){
							$scope.refresh();
							Helper.notify('Location deleted.');
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
			data.deleted_at =  data.deleted_at ? new Date(data.deleted_at) : null;

			var item = {};

			item.display = data.name;

			$scope.toolbar.items.push(item);
		}

		$scope.init = function(query){
			$scope.model = {};
			$scope.model.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.model.page = 2;

			Helper.post('/location/enlist', query)
				.success(function(data){
					$scope.model.details = data;
					$scope.model.items = data.data;
					$scope.model.show = true;

					$scope.fab.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.model.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.model.busy || ($scope.model.page > $scope.model.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.model.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post('/location/enlist' + '?page=' + $scope.model.page, query)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.model.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.model.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.model.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.model.show = false;

  			$scope.init($scope.request);
		};

		$scope.request = {};

		$scope.request.withTrashed = true;
		$scope.request.paginate = 20;	

		$scope.isLoading = true;
		$scope.$broadcast('close');

		$scope.init($scope.request);
	}]);
app
	.controller('usersContentContainerController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		$scope.$emit('closeSidenav');

		$scope.state = $state.current.name;
		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}
		$scope.toolbar.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';

		$scope.fab.label = 'Users';

		$scope.fab.action = function(){
			var dialog = {
				'template':'/app/components/settings/templates/dialogs/user-dialog.template.html',
				'controller': 'userDialogController',
			}

			dialog.action = 'create';

			Helper.set(dialog);

			Helper.customDialog(dialog)
				.then(function(){
					Helper.notify('User created.');
					$scope.refresh();
				}, function(){
					return;
				});
		}


		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.showInactive = true;
			$scope.request.search = $scope.toolbar.searchText;
			$scope.refresh();
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.showInactive = false;
			$scope.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		$scope.updateModel = function(data){
			var dialog = {
				'template':'/app/components/settings/templates/dialogs/user-dialog.template.html',
				'controller': 'userDialogController',
			}

			data.action = 'edit';

			Helper.set(data);

			Helper.customDialog(dialog)
				.then(function(){
					$scope.refresh();
					Helper.notify('User updated.');
				}, function(){
					return;
				});
		}

		$scope.resetPassword = function(data){
			var dialog = {};
			dialog.title = 'Reset Password';
			dialog.message = 'Password will be reset to "!welcome10"';
			dialog.ok = 'Reset Password';
			dialog.cancel = 'Cancel';

			Helper.confirm(dialog)
				.then(function(){
					Helper.post('/user/reset-password', data)
						.success(function(){
							$scope.refresh();
							Helper.notify('Reset password succesful.');
						})
						.error(function(){
							Helper.error();
						});
				}, function(){
					return;
				})
		}

		$scope.deleteModel = function(data){
			var dialog = {};
			dialog.title = 'Delete';
			dialog.message = 'Delete ' + data.name + '?'
			dialog.ok = 'Delete';
			dialog.cancel = 'Cancel';

			Helper.confirm(dialog)
				.then(function(){
					Helper.delete('/user/' + data.id)
						.success(function(){
							$scope.refresh();
							Helper.notify('User deleted.');
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
			data.deleted_at =  data.deleted_at ? new Date(data.deleted_at) : null;

			var item = {};

			item.display = data.name;

			$scope.toolbar.items.push(item);
		}

		$scope.init = function(query){
			$scope.model = {};
			$scope.model.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.model.page = 2;

			Helper.post('/user/enlist', query)
				.success(function(data){
					$scope.model.details = data;
					$scope.model.items = data.data;
					$scope.model.show = true;

					$scope.fab.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.model.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.model.busy || ($scope.model.page > $scope.model.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.model.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post('/user/enlist' + '?page=' + $scope.model.page, query)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.model.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.model.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.model.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.model.show = false;

  			$scope.init($scope.request);
		};

		$scope.request = {};

		$scope.request.withTrashed = true;
		$scope.request.paginate = 20;	
		$scope.request.with = [
			{
				'relation':'group',
				'withTrashed':false,
			},
			{
				'relation':'roles',
				'withTrashed':false,
			},
		]
		$scope.request.where = [
			{
				'label':'super_admin',
				'condition':'!=',
				'value':true,
			},
		]
		$scope.request.do_not_include_current_user = true;


		$scope.isLoading = true;
		$scope.$broadcast('close');

		$scope.init($scope.request);
	}]);
app
	.controller('approvalsContentContainerController', ['$scope', '$state', '$stateParams', 'Helper', function($scope, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		/*
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.show = true;
		$scope.subheader.current = {};

		$scope.subheader.mark = {};

		$scope.subheader.toggleMark = function(){
			$scope.subheader.mark.all = !$scope.subheader.mark.all;
			$scope.subheader.mark.icon = $scope.subheader.mark.all ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline';
			$scope.subheader.mark.label = $scope.subheader.mark.all ? 'Uncheck all' : 'Check all';
			angular.forEach($scope.reservation.items, function(item){
				item.include = $scope.subheader.mark.all;
			});
		}

		$scope.subheader.cancelSelectMultiple = function(){
			$scope.selectMultiple = false;
			$scope.fab.show = false;
			$scope.subheader.mark.all = false;
			$scope.subheader.mark.icon = 'mdi-checkbox-blank-outline';
			$scope.subheader.mark.label = 'Check all';

			angular.forEach($scope.reservation.items, function(item){
				item.include = false;
			});
		}

		/**
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-check';

		$scope.viewReservation = function(data){
	    	Helper.set(data);

	    	var dialog = {
	    		'template':'/app/components/approvals/templates/dialogs/approval-dialog.template.html',
				'controller': 'approvalDialogController',
	    	}

	    	Helper.customDialog(dialog)
	    		.then(function(){
	    			Helper.notify('Reservation approved.');
	    			$scope.refresh();
	    		}, function(){
	    			return;
	    		});
	    }

	    /* Action originates from subheader */
		$scope.$on('setInit', function(){
			$scope.isLoading = true;
			$scope.$broadcast('close');
			
			var current = Helper.fetch();

			$scope.subheader.current = current;

			$scope.init(current);
		});

		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.subheader.current.request.search = $scope.toolbar.searchText;
			$scope.refresh();
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.subheader.current.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		$scope.$on('selectMultiple', function(){
			$scope.selectMultiple = true;
		});

		$scope.$on('cancelSelectMultiple', function(){
			$scope.subheader.cancelSelectMultiple();
		});

		$scope.$on('read-approval', function(){
			$scope.subheader.current.request.where.push(
				{
					'label':'id',
					'condition':'=',
					'value': Helper.fetch()
				}
			);

			$scope.isLoading = true;
  			$scope.reservation.show = false;

			$scope.init($scope.subheader.current);
		});

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			data.deleted_at =  data.deleted_at ? new Date(data.deleted_at) : null;
			data.created_at = new Date(data.created_at);
			data.start = new Date(data.start);
			data.end = new Date(data.end);

			var item = {};

			item.display = data.title;
			
			$scope.toolbar.items.push(item);
		}

		$scope.init = function(query){
			if($stateParams.reservationID)
			{
				query.request.where.push(
					{
						'label':'id',
						'condition':'=',
						'value': $stateParams.reservationID,	
					}
				);
			}

			$scope.subheader.mark.all = false;
			$scope.subheader.mark.icon = 'mdi-checkbox-blank-outline';
			$scope.subheader.mark.label = 'Check all';

			$scope.toolbar.items = [];

			$scope.reservation = {};
			$scope.reservation.items = [];
			$scope.reservation.show = true;

			// 2 is default so the next page to be loaded will be page 2 
			$scope.reservation.page = 2;

			Helper.post('/reservation/enlist', query.request)
				.success(function(data){
					$scope.reservation.details = data;
					$scope.reservation.items = [];
					
					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
							$scope.reservation.items.push(item);
						});
					}

					$scope.isLoading = false;

					$scope.reservation.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.reservation.busy || ($scope.reservation.page > $scope.reservation.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.reservation.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post('/reservation/enlist', $scope.reservation.page)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.reservation.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.reservation.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.reservation.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.reservation.show = false;

  			$scope.init($scope.subheader.current);

  			$state.go('main.approvals', {'reservationID':null});
		};
	}]);
app
	.controller('approvalDialogController', ['$scope', 'Helper', function($scope, Helper){
		var reservation = Helper.fetch();

		Helper.post('/user/check')
			.success(function(data){
				$scope.approver = data;
			});

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.checkDuplicate = function(equipment){
			Helper.post('/reservation-equipment/check-duplicate', equipment)
				.success(function(data){
					$scope.duplicate = data;
					equipment.duplicate = data;
				});
		}

		var request = {
			'with': [
				{
					'relation': 'location',
					'withTrashed': true,
				},
				{
					'relation': 'user',
					'withTrashed': true,
				},
				{
					'relation': 'equipment_types',
					'withTrashed': false,
					'available_units': true,
				},
				{
					'relation':'schedule_approver',
					'withTrashed': true,
				},
				{
					'relation':'equipment_approver',
					'withTrashed': true,
				},
			],
			'where': [
				{
					'label': 'id',
					'condition': '=',
					'value': reservation.id,
				},
			],
			'first' : true,
		}

		Helper.post('/reservation/enlist', request)
			.success(function(data){
				$scope.start = new Date(data.start);
				$scope.end = data.end ? new Date(data.end) : null;

				$scope.reservation = data;
			})
			.error(function(){
				Helper.error();
			})

		$scope.submit = function(){
			if($scope.approvalForm.$invalid){
				angular.forEach($scope.approvalForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;
				// IT
				if($scope.approver.group_id == 1){
					Helper.post('/reservation-equipment/approve', $scope.reservation.equipment_types)
						.success(function(data){
							if(!data){
								Helper.stop();
							}
							else{
								$scope.duplicate = true;
								$scope.busy = false;
							}
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						})
				}
			}

			if($scope.approver.group_id == 2){
				Helper.post('/reservation/approve', $scope.reservation)
					.success(function(data){
						if(!data){
							Helper.stop();
						}
						else{
							$scope.duplicate = true;
							$scope.busy = false;
						}
					})
					.error(function(){
						$scope.busy = false;
						$scope.error = true;
					})
			}
		}
	}]);
app
	.controller('approvalsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.current_tab = data;

			$scope.$emit('setInit');
		}

		var today = new Date().toDateString();

		$scope.subheader.all = {};

		$scope.subheader.all.label = 'All';

		$scope.subheader.all.request = {
			'with': [
				{
					'relation':'location',
					'withTrashed': true,
				},
				{
					'relation':'user',
					'withTrashed': true,
				},
				{
					'relation':'schedule_approver',
					'withTrashed': true,
				},
				{
					'relation':'equipment_approver',
					'withTrashed': true,
				},
			],
			'where': [],
			'approvals': true,
			'paginate': 10,
		}

		$scope.subheader.all.action = function(){
			setInit($scope.subheader.all);
		}

		$scope.init = function(){
			Helper.get('/location')
				.success(function(data){
					$scope.locations = data;
					$scope.subheader.navs = [];
					
					angular.forEach($scope.locations, function(location){
						var item = {};

						item.id = location.id;
						item.label = location.name;
						item.request = {
							'with': [
								{
									'relation':'location',
									'withTrashed': true,
								},
								{
									'relation':'user',
									'withTrashed': true,
								},
								{
									'relation':'schedule_approver',
									'withTrashed': true,
								},
								{
									'relation':'equipment_approver',
									'withTrashed': true,
								},
							],
							'where': [
								{
									'label':'location_id',
									'condition':'=',
									'value': location.id,
								},
							],
							'approvals': true,
							'paginate': 10,
						}
						item.menu = $scope.subheader.all.menu,
						item.action = function(current){
							setInit(current);
						}

						$scope.subheader.navs.push(item);
					});

					setInit($scope.subheader.all);
				})
		}

		$scope.init();
	}]);
app
	.controller('approvalsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.childState = 'Approvals';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.$on('open', function(){
			$scope.showSearchBar();
			$scope.searchUserInput();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.reservation.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};

		$scope.toolbar.options = true;
		
		$scope.toolbar.sort = [
			{
				'label': 'Title',
				'type': 'title',
				'sortReverse': false,
			},
			{
				'label': 'Remarks',
				'type': 'remarks',
				'sortReverse': false,
			},
			{
				'label': 'Date Start',
				'type': 'start',
				'sortReverse': false,
			},
			{
				'label': 'Date End',
				'type': 'end',
				'sortReverse': false,
			},
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];
		
		$scope.toolbar.refresh = function(){
			$scope.$emit('refresh');
		}
	}]);
app
	.controller('notificationsContentContainerController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		$scope.$emit('closeSidenav');

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

		var pushItem = function(item){
			var item = {
				'display': item.data.sender.name,
				'message': item.data.message,
			}

			$scope.toolbar.items.push(item);
		}

		$scope.readNotification = function(notification){
			if(notification.data.withParams)
			{
				$state.go(notification.data.url, {'id':notification.data.attachment.id});
			}
			else{
				$state.go(notification.data.url);
				
				if(notification.type == 'App\\Notifications\\PostCreated' || notification.type == 'App\\Notifications\\RepostCreated')
				{
					Helper.set(notification.data.attachment.id);
					$scope.$broadcast('read-post');
				}
				else if(notification.type == 'App\\Notifications\\CommentCreated')
				{
					Helper.set(notification.data.attachment.post_id);
					$scope.$broadcast('read-post-and-comments');
				}
				else if(notification.type == 'App\\Notifications\\ReservationCreated')
				{
					Helper.set(notification.data.attachment.id);
					$scope.$broadcast('read-approval');
				}
			}
		}

		$scope.init = function(query){
			$scope.notification = {};
			$scope.notification.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.notification.page = 2;

			Helper.post('/user/notifications', query)
				.success(function(data){
					$scope.notification.details = data;
					$scope.notification.items = data.data;
					$scope.notification.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.notification.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.notification.busy || ($scope.notification.page > $scope.notification.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.notification.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post('/user/notifications' + '?page=' + $scope.notification.page, query)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.notification.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.notification.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.notification.busy = false;
								$scope.isLoading = false;
							});
					}
				})
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.notification.show = false;
			$scope.request.where = null;

  			$scope.init($scope.request);
		};

		$scope.request = {
			'paginate':20,
		}

		$scope.init($scope.request);
	}]);
app
	.controller('notificationsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.childState = 'Notifications';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.$on('open', function(){
			$scope.showSearchBar();
			$scope.searchUserInput();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.notification.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};

		$scope.toolbar.options = true;
		
		$scope.toolbar.refresh = function(){
			$scope.$emit('refresh');
		}
	}]);
app
	.controller('postDialogController', ['$scope', 'Helper', 'FileUploader', function($scope, Helper, FileUploader){
		$scope.config = Helper.fetch();

		var query = {};

		query.self_group = true;

		Helper.post('/group/enlist', query)
			.success(function(data){
				$scope.groups = data;
			});

		$scope.repost = {};

		$scope.post = {};
		$scope.post.group_id = 'all';
		$scope.post.chips = [];

		var uploader = {};

		uploader.filter = {
            name: 'photoFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        uploader.sizeFilter = {
		    'name': 'enforceMaxFileSize',
		    'fn': function (item) {
		        return item.size <= 10485760;
		    }
        }

        uploader.error = function(item /*{File|FileLikeObject}*/, filter, options) {
            $scope.fileError = true;
            $scope.postPhotoUploader.queue = [];
        };

        uploader.headers = { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')};

		$scope.clickUpload = function(){
		    angular.element('#post-upload').trigger('click');
		};

		/* Photo Uploader */
		$scope.postPhotoUploader = new FileUploader({
			url: '/temp-upload/upload-photo',
			headers: uploader.headers,
			queueLimit : 1
		})

		if($scope.config.action == 'edit')
		{
			$scope.currentTime = Date.now();
			
			var query = {};

			query.with = [
				{
					'relation':'hashtags',
					'withTrashed': false,	
				},
			];

			query.where = [
				{
					'label':'id',
					'condition':'=',
					'value': $scope.config.id,
				}
			];

			query.first = true;

			Helper.post('/post/enlist', query)
				.success(function(data){
					data.chips = [];

					angular.forEach(data.hashtags, function(hashtag){
						data.chips.push(hashtag.tag);
					});

					$scope.post = data;
					$scope.post.group_id = data.group_id ? data.group_id : 'all';
					$scope.post.pinned = data.pinned ? true : false;
					$scope.post.allow_comments = data.allow_comments ? true : false;
				})
				.error(function(){
					Helper.error();
				});
		}

		$scope.duplicate = false;

		$scope.busy = false;

		// FILTERS
        $scope.postPhotoUploader.filters.push(uploader.filter);
        $scope.postPhotoUploader.filters.push(uploader.sizeFilter);
        
		$scope.postPhotoUploader.onWhenAddingFileFailed = uploader.error;
		$scope.postPhotoUploader.onAfterAddingFile  = function(){
			$scope.fileError = false;
			if($scope.postPhotoUploader.queue.length)
			{	
				$scope.postPhotoUploader.uploadAll()
			}
		};

		$scope.postPhotoUploader.onCompleteItem  = function(data, response){
			$scope.temp_upload = response;
			$scope.post.image_path = response.path;
			if(response)
			{
				$scope.preview = true;
				$scope.currentTime = Date.now();
			}
		}

		$scope.postPhotoUploader.onErrorItem = function()
		{
			Helper.error();
		}

		$scope.replace = function(){
			// $scope.post.image_path = null;
			// $scope.temp_upload = {};
			// $scope.preview = false;
			$scope.postPhotoUploader.queue = [];
			$scope.clickUpload();
		}

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.submit = function(){
			if($scope.postForm.$invalid){
				angular.forEach($scope.postForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				if($scope.config.action == 'create')
				{
					Helper.post('/post', $scope.post)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
				else if($scope.config.action == 'edit')
				{
					Helper.put('/post' + '/' + $scope.config.id, $scope.post)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
			}
		}
	}]);
app
	.controller('repostDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		var query = {};

		query.self_group = true;

		Helper.post('/group/enlist', query)
			.success(function(data){
				$scope.groups = data;
			});

		$scope.repost = {};

		if($scope.config.action == 'create')
		{
			
			var query = {};

			query.with = [
				{
					'relation':'hashtags',
					'withTrashed': false,	
				},
				{
					'relation':'user',
					'withTrashed': true,
				},
				{
					'relation':'group',
					'withTrashed': true,
				},
			];

			query.where = [
				{
					'label':'id',
					'condition':'=',
					'value': $scope.config.id,
				}
			];

			query.first = true;

			Helper.post('/post/enlist', query)
				.success(function(data){
					data.created_at = new Date(data.created_at);
					data.chips = [];

					angular.forEach(data.hashtags, function(hashtag){
						data.chips.push(hashtag.tag);
					});

					$scope.repost.post = data;
					$scope.repost.post.pinned = data.pinned ? true : false;
					$scope.repost.post.allow_comments = data.allow_comments ? true : false;

					$scope.repost.group_id = data.group_id ? data.group_id : 'all';
				})
				.error(function(){
					Helper.error();
				});
		}

		else if($scope.config.action == 'edit')
		{
			var query = {};

			query.with = [
				{
					'relation':'post',
					'withTrashed': false,	
				},
			];

			query.where = [
				{
					'label':'id',
					'condition':'=',
					'value': $scope.config.id,
				}
			];

			query.first = true;

			Helper.post('/repost/enlist', query)
				.success(function(data){
					data.post.created_at = new Date(data.post.created_at);
					data.post.chips = [];

					angular.forEach(data.post.hashtags, function(hashtag){
						data.post.chips.push(hashtag.tag);
					});

					$scope.repost.post = data.post;
					$scope.repost.post.pinned = data.post.pinned ? true : false;
					$scope.repost.post.allow_comments = data.post.allow_comments ? true : false;

					$scope.repost.group_id = data.post.group_id ? data.post.group_id : 'all';

					Helper.get('/post/' + $scope.config.id)
						.success(function(data){
							$scope.repost.id = data.repost_id;
							$scope.repost.title = data.title;
							$scope.repost.pinned = data.pinned ? true : false;
							$scope.repost.allow_comments = data.allow_comments ? true : false;
							$scope.repost.group_id = data.group_id ? data.group_id : 'all';
						});
				})
				.error(function(){
					Helper.error();
				});

		}

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.submit = function(){
			if($scope.repostForm.$invalid){
				angular.forEach($scope.repostForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			$scope.busy = true;

			if($scope.config.action == 'create')
			{
				Helper.post('/repost', $scope.repost)
					.success(function(duplicate){
						if(duplicate){
							$scope.busy = false;
							return;
						}

						Helper.stop();
					})
					.error(function(){
						$scope.busy = false;
						$scope.error = true;
					});
			}
			else if($scope.config.action == 'edit')
			{
				Helper.put('/repost' + '/' + $scope.config.id, $scope.repost)
					.success(function(duplicate){
						if(duplicate){
							$scope.busy = false;
							return;
						}

						Helper.stop();
					})
					.error(function(){
						$scope.busy = false;
						$scope.error = true;
					});
			}
		}
	}]);
app
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
app
	.controller('postsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.childState = 'Posts';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.$on('open', function(){
			$scope.showSearchBar();
			$scope.searchUserInput();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.post.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};

		$scope.toolbar.options = true;
		
		$scope.toolbar.refresh = function(){
			$scope.$emit('refresh');
		}
	}]);
app
	.controller('approvedReservationDialogController', ['$scope', 'Helper', function($scope, Helper){
		var reservation = Helper.fetch();

		$scope.cancel = function(){
			Helper.cancel();
		}

		var request = {
			'with': [
				{
					'relation': 'location',
					'withTrashed': true,
				},
				{
					'relation': 'user',
					'withTrashed': true,
				},
				{
					'relation': 'equipment_types',
					'withTrashed': false,
				},
				{
					'relation': 'equipment',
					'withTrashed': true,
				},
				{
					'relation':'schedule_approver',
					'withTrashed': true,
				},
				{
					'relation':'equipment_approver',
					'withTrashed': true,
				},
			],
			'where': [
				{
					'label': 'id',
					'condition': '=',
					'value': reservation.id,
				},
			],
			'first' : true,
		}

		Helper.post('/reservation/enlist', request)
			.success(function(data){
				data.start = new Date(data.start);
				data.end = data.end ? new Date(data.end) : null;

				$scope.reservation = data;
			})
			.error(function(){
				Helper.error();
			})
	}]);
app
	.controller('reservationDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.duplicate = false;

		$scope.fallback = {};

		$scope.reservation = {};

		$scope.reservation.equipment_types = [];

		$scope.reservation.date_start = new Date();
		$scope.reservation.time_start = new Date();
		$scope.reservation.date_end = new Date();
		$scope.reservation.time_end = new Date();

		var formatDateToObject = function(){
			$scope.fallback.date_start = new Date($scope.reservation.date_start);
			$scope.fallback.date_end = new Date($scope.reservation.date_end);
			$scope.fallback.time_start = new Date($scope.reservation.time_start);
			$scope.fallback.time_end = new Date($scope.reservation.time_end);
		}

		var fallbackDateToObject = function(){
			$scope.reservation.date_start = new Date($scope.fallback.date_start);
			$scope.reservation.date_end = new Date($scope.fallback.date_end);
			$scope.reservation.time_start = new Date($scope.fallback.time_start);
			$scope.reservation.time_end = new Date($scope.fallback.time_end);
		}

		$scope.checkDuplicate = function(){
			if($scope.reservation.location_id)
			{				
				var request = {};

				request.location_id = $scope.reservation.location_id;
				request.date_start = new Date($scope.reservation.date_start).toDateString();
				request.date_end = new Date($scope.reservation.date_end).toDateString();
				request.time_start = new Date($scope.reservation.time_start).toLocaleTimeString();
				request.time_end = new Date($scope.reservation.time_end).toLocaleTimeString();


				Helper.post('/reservation/check-duplicate', request)
					.success(function(data){
						$scope.duplicate = data;
					});
			}
		}

		$scope.locationChange = function(){
			$scope.checkDuplicate();
		}

		$scope.setDateStart = function(){
			$scope.reservation.time_start.setMonth($scope.reservation.date_start.getMonth());
			$scope.reservation.time_start.setDate($scope.reservation.date_start.getDate());
			$scope.reservation.time_start.setFullYear($scope.reservation.date_start.getFullYear());

			$scope.reservation.time_start = new Date($scope.reservation.time_start);

			$scope.min_end_time = new Date($scope.reservation.time_start);

			if($scope.reservation.time_start > $scope.reservation.time_end)
			{
				$scope.reservation.time_end = new Date($scope.reservation.time_start);
			}

			if($scope.reservation.date_start > $scope.reservation.date_end)
			{
				$scope.reservation.date_end = new Date($scope.reservation.date_start);				
			}

			$scope.checkDuplicate();
		}

		$scope.setDateEnd = function(){
			$scope.reservation.time_end.setMonth($scope.reservation.date_end.getMonth());
			$scope.reservation.time_end.setDate($scope.reservation.date_end.getDate());
			$scope.reservation.time_end.setFullYear($scope.reservation.date_end.getFullYear());

			$scope.reservation.time_end = new Date($scope.reservation.time_end);

			if($scope.reservation.time_start > $scope.reservation.time_end)
			{
				$scope.reservation.time_end = new Date($scope.reservation.time_start);
			}

			$scope.checkDuplicate();
		}

		$scope.timeStartChanged = function(){
			$scope.min_end_time = new Date($scope.reservation.time_start);

			if($scope.reservation.time_start > $scope.reservation.time_end)
			{
				$scope.reservation.time_end = new Date($scope.reservation.time_start);
			}

			$scope.checkEquipment($scope.reservation.time_start, $scope.reservation.time_end);

			$scope.checkDuplicate();
		} 

		$scope.timeEndChanged = function(){			
			$scope.checkDuplicate();
			$scope.checkEquipment($scope.reservation.time_start, $scope.reservation.time_end);
		}

		$scope.allDay = function(){
			if($scope.reservation.allDay)
			{
				$scope.reservation.time_start.setHours(0,0,0,0);

				$scope.reservation.time_start = new Date($scope.reservation.time_start);
				
				$scope.reservation.time_end.setHours(23,59,59);

				$scope.reservation.time_end = new Date($scope.reservation.time_end);
			}
			else{
				$scope.reservation.time_start = new Date();
				$scope.reservation.time_end = new Date();
				$scope.min_start_time = new Date();
				$scope.min_start_date = new Date();

				$scope.min_end_time = new Date();
			}

			$scope.checkDuplicate();
		}

		$scope.checkEquipment = function(start, end){
			var date = {
				'start': new Date(start).toDateString() + ' ' + new Date(start).toLocaleTimeString(),
				'end': new Date(end).toDateString() + ' ' + new Date(end).toLocaleTimeString(),
			}

			var request = {
				'with': [
					{
						'relation': 'equipment',
						'withTrashed': false,
						'whereDoesntHave': {
							'relation': 'reservations',
							'whereNotNull': ['schedule_approver_id' ,'equipment_approver_id'],
							'whereBetween': {
								'label': 'start',
								'start': date.start,
								'end': date.end,
							}
						},
					}
				]
			}

			Helper.post('/equipment-type/enlist', request)
				.success(function(data){
					$scope.equipment_types = data
					// $scope.count = data.length;

					if($scope.config.action == 'edit')
					{
						angular.forEach($scope.equipment_types, function(item, key){
							$scope.reservation.equipment_types.push(null);

							var query = {};
							query.with = [
								{
									'relation': 'equipment_type.equipment',
									'withTrashed': false,
								}
							];
							query.where = [
								{
									'label': 'reservation_id',
									'condition': '=',
									'value': $scope.reservation.id,
								},
								{
									'label': 'equipment_type_id',
									'condition': '=',
									'value': item.id,
								},
							];
							query.first = true;

							Helper.post('/reservation-equipment/enlist', query)
								.success(function(data){
									if(data)
									{
										$scope.reservation.equipment_types[key] = data.equipment_type;
									}
								});
						});
					}
				});
		}
		
		$scope.busy = false;

		Helper.get('/location')
			.success(function(data){
				$scope.locations = data;
			});

		if($scope.config.action == 'create')
		{
			$scope.min_start_time = new Date();
			$scope.min_start_date = new Date();

			$scope.min_end_time = new Date();

			$scope.checkEquipment($scope.reservation.time_start, $scope.reservation.time_end);
		}

		if($scope.config.action == 'edit')
		{
			var request = {
				'where': [
					{
						'label': 'id',
						'condition': '=',
						'value': $scope.config.id,
					},
				],
				'first' : true,
			}

			Helper.post('/reservation/enlist', request)
				.success(function(data){
					data.start = new Date(data.start);
					data.end = data.end ? new Date(data.end) : null;

					$scope.reservation = data;
					$scope.reservation.equipment_types = [];
					
					$scope.reservation.allDay = data.allDay ? true : false;

					$scope.reservation.date_start = new Date(data.start);
					$scope.reservation.date_end = new Date(data.end);

					$scope.reservation.time_start = new Date(data.start);
					$scope.reservation.time_end = new Date(data.end);

					$scope.min_start_time = new Date();
					$scope.min_start_date = new Date();

					$scope.min_end_time = new Date();

					$scope.checkEquipment($scope.reservation.time_start, $scope.reservation.time_end);
				})
				.error(function(){
					Helper.error();
				})
		}

		$scope.submit = function(){
			if($scope.reservationForm.$invalid){
				angular.forEach($scope.reservationForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{			
				$scope.busy = true;

				formatDateToObject();

				$scope.reservation.date_start = $scope.reservation.date_start.toDateString();
				$scope.reservation.date_end = $scope.reservation.date_end.toDateString();
				$scope.reservation.time_start = $scope.reservation.time_start.toLocaleTimeString();
				$scope.reservation.time_end = $scope.reservation.time_end.toLocaleTimeString();

				if($scope.config.action == 'create')
				{
					Helper.post('/reservation', $scope.reservation)
						.success(function(duplicate){
							if(!duplicate)
							{
								Helper.stop();
							}
							else{
								$scope.busy = false;
								$scope.duplicate = duplicate;
								
								fallbackDateToObject();
							}
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;

							fallbackDateToObject();
						});
				}
				else if($scope.config.action == 'edit')
				{
					Helper.put('/reservation' + '/' + $scope.config.id, $scope.reservation)
						.success(function(duplicate){
							if(!duplicate)
							{
								Helper.stop();
							}
							else{
								$scope.busy = false;
								$scope.duplicate = duplicate;

								fallbackDateToObject();
							}
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;

							fallbackDateToObject();
						});
				}
			}
		}
	}]);
app
	.controller('reservationsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.current_tab = data;

			$scope.$emit('setInit');
		}

		$scope.subheader.all = {};

		$scope.subheader.all.label = 'All';
		
		$scope.subheader.all.fab = {
			'template':'/app/components/reservations/templates/dialogs/reservation-dialog.template.html',
			'controller': 'reservationDialogController',
			'action':'create',
		}

		$scope.subheader.all.request = {
			'with': [
				{
					'relation':'location',
					'withTrashed': false,
				},
				{
					'relation':'user',
					'withTrashed': false,
				},
				{
					'relation':'schedule_approver',
					'withTrashed': false,
				},
				{
					'relation':'equipment_approver',
					'withTrashed': false,
				},
			],
		}

		$scope.subheader.all.action = function(){
			setInit($scope.subheader.all);
		}

		$scope.$on('dateRange', function(){
			var dateRange = Helper.fetch();

			var whereBetween = {
				'label': 'start',
				'start': dateRange.start,
				'end': dateRange.end,
			}

			$scope.subheader.all.request.whereBetween = whereBetween;
			
			angular.forEach($scope.subheader.navs, function(item){
				item.request.whereBetween = whereBetween;
			});
		});

		$scope.init = function(){
			Helper.get('/location')
				.success(function(data){
					$scope.locations = data;
					$scope.subheader.navs = [];
					
					angular.forEach($scope.locations, function(location){
						var item = {};

						item.id = location.id;
						item.label = location.name;
						item.request = {
							'with': [
								{
									'relation':'location',
									'withTrashed': false,
								},
								{
									'relation':'user',
									'withTrashed': false,
								},
								{
									'relation':'schedule_approver',
									'withTrashed': false,
								},
								{
									'relation':'equipment_approver',
									'withTrashed': false,
								},
							],
							'where': [
								{
									'label':'location_id',
									'condition':'=',
									'value': location.id,
								},
							],
						}
						item.fab = {
							'template':'/app/components/reservations/templates/dialogs/reservation-dialog.template.html',
							'controller': 'reservationDialogController',
							'action':'create',
							'message': 'Reservation created',
							'location_id': location.id,
						}
						item.action = function(current){
							setInit(current);
						}

						$scope.subheader.navs.push(item);
					});

					setInit($scope.subheader.all);
				})
		}

		$scope.init();
	}]);
app
	.controller('reservationsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.childState = 'Reservations';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.reservation.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};

		$scope.toolbar.options = true;

		$scope.toolbar.refresh = function(){
			$scope.$emit('refresh');
		}
	}]);
app
	.controller('equipmentDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		if($scope.config.action == 'create')
		{
			$scope.equipment = {};
			$scope.equipment.equipment_type_id = $scope.config.equipment_type_id;
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get('/equipment' + '/' + $scope.config.id)
				.success(function(data){
					$scope.equipment = data;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/equipment' + '/check-duplicate', $scope.equipment)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.equipmentForm.$invalid){
				angular.forEach($scope.equipmentForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				if($scope.config.action == 'create')
				{
					Helper.post('/equipment', $scope.equipment)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
				else if($scope.config.action == 'edit')
				{
					Helper.put('/equipment' + '/' + $scope.config.id, $scope.equipment)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
			}
		}
	}]);
app
	.controller('equipmentTypeDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		if($scope.config.action == 'create')
		{
			$scope.equipment_type = {};
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get('/equipment-type' + '/' + $scope.config.id)
				.success(function(data){
					$scope.equipment_type = data;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/equipment-type' + '/check-duplicate', $scope.equipment_type)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.equipmentTypeForm.$invalid){
				angular.forEach($scope.equipmentTypeForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				if($scope.config.action == 'create')
				{
					Helper.post('/equipment-type', $scope.equipment_type)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
				else if($scope.config.action == 'edit')
				{
					Helper.put('/equipment-type' + '/' + $scope.config.id, $scope.equipment_type)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
			}
		}
	}]);
app
	.controller('groupDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		if($scope.config.action == 'create')
		{
			$scope.model = {};
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get('/group' + '/' + $scope.config.id)
				.success(function(data){
					$scope.model = data;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/group' + '/check-duplicate', $scope.model)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.modelForm.$invalid){
				angular.forEach($scope.modelForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				if($scope.config.action == 'create')
				{
					Helper.post('/group', $scope.model)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
				else if($scope.config.action == 'edit')
				{
					Helper.put('/group' + '/' + $scope.config.id, $scope.model)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
			}
		}
	}]);
app
	.controller('linkDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		if($scope.config.action == 'create')
		{
			$scope.model = {};
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get('/link' + '/' + $scope.config.id)
				.success(function(data){
					$scope.model = data;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/link' + '/check-duplicate', $scope.model)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.modelForm.$invalid){
				angular.forEach($scope.modelForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				if($scope.config.action == 'create')
				{
					Helper.post('/link', $scope.model)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
				else if($scope.config.action == 'edit')
				{
					Helper.put('/link' + '/' + $scope.config.id, $scope.model)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
			}
		}
	}]);
app
	.controller('locationDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		if($scope.config.action == 'create')
		{
			$scope.model = {};
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get('/location' + '/' + $scope.config.id)
				.success(function(data){
					$scope.model = data;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/location' + '/check-duplicate', $scope.model)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.modelForm.$invalid){
				angular.forEach($scope.modelForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				if($scope.config.action == 'create')
				{
					Helper.post('/location', $scope.model)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
				else if($scope.config.action == 'edit')
				{
					Helper.put('/location' + '/' + $scope.config.id, $scope.model)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
			}
		}
	}]);
app
	.controller('userDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		Helper.get('/group')
			.success(function(data){
				$scope.groups = data;
			});

		Helper.post('/role/enlist')
			.success(function(data){
				$scope.roles = data;
			})

		if($scope.config.action == 'create')
		{
			$scope.model = {};
			$scope.model.roles = [];
			$scope.model.group_id = $scope.config.group_id;
		}
		else if($scope.config.action == 'edit')
		{
			Helper.post('/role/enlist')
				.success(function(data){
					$scope.roles = data;
					$scope.count = $scope.roles.length;
		
					Helper.get('/user' + '/' + $scope.config.id)
						.success(function(data){
							$scope.model = data;
							$scope.model.roles = [];

							angular.forEach($scope.roles, function(item, key){
								$scope.model.roles.push(null);

								var query = {};
								query.with = [
									{
										'relation':'role',
										'withTrashed': false,
									},
								];
								query.where = [
									{
										'label': 'user_id',
										'condition': '=',
										'value': $scope.model.id,
									},
									{
										'label': 'role_id',
										'condition': '=',
										'value': item.id,
									},
								];
								query.first = true;

								Helper.post('/user-role/enlist', query)
									.success(function(data){
										$scope.count--;
										if(data)
										{
											$scope.model.roles.splice(key, 1, data.role);
										}
									});
							});
						})
						.error(function(){
							Helper.error();
						});
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/user' + '/check-email', $scope.model)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.modelForm.$invalid){
				angular.forEach($scope.modelForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				if($scope.config.action == 'create')
				{
					Helper.post('/user', $scope.model)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
				else if($scope.config.action == 'edit')
				{
					Helper.put('/user' + '/' + $scope.config.id, $scope.model)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
			}
		}
	}]);
app
	.controller('equipmentSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.current_tab = data;

			$scope.$emit('setInit');
		}

		$scope.subheader.create = function(){
			var dialog = {};
			dialog.template = '/app/components/settings/templates/dialogs/equipment-type-dialog.template.html';
			dialog.controller = 'equipmentTypeDialogController';
			dialog.action = 'create';

			Helper.set(dialog);

			Helper.customDialog(dialog)
				.then(function(){
					$scope.init();
					Helper.notify('Equipment type created.');
				}, function(){
					return;
				});
		}

		$scope.subheader.update = function(){
			var dialog = {};
			dialog.template = '/app/components/settings/templates/dialogs/equipment-type-dialog.template.html';
			dialog.controller = 'equipmentTypeDialogController';
			dialog.action = 'edit';
			dialog.id = $scope.current_tab.id;

			Helper.set(dialog);

			Helper.customDialog(dialog)
				.then(function(){
					$scope.init();
					Helper.notify('Equipment type updated.');
				}, function(){
					return;
				});
		}

		$scope.subheader.delete = function(){
			var dialog = {};
			dialog.title = 'Delete';
			dialog.message = 'Delete ' + $scope.current_tab.label + '?'
			dialog.ok = 'Delete';
			dialog.cancel = 'Cancel';

			Helper.confirm(dialog)
				.then(function(){
					Helper.delete('/equipment-type/' + $scope.current_tab.id)
						.success(function(){
							$scope.init();
							Helper.notify('Equipment type deleted.');
						})
						.error(function(){
							Helper.error();
						});
				}, function(){
					return;
				})
		}

		$scope.init = function(){
			var query = {};
			query.withCount = [
				{
					'relation':'equipment',
					'withTrashed': false,
				}
			];

			Helper.post('/equipment-type/enlist', query)
				.success(function(data){
					$scope.equipment_types = data;
					$scope.subheader.navs = [];
					
					angular.forEach($scope.equipment_types, function(equipment_type){
						var item = {};

						item.id = equipment_type.id;
						item.equipment_count = equipment_type.equipment_count;
						item.label = equipment_type.name;
						item.request = {
							'withTrashed': true,
							'where': [
								{
									'label':'equipment_type_id',
									'condition':'=',
									'value': equipment_type.id,
								},
							],
							'paginate':20,
						}
						item.fab = {
							'template':'/app/components/settings/templates/dialogs/equipment-dialog.template.html',
							'controller': 'equipmentDialogController',
							'action':'create',
							'message': 'Equipment created',
							'equipment_type_id': equipment_type.id,
						}
						item.action = function(current){
							setInit(current);
						}

						$scope.subheader.navs.push(item);
					});

					setInit($scope.subheader.navs[0]);
				})
		}

		$scope.init();
	}]);
app
	.controller('equipmentToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Equipment';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.no_matches = false;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};

		$scope.toolbar.options = true;
		$scope.toolbar.showInactive = true;

		$scope.toolbar.sort = [
			{
				'label': 'Brand',
				'type': 'brand',
				'sortReverse': false,
			},
			{
				'label': 'Model',
				'type': 'model',
				'sortReverse': false,
			},
			{
				'label': 'Asset Tag',
				'type': 'asset_tag',
				'sortReverse': false,
			},
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];

		$scope.toolbar.refresh = function(){
			$scope.$emit('refresh');
		}
	}]);
app
	.controller('groupsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Groups';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.no_matches = false;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};

		$scope.toolbar.options = true;
		$scope.toolbar.showInactive = true;

		$scope.toolbar.sort = [
			{
				'label': 'Name',
				'type': 'name',
				'sortReverse': false,
			},
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];

		$scope.toolbar.refresh = function(){
			$scope.$emit('refresh');
		}
	}]);
app
	.controller('linksToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Links';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.no_matches = false;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};

		$scope.toolbar.options = true;
		$scope.toolbar.showInactive = true;

		$scope.toolbar.sort = [
			{
				'label': 'Name',
				'type': 'name',
				'sortReverse': false,
			},
			{
				'label': 'Link',
				'type': 'link',
				'sortReverse': false,
			},
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];

		$scope.toolbar.refresh = function(){
			$scope.$emit('refresh');
		}
	}]);
app
	.controller('locationsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Locations';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.no_matches = false;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};

		$scope.toolbar.options = true;
		$scope.toolbar.showInactive = true;

		$scope.toolbar.sort = [
			{
				'label': 'Name',
				'type': 'name',
				'sortReverse': false,
			},
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];

		$scope.toolbar.refresh = function(){
			$scope.$emit('refresh');
		}
	}]);
app
	.controller('usersToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Users';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.no_matches = false;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};

		$scope.toolbar.options = true;
		$scope.toolbar.showInactive = true;

		$scope.toolbar.sort = [
			{
				'label': 'Name',
				'type': 'name',
				'sortReverse': false,
			},
			{
				'label': 'Email',
				'type': 'email',
				'sortReverse': false,
			},
			{
				'label': 'Recently added',
				'type': 'created_at',
				'sortReverse': false,
			},
		];

		$scope.toolbar.refresh = function(){
			$scope.$emit('refresh');
		}
	}]);
//# sourceMappingURL=app.js.map

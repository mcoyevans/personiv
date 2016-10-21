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
			.state('main.equipments', {
				url: 'settings/equipments',
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
						controller: 'equipmentsContentContainerController',
					},
					'toolbar@main.equipments': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'equipmentsToolbarController',
					},
					'subheader@main.equipments': {
						templateUrl: '/app/components/settings/templates/subheaders/equipments-subheader.template.html',
						controller: 'equipmentsSubheaderController',
					},
					'left-sidenav@main.equipments': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.equipments':{
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
	}]);
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

		Helper.post('/user/check')
			.success(function(data){
				var settings = false;
				var settings_menu = [];

				angular.forEach(data.roles, function(role){
					if(role.name == 'approvals')
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
					else if(role.name == 'manage-equipments')
					{
						settings = true;

						var item = {
							'label': 'Equipments',
							action: function(){
								$state.go('main.equipments');
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
			})

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
	.controller('equipmentsContentContainerController', ['$scope', 'Helper', function($scope, Helper){
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
	.controller('usersContentContainerController', ['$scope', 'Helper', function($scope, Helper){
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


		$scope.isLoading = true;
		$scope.$broadcast('close');

		$scope.init($scope.request);
	}]);
app
	.controller('postDialogController', ['$scope', 'Helper', 'FileUploader', function($scope, Helper, FileUploader){
		$scope.config = Helper.fetch();

		Helper.get('/group')
			.success(function(data){
				$scope.groups = data;
			});

		$scope.post = {};
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

			Helper.post('/post/enlist', query)
				.success(function(data){
					data.chips = [];

					angular.forEach(data.hashtags, function(hashtag){
						data.chips.push(hashtag.tag);
					});

					$scope.post = data;
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
			}
		}

		$scope.postPhotoUploader.onErrorItem = function()
		{
			Helper.error();
		}

		$scope.remove = function(){
			$scope.post.image_path = null;
			$scope.temp_upload = {};
			$scope.preview = false;
			$scope.postPhotoUploader.queue = [];
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
	.controller('postsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.childState = 'Posts';

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
			// $scope.post.busy = true;
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
				// $scope.post.page = 1;
				// $scope.post.no_matches = false;
				// $scope.post.items = [];
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
	.controller('equipmentsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
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
					'relation':'equipments',
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
						item.equipments_count = equipment_type.equipments_count;
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
	.controller('equipmentsToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Equipments';

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

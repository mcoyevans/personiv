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
			// .state('main', {
			// 	url: '/',
			// 	views: {
			// 		'': {
			// 			templateUrl: '/app/shared/views/main.view.html',
			// 			controller: 'mainViewController',
			// 		},
			// 		'content-container@main': {
			// 			templateUrl: '/app/shared/views/content-container.view.html',
			// 			controller: 'homeContentContainerController',
			// 		},
			// 		'toolbar@main': {
			// 			templateUrl: '/app/shared/templates/toolbar.template.html',
			// 			controller: 'homeToolbarController',
			// 		},
			// 		'left-sidenav@main': {
			// 			templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
			// 		},
			// 		'content@main':{
			// 			templateUrl: '/app/components/app/templates/home.template.html',
			// 		}
			// 	}
			// })
			.state('main.slideshow', {
				url: 'slideshow/{slideshowID}',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/slideshow/create')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				params: {'slideshowID':null},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'slideshowContentContainerController',
					},
					'toolbar@main.slideshow': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'slideshowToolbarController',
					},
					'left-sidenav@main.slideshow': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.slideshow':{
						templateUrl: '/app/components/app/templates/content/slideshow-content.template.html',
					}
				}
			})
			// .state('main.posts', {
			// 	url: 'posts/{postID}',
			// 	params: {'postID':null},
			// 	views: {
			// 		'content-container': {
			// 			templateUrl: '/app/shared/views/content-container.view.html',
			// 			controller: 'postsContentContainerController',
			// 		},
			// 		'toolbar@main.posts': {
			// 			templateUrl: '/app/shared/templates/toolbar.template.html',
			// 			controller: 'postsToolbarController',
			// 		},
			// 		'left-sidenav@main.posts': {
			// 			templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
			// 		},
			// 		'content@main.posts':{
			// 			templateUrl: '/app/components/posts/templates/content/posts.template.html',
			// 		}
			// 	}
			// })
			.state('main.approvals', {
				url: 'approvals',
				// params: {'reservationID':null},
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
			.state('main.birthdays', {
				url: 'settings/birthdays',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/birthday/create')
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
						controller: 'birthdaysContentContainerController',
					},
					'toolbar@main.birthdays': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'birthdaysToolbarController',
					},
					'left-sidenav@main.birthdays': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.birthdays':{
						templateUrl: '/app/components/settings/templates/content/settings-content.template.html',
					}
				}
			})
			.state('main.upload', {
				url: 'settings/birthdays/upload',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/birthday/create')
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
						controller: 'uploadContentContainerController',
					},
					'toolbar@main.upload': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'uploadToolbarController',
					},
					'left-sidenav@main.upload': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.upload':{
						templateUrl: '/app/components/settings/templates/content/upload-content.template.html',
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
			.state('main.forms', {
				url: 'settings/forms',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/form/create')
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
						controller: 'formsContentContainerController',
					},
					'toolbar@main.forms': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'formsToolbarController',
					},
					'left-sidenav@main.forms': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.forms':{
						templateUrl: '/app/components/settings/templates/content/settings-content.template.html',
					}
				}
			})
			.state('main.locations', {
				url: 'settings/rooms',
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
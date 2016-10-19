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
	}]);
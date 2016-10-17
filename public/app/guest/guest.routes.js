guest
	.config(['$stateProvider', function($stateProvider){
		$stateProvider
			.state('wall', {
				url: '/',
				views: {
					'': {
						templateUrl: '/app/shared/views/main.view.html',
						controller: 'wallViewController',
					},
					'content-container@wall': {
						templateUrl: '/app/shared/views/content-container.view.html',
						// controller: 'dashboardContentContainerController',
					},
					'toolbar@wall': {
						templateUrl: '/app/guest/templates/toolbar.template.html',
					},
					'left-sidenav@wall': {
						templateUrl: '/app/guest/templates/sidenavs/wall-left-sidenav.template.html',
					},
					'content@wall':{
						templateUrl: '/app/guest/templates/content/wall-content.template.html',
					}
				}
			})
	}]);
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
						controller: 'homeContentContainerController',
					},
					'toolbar@wall': {
						templateUrl: '/app/guest/templates/toolbar.template.html',
						controller: 'homeToolbarController',
					},
					'content@wall':{
						templateUrl: '/app/components/app/templates/home.template.html',
					}
				}
			})
			.state('wall.posts', {
				url: 'posts/{postID}',
				params: {'postID':null},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'wallContentContainerController',
					},
					'toolbar@wall.posts': {
						templateUrl: '/app/guest/templates/toolbar.template.html',
						controller: 'wallToolbarController',
					},
					'content@wall.posts':{
						templateUrl: '/app/components/posts/templates/content/posts.template.html',
					}
				}
			})
			.state('wall.reservations', {
				url: 'reservations',
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'reservationsContentContainerController',
					},
					'toolbar@wall.reservations': {
						templateUrl: '/app/guest/templates/toolbar.template.html',
						controller: 'reservationsToolbarController',
					},
					'subheader@wall.reservations': {
						templateUrl: '/app/components/reservations/templates/subheaders/reservations-subheader.template.html',
						controller: 'reservationsSubheaderController',
					},
					'content@wall.reservations':{
						templateUrl: '/app/components/reservations/templates/content/reservations-content.template.html',
					}
				}
			})
	}]);
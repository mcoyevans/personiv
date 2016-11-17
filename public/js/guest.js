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
						controller: 'wallToolbarController',
					},
					'content@wall':{
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
guest
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
guest
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
					}

					$scope.refresh = function(){
						$scope.isLoading = true;

						Helper.set($scope.dateRange);

			            $scope.$broadcast('dateRange');

			  			$scope.init($scope.subheader.current);
					};
				});
		}
	}]);
guest
	.controller('reservationsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.current_tab = data;

			$scope.$emit('setInit');
		}

		$scope.subheader.all = {};

		$scope.subheader.all.label = 'All';

		$scope.subheader.all.request = {
			'with': [
				{
					'relation':'location',
					'withTrashed': false,
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
guest
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
	.controller('wallToolbarController', ['$scope', '$filter', function($scope, $filter){
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

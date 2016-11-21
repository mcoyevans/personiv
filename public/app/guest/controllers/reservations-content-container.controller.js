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

							if((item.schedule_approver_id && item.equipment_types_count && item.equipment_approver_id) || (item.schedule_approver_id && !item.equipment_types_count))
							{
								item.title = item.title + ' - ' + item.location.name;
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
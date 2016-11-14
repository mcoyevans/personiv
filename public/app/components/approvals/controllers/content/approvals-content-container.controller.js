app
	.controller('approvalsContentContainerController', ['$scope', 'Helper', function($scope, Helper){
		$scope.$emit('closeSidenav');

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		/*
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.show = true;
		$scope.subheader.current = {};

		$scope.subheader.mark = {};

		$scope.subheader.sort = [
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

		$scope.subheader.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

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
	    		'template':'/app/components/reservations/templates/dialogs/approved-reservation-dialog.template.html',
				'controller': 'approvedReservationDialogController',
	    	}

	    	Helper.customDialog(dialog);
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

  			$scope.init($scope.subheader.current);
		};
	}]);
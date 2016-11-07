app
	.controller('reservationsContentContainerController', ['$scope', 'Helper', function($scope, Helper){
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
		
		$scope.subheader.all = {};
		$scope.subheader.all.label = 'All';
		
		$scope.subheader.all.request = {
			'withTrashed':false,
		}
		
		$scope.subheader.all.fab = {
			'template':'/app/components/settings/templates/dialogs/reservation-dialog.template.html',
			'controller': 'reservationDialogController',
			'action':'create',
			'message': 'Reservation created',
			'location_id': location.id,
		}

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';

		/* Action originates from subheader */
		$scope.$on('setInit', function(){
			$scope.isLoading = true;
			$scope.$broadcast('close');
			$scope.showInactive = false;
			
			var current = Helper.fetch();

			if(current)
			{
				$scope.subheader.current = current;
				$scope.init(current);
			}
			else{
				$scope.subheader.current = $scope.subheader.all;
				$scope.init($scope.subheader.all);
			}
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

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			data.deleted_at =  data.deleted_at ? new Date(data.deleted_at) : null;
			data.created_at = new Date(data.created_at);
			data.start = new Date(data.start);
			data.end = new Date(data.end);

			var item = {};

			item.display = data.asset_tag;
			item.brand = data.brand;
			item.model = data.model;

			$scope.toolbar.items.push(item);
		}

		$scope.init = function(query, refresh){
			$scope.reservation = {};
			$scope.toolbar.items = [];

			Helper.post('/reservation/enlist', query.request)
				.success(function(data){
					$scope.reservation.items = data.data;
					$scope.reservation.show = true;

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

					if(data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.reservation.show = false;

  			$scope.init($scope.subheader.current);
		};
	}]);
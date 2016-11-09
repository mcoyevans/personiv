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
			'message': 'Reservation created',
		}

		$scope.subheader.all.request = {
			'withTrashed':false,
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
							'withTrashed': false,
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
app
	.controller('reservationDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.reservation = {};

		$scope.reservation.equipment_types = [];

		$scope.reservation.date_start = new Date();
		$scope.reservation.time_start = new Date();
		$scope.reservation.date_end = new Date();
		$scope.reservation.time_end = new Date();

		$scope.min_start_time = new Date();
		$scope.min_start_date = new Date();

		$scope.min_end_time = new Date();

		$scope.setDateStart = function(){
			$scope.reservation.time_start.setMonth($scope.reservation.date_start.getMonth());
			$scope.reservation.time_start.setDate($scope.reservation.date_start.getDate());
			$scope.reservation.time_start.setFullYear($scope.reservation.date_start.getFullYear());

			$scope.reservation.time_start = new Date($scope.reservation.time_start);

			$scope.min_end_time = new Date($scope.reservation.time_start);

			if($scope.reservation.time_start > $scope.reservation.time_end)
			{
				$scope.reservation.time_end = new Date($scope.reservation.time_start);
			}

			if($scope.reservation.date_start > $scope.reservation.date_end)
			{
				$scope.reservation.date_end = new Date($scope.reservation.date_start);				
			}
		}

		$scope.setDateEnd = function(){
			$scope.reservation.time_end.setMonth($scope.reservation.date_end.getMonth());
			$scope.reservation.time_end.setDate($scope.reservation.date_end.getDate());
			$scope.reservation.time_end.setFullYear($scope.reservation.date_end.getFullYear());

			$scope.reservation.time_end = new Date($scope.reservation.time_end);

			if($scope.reservation.time_start > $scope.reservation.time_end)
			{
				$scope.reservation.time_end = new Date($scope.reservation.time_start);
			}
		}

		$scope.timeStartChanged = function(){
			$scope.min_end_time = new Date($scope.reservation.time_start);

			if($scope.reservation.time_start > $scope.reservation.time_end)
			{
				$scope.reservation.time_end = new Date($scope.reservation.time_start);
			}

			$scope.checkEquipment($scope.reservation.time_start, $scope.reservation.time_end);
		} 

		$scope.timeEndChanged = function(){			
			$scope.checkEquipment($scope.reservation.time_start, $scope.reservation.time_end);
		}

		$scope.allDay = function(){
			if($scope.reservation.allDay)
			{
				$scope.reservation.time_start.setHours(0,0,0,0);

				$scope.reservation.time_start = new Date($scope.reservation.time_start);
				
				$scope.reservation.time_end.setHours(0,0,0,0);

				$scope.reservation.time_end = new Date($scope.reservation.time_end);
			}
			else{
				$scope.reservation.time_start = new Date();
				$scope.reservation.time_end = new Date();
				$scope.min_start_time = new Date();
				$scope.min_start_date = new Date();

				$scope.min_end_time = new Date();
			}
		}

		$scope.checkEquipment = function(start, end){
			var request = {
				'with': [
					{
						'relation': 'equipment',
						'withTrashed': false,
						'whereDoesntHave': {
							'relation': 'reservations',
							'whereNull': ['schedule_approver_id' ,'equipment_approver_id'],
							'whereBetween': {
								'label': 'start',
								'start': start,
								'end': end,
							}
						},
					}
				]
			}

			Helper.post('/equipment-type/enlist', request)
				.success(function(data){
					$scope.equipment_types = data
				});
		}
		
		$scope.checkEquipment($scope.reservation.time_start, $scope.reservation.time_end);

		$scope.busy = false;

		Helper.get('/location')
			.success(function(data){
				$scope.locations = data;
			});


		// Helper.get('/equipment-type')
		// 	.success(function(data){
		// 		$scope.equipment_types = data;
		// 	})

		if($scope.config.action == 'edit')
		{
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
						'relation': 'equipment',
						'withTrashed': false,
					},
				],
				'where': [
					{
						'label': 'id',
						'condition': '=',
						'value': config.id,
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
		}

		$scope.submit = function(){
			if($scope.reservationForm.$invalid){
				angular.forEach($scope.reservationForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			$scope.busy = true;

			$scope.reservation.date_start = $scope.reservation.date_start.toDateString();
			$scope.reservation.date_end = $scope.reservation.date_end.toDateString();

			$scope.reservation.time_start = $scope.reservation.time_start.toLocaleTimeString();
			$scope.reservation.time_end = $scope.reservation.time_end.toLocaleTimeString();

			if($scope.config.action == 'create')
			{
				Helper.post('/reservation', $scope.reservation)
					.success(function(){
						Helper.stop();
					})
					.error(function(){
						$scope.busy = false;
						$scope.error = true;

						$scope.reservation.date_start = new Date($scope.reservation.date_start);
						$scope.reservation.date_end = new Date($scope.reservation.date_end);
						$scope.reservation.time_start = new Date($scope.reservation.time_start);
						$scope.reservation.time_end = new Date($scope.reservation.time_end);
					});
			}
			else if($scope.config.action == 'edit')
			{
				Helper.put('/reservation' + '/' + $scope.config.id, $scope.reservation)
					.success(function(){
						Helper.stop();
					})
					.error(function(){
						$scope.busy = false;
						$scope.error = true;

						$scope.reservation.time_start = new Date($scope.reservation.time_start);
						$scope.reservation.time_end = new Date($scope.reservation.time_end);
					});
			}
		}
	}]);
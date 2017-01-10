app
	.controller('reservationDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.repetitions = ['Daily', 'Weekly', 'Monthly'];

		$scope.duplicate = false;

		$scope.fallback = {};

		$scope.reservation = {};

		$scope.reservation.equipment_types = [];

		$scope.current = new Date();

		if($scope.current.getMinutes() < 30)
		{
			$scope.current.setMinutes(30);
		}
		else if($scope.current.getMinutes() > 30)
		{
			$scope.current.setHours($scope.current.getHours() + 1);
			$scope.current.setMinutes(0);
		}

		$scope.reservation.date_start = new Date();
		$scope.reservation.time_start = $scope.current;
		$scope.reservation.date_end = new Date();
		$scope.reservation.time_end = $scope.current;

		var formatDateToObject = function(){
			$scope.fallback.date_start = new Date($scope.reservation.date_start);
			$scope.fallback.date_end = new Date($scope.reservation.date_end);
			$scope.fallback.time_start = new Date($scope.reservation.time_start);
			$scope.fallback.time_end = new Date($scope.reservation.time_end);
			$scope.fallback.until = $scope.reservation.until ? new Date($scope.reservation.until) : null;
		}

		var fallbackDateToObject = function(){
			$scope.reservation.date_start = new Date($scope.fallback.date_start);
			$scope.reservation.date_end = new Date($scope.fallback.date_end);
			$scope.reservation.time_start = new Date($scope.fallback.time_start);
			$scope.reservation.time_end = new Date($scope.fallback.time_end);
			$scope.reservation.until = $scope.fallback.until ? new Date($scope.fallback.until) : null;
		}

		$scope.setUntil = function(){
			$scope.reservation.until = new Date();
		}

		$scope.setRepeat = function(){
			if(!$scope.repeat)
			{
				$scope.reservation.repeat = null;
				$scope.reservation.until = null;
			}
		}

		$scope.checkDuplicate = function(){
			if($scope.reservation.location_id)
			{				
				var request = {};

				request.location_id = $scope.reservation.location_id;
				request.date_start = new Date($scope.reservation.date_start).toDateString();
				request.date_end = new Date($scope.reservation.date_end).toDateString();
				request.time_start = new Date($scope.reservation.time_start).toLocaleTimeString();
				request.time_end = new Date($scope.reservation.time_end).toLocaleTimeString();

				if($scope.reservation.until)
				{
					request.repeat = $scope.reservation.repeat;
					request.until = new Date($scope.reservation.until).toDateString();
				}

				if($scope.reservation.id)
				{
					request.id = $scope.reservation.id;
				}

				Helper.post('/reservation/check-duplicate', request)
					.success(function(data){
						$scope.duplicate = data;
					});
			}
		}

		$scope.locationChange = function(){
			$scope.checkDuplicate();
		}

		$scope.setDateStart = function(){
			$scope.reservation.time_start.setMonth($scope.reservation.date_start.getMonth());
			$scope.reservation.time_start.setDate($scope.reservation.date_start.getDate());
			$scope.reservation.time_start.setFullYear($scope.reservation.date_start.getFullYear());

			$scope.reservation.time_start = new Date($scope.reservation.time_start);

			$scope.min_end_time = new Date($scope.reservation.time_start);

			if($scope.min_end_time >= $scope.reservation.time_end)
			{
				$scope.reservation.time_end = new Date($scope.min_end_time);
			}

			if($scope.reservation.time_start > $scope.reservation.time_end)
			{
				$scope.reservation.time_end = new Date($scope.reservation.time_start);
			}

			if($scope.reservation.date_start > $scope.reservation.date_end)
			{
				$scope.reservation.date_end = new Date($scope.reservation.date_start);				
			}

			$scope.checkDuplicate();
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

			$scope.checkDuplicate();
		}

		$scope.timeStartChanged = function(){
			$scope.min_end_time = new Date($scope.reservation.time_start);

			if($scope.reservation.time_start > $scope.reservation.time_end)
			{
				$scope.reservation.time_end = new Date($scope.reservation.time_start);
			}

			$scope.checkEquipment($scope.reservation.time_start, $scope.reservation.time_end);

			$scope.checkDuplicate();
		} 

		$scope.timeEndChanged = function(){			
			$scope.checkDuplicate();
			$scope.checkEquipment($scope.reservation.time_start, $scope.reservation.time_end);
		}

		$scope.allDay = function(){
			if($scope.reservation.allDay)
			{
				$scope.reservation.time_start.setHours(0,0,0,0);

				$scope.reservation.time_start = new Date($scope.reservation.time_start);
				
				$scope.reservation.time_end.setHours(23,59,59);

				$scope.reservation.time_end = new Date($scope.reservation.time_end);
			}
			else{
				$scope.reservation.time_start = new Date();
				$scope.reservation.time_end = new Date();
				$scope.min_start_time = new Date();
				$scope.min_start_date = new Date();

				$scope.min_end_time = new Date();
			}

			$scope.checkDuplicate();
		}

		$scope.checkEquipment = function(start, end){
			var date = {
				'start': new Date(start).toDateString() + ' ' + new Date(start).toLocaleTimeString(),
				'end': new Date(end).toDateString() + ' ' + new Date(end).toLocaleTimeString(),
			}

			var request = {
				'with': [
					{
						'relation': 'equipment',
						'withTrashed': false,
						'whereDoesntHave': {
							'relation': 'reservations',
							'whereNotNull': ['schedule_approver_id' ,'equipment_approver_id'],
							'whereBetween': {
								'label': 'start',
								'start': date.start,
								'end': date.end,
							}
						},
					}
				]
			}

			Helper.post('/equipment-type/enlist', request)
				.success(function(data){
					$scope.equipment_types = data
					// $scope.count = data.length;

					if($scope.config.action == 'edit')
					{
						angular.forEach($scope.equipment_types, function(item, key){
							$scope.reservation.equipment_types.push(null);

							var query = {};
							query.with = [
								{
									'relation': 'equipment_type.equipment',
									'withTrashed': false,
								}
							];
							query.where = [
								{
									'label': 'reservation_id',
									'condition': '=',
									'value': $scope.reservation.id,
								},
								{
									'label': 'equipment_type_id',
									'condition': '=',
									'value': item.id,
								},
							];
							query.first = true;

							Helper.post('/reservation-equipment/enlist', query)
								.success(function(data){
									if(data)
									{
										$scope.reservation.equipment_types[key] = data.equipment_type;
									}
								});
						});
					}
				});
		}
		
		$scope.busy = false;

		Helper.get('/location')
			.success(function(data){
				$scope.locations = data;
			});

		if($scope.config.action == 'create')
		{
			$scope.min_start_time = new Date();
			$scope.min_start_date = new Date();

			$scope.min_end_time = new Date();

			$scope.checkEquipment($scope.reservation.time_start, $scope.reservation.time_end);
		}

		if($scope.config.action == 'edit')
		{
			var request = {
				'where': [
					{
						'label': 'id',
						'condition': '=',
						'value': $scope.config.id,
					},
				],
				'first' : true,
			}

			Helper.post('/reservation/enlist', request)
				.success(function(data){
					data.start = new Date(data.start);
					data.end = data.end ? new Date(data.end) : null;

					$scope.reservation = data;
					$scope.reservation.equipment_types = [];
					
					$scope.reservation.allDay = data.allDay ? true : false;

					$scope.reservation.date_start = new Date(data.start);
					$scope.reservation.date_end = new Date(data.end);

					$scope.reservation.time_start = new Date(data.start);
					$scope.reservation.time_end = new Date(data.end);

					$scope.min_start_time = new Date();
					$scope.min_start_date = new Date();

					$scope.min_end_time = new Date();

					$scope.checkEquipment($scope.reservation.time_start, $scope.reservation.time_end);
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

			if(!$scope.duplicate)
			{			
				$scope.busy = true;

				formatDateToObject();

				$scope.reservation.date_start = $scope.reservation.date_start.toDateString();
				$scope.reservation.date_end = $scope.reservation.date_end.toDateString();
				$scope.reservation.time_start = $scope.reservation.time_start.toLocaleTimeString();
				$scope.reservation.time_end = $scope.reservation.time_end.toLocaleTimeString();
				$scope.reservation.until = $scope.reservation.until ? $scope.reservation.until.toDateString() : null;

				if($scope.config.action == 'create')
				{
					Helper.post('/reservation', $scope.reservation)
						.success(function(duplicate){
							if(!duplicate)
							{
								Helper.stop();
							}
							else{
								$scope.busy = false;
								$scope.duplicate = duplicate;
								
								fallbackDateToObject();
							}
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;

							fallbackDateToObject();
						});
				}
				else if($scope.config.action == 'edit')
				{
					Helper.put('/reservation' + '/' + $scope.config.id, $scope.reservation)
						.success(function(duplicate){
							if(!duplicate)
							{
								Helper.stop();
							}
							else{
								$scope.busy = false;
								$scope.duplicate = duplicate;

								fallbackDateToObject();
							}
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;

							fallbackDateToObject();
						});
				}
			}
		}
	}]);
app
	.controller('approvalDialogController', ['$scope', 'Helper', function($scope, Helper){
		var reservation = Helper.fetch();

		Helper.post('/user/check')
			.success(function(data){
				$scope.approver = data;
			});

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.checkDuplicate = function(equipment){
			Helper.post('/reservation-equipment/check-duplicate', equipment)
				.success(function(data){
					if(data)
					{
						$scope.duplicate = data;
						equipment.duplicate = data;
					}
				});
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
					'available_units': true,
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

		$scope.submit = function(){
			if($scope.approvalForm.$invalid){
				angular.forEach($scope.approvalForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				// IT
				if($scope.approver.group_id == 1){
					Helper.post('/reservation-equipment/approve', $scope.reservation.equipment_types)
						.success(function(data){
							if(!data){
								Helper.stop();
							}
							else{
								$scope.error = true;
							}
						})
						.error(function(){
							$scope.error = true;
						})
				}
			}

			if($scope.approver.group_id == 2){
				Helper.post('/reservation/approve', $scope.reservation)
					.success(function(data){
						if(!data){
							Helper.stop();
						}
						else{
							$scope.error = true;
						}
					})
					.error(function(){
						$scope.error = true;
					})
			}
		}
	}]);
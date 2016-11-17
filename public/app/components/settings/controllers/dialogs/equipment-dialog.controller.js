app
	.controller('equipmentDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		if($scope.config.action == 'create')
		{
			$scope.equipment = {};
			$scope.equipment.equipment_type_id = $scope.config.equipment_type_id;
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get('/equipment' + '/' + $scope.config.id)
				.success(function(data){
					$scope.equipment = data;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/equipment' + '/check-duplicate', $scope.equipment)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.equipmentForm.$invalid){
				angular.forEach($scope.equipmentForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				if($scope.config.action == 'create')
				{
					Helper.post('/equipment', $scope.equipment)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
				else if($scope.config.action == 'edit')
				{
					Helper.put('/equipment' + '/' + $scope.config.id, $scope.equipment)
						.success(function(duplicate){
							if(duplicate){
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;
						});
				}
			}
		}
	}]);
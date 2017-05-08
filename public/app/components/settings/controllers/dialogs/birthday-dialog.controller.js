app
	.controller('birthdayDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		$scope.today = new Date();

		if($scope.config.action == 'create')
		{
			$scope.model = {};
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get('/birthday' + '/' + $scope.config.id)
				.success(function(data){
					data.birthdate = new Date(data.birthdate);
					$scope.model = data;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/birthday' + '/check-duplicate', $scope.model)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.modelForm.$invalid){
				angular.forEach($scope.modelForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				$scope.model.birthdate = $scope.model.birthdate.toLocaleDateString();

				if($scope.config.action == 'create')
				{
					Helper.post('/birthday', $scope.model)
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
							$scope.model.birthdate = new Date($scope.model.birthdate);
						});
				}
				else if($scope.config.action == 'edit')
				{
					Helper.put('/birthday' + '/' + $scope.config.id, $scope.model)
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
							$scope.model.birthdate = new Date($scope.model.birthdate);
						});
				}
			}
		}
	}]);
app
	.controller('reservationsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			if(data){
				Helper.set(data);

				$scope.current_tab = data;
			}
			else {
				$scope.current_tab = $scope.subheader.all;
			}

			console.log($scope.current_tab);

			$scope.$emit('setInit');
		}

		$scope.subheader.all.action = function(){
			setInit();
		}

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
							'where': [
								{
									'label':'location_id',
									'condition':'=',
									'value': location.id,
								},
							],
						}
						item.fab = {
							'template':'/app/components/settings/templates/dialogs/reservation-dialog.template.html',
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

					setInit();
				})
		}

		$scope.init();
	}]);
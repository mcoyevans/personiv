app
	.controller('equipmentsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.current_tab = data;

			$scope.$emit('setInit');
		}

		$scope.subheader.create = function(){
			var dialog = {};
			dialog.template = '/app/components/settings/templates/dialogs/equipment-type-dialog.template.html';
			dialog.controller = 'equipmentTypeDialogController';
			dialog.action = 'create';

			Helper.set(dialog);

			Helper.customDialog(dialog)
				.then(function(){
					$scope.init();
					Helper.notify('Equipment type created.');
				}, function(){
					return;
				});
		}

		$scope.subheader.update = function(){
			var dialog = {};
			dialog.template = '/app/components/settings/templates/dialogs/equipment-type-dialog.template.html';
			dialog.controller = 'equipmentTypeDialogController';
			dialog.action = 'edit';
			dialog.id = $scope.current_tab.id;

			Helper.set(dialog);

			Helper.customDialog(dialog)
				.then(function(){
					$scope.init();
					Helper.notify('Equipment type updated.');
				}, function(){
					return;
				});
		}

		$scope.subheader.delete = function(){
			var dialog = {};
			dialog.title = 'Delete';
			dialog.message = 'Delete ' + $scope.current_tab.label + '?'
			dialog.ok = 'Delete';
			dialog.cancel = 'Cancel';

			Helper.confirm(dialog)
				.then(function(){
					Helper.delete('/equipment-type/' + $scope.current_tab.id)
						.success(function(){
							$scope.init();
							Helper.notify('Equipment type deleted.');
						})
						.error(function(){
							Helper.error();
						});
				}, function(){
					return;
				})
		}

		$scope.init = function(){
			var query = {};
			query.withCount = [
				{
					'relation':'equipments',
					'withTrashed': false,
				}
			];

			Helper.post('/equipment-type/enlist', query)
				.success(function(data){
					$scope.equipment_types = data;
					$scope.subheader.navs = [];
					
					angular.forEach($scope.equipment_types, function(equipment_type){
						var item = {};

						item.id = equipment_type.id;
						item.equipments_count = equipment_type.equipments_count;
						item.label = equipment_type.name;
						item.request = {
							'where': [
								{
									'label':'equipment_type_id',
									'condition':'=',
									'value': equipment_type.id,
								},
							],
							'paginate':20,
						}
						item.fab = {
							'template':'/app/components/settings/templates/dialogs/equipment-dialog.template.html',
							'controller': 'equipmentDialogController',
							'action':'create',
							'message': 'Equipment created',
							'equipment_type_id': equipment_type.id,
						}
						item.action = function(current){
							setInit(current);
						}

						$scope.subheader.navs.push(item);
					});

					setInit($scope.subheader.navs[0]);
				})
		}

		$scope.init();
	}]);
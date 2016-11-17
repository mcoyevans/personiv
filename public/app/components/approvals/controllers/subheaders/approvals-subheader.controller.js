app
	.controller('approvalsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.current_tab = data;

			$scope.$emit('setInit');
		}

		var today = new Date().toDateString();

		$scope.subheader.all = {};

		$scope.subheader.all.label = 'All';

		$scope.subheader.all.request = {
			'with': [
				{
					'relation':'location',
					'withTrashed': true,
				},
				{
					'relation':'user',
					'withTrashed': true,
				},
				{
					'relation':'schedule_approver',
					'withTrashed': true,
				},
				{
					'relation':'equipment_approver',
					'withTrashed': true,
				},
			],
			'where': [],
			'approvals': true,
			'paginate': 10,
		}

		$scope.subheader.all.action = function(){
			setInit($scope.subheader.all);
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
							'with': [
								{
									'relation':'location',
									'withTrashed': true,
								},
								{
									'relation':'user',
									'withTrashed': true,
								},
								{
									'relation':'schedule_approver',
									'withTrashed': true,
								},
								{
									'relation':'equipment_approver',
									'withTrashed': true,
								},
							],
							'where': [
								{
									'label':'location_id',
									'condition':'=',
									'value': location.id,
								},
							],
							'approvals': true,
							'paginate': 10,
						}
						item.menu = $scope.subheader.all.menu,
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
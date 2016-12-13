app
	.controller('uploadContentContainerController', ['$scope', '$filter', '$state', 'FileUploader', 'Helper', function($scope, $filter, $state, FileUploader, Helper){
		$scope.toolbar = {};
		$scope.form = {};

		$scope.toolbar.items = [];
		$scope.toolbar.childState = 'Upload';

		$scope.toolbar.getItems = function(query){
			$scope.showInactive = true;
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			$scope.searchBar = false;
		};

		/**
		 * Object for fab
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Upload';

		var uploader = {};

		uploader.filter = {
            name: 'excelFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|vnd.openxmlformats-officedocument.spreadsheetml.sheet|vnd.ms-excel|'.indexOf(type) !== -1;
            }
        };

        uploader.error = function(item /*{File|FileLikeObject}*/, filter, options) {
            $scope.fileError = true;
            $scope.excelUploader.queue = [];
        };

        uploader.headers = { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')};

		/* Question Uploader */
		$scope.excelUploader = new FileUploader({
			url: '/upload',
			headers: uploader.headers,
			queueLimit : 1
		})
		// FILTERS
        $scope.excelUploader.filters.push(uploader.filter);
        
		$scope.excelUploader.onWhenAddingFileFailed = uploader.error;
		$scope.excelUploader.onAfterAddingFile  = function(){
			$scope.fileError = false;
			if($scope.excelUploader.queue.length)
			{	
				$scope.excelUploader.uploadAll()
			}
		};

		$scope.checkDuplicate = function(data){
			var nextLoop = true;
			var idx = $scope.employees.indexOf(data);
			var duplicate = false;
			// checks for duplicate file name within the form.
			angular.forEach($scope.employees, function(employee, key){
				if(nextLoop && key != idx){
					if(data.employee_number == employee.employee_number){
						duplicate = true;
						nextLoop = false;
					}
				}
			});

			if(duplicate){
				return data.duplicate = true;
			}
			else{
				data.duplicate = false;
			}

			Helper.post('/birthday/check-duplicate', data)
				.success(function(bool){
					data.duplicate = bool;
				});
		}

		$scope.remove = function(data){
			var confirm = {
				'title':'Remove',
				'message':'Remove ' + data.full_name + ' from the list?',
				'ok':'Remove',
				'cancel':'Cancel'
			}

			Helper.confirm(confirm).then(function() {
		      	var idx = $scope.employees.indexOf(data);
				$scope.employees.splice(idx, 1);
		    }, function() {
		      	return;
		    });
		}

		var pushItem = function(data){
			angular.forEach(data, function(item, idx){
				item.birthdate = new Date(item.birthdate);
				var nextLoop = true;
				// compare current item with other items on the array
				angular.forEach(data, function(other, key){
					if(nextLoop && idx != key)
					{
						if(item.employee_number == other.employee_number){
							item.duplicate = true;
							nextLoop = false;
						}
					}
				})

				$scope.employees.push(item);

				var filter = {};

				filter.display = item.full_name;

				$scope.toolbar.items.push(filter);
			});
		}

		$scope.excelUploader.onSuccessItem  = function(data, response){			
			$scope.employees = [];

			if(Array.isArray(response[0]))
			{
				angular.forEach(response, function(sheet){
					angular.forEach(sheet, function(item){
						$scope.employees.push(item);
					})
				});
			}
			else {
				angular.forEach(response, function(item){
					$scope.employees.push(item);
				})
			}
			
			Helper.post('/birthday/check-duplicate-multiple', $scope.employees)
				.success(function(data){
					pushItem(data);
					$scope.employees = data;
					$scope.show = true;
				})
				.error(function(){
					Helper.error();
				})

			$scope.fab.show = true;
		}

		var busy = false;
		
		$scope.fab.action = function(){
			var duplicate = false;

			if($scope.form.employeeForm.$invalid){
				angular.forEach($scope.form.employeeForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			angular.forEach($scope.employees, function(item){
				if(item.duplicate){
					Helper.alert('Duplicate Employee', item.employee_number +' already exists.');
					duplicate = true;
					return;
				}
				// else{
				// 	item.delivery_date = item.delivery_date.toDateString();
				// 	item.live_date = item.live_date.toDateString();
				// }
			});

			if(!busy && !duplicate){
				busy = true;
				Helper.preload();

				angular.forEach($scope.employees, function(item){
					item.birthdate = item.birthdate.toLocaleDateString();
				});

				Helper.post('/birthday/store-multiple', $scope.employees)
					.success(function(data){
						busy = false;
						Helper.stop();
						$state.go('main.birthdays');
					})
					.error(function(){
						angular.forEach($scope.employees, function(item){
							item.birthdate = new Date(item.birthdate);
						});
						Helper.error();
						busy = false;
					});
			}
		};
	}]);
app
	.controller('mainViewController', ['$scope', '$filter', '$state', '$mdDialog', '$mdSidenav', '$mdToast', 'Helper', 'FileUploader', function($scope, $filter, $state, $mdDialog, $mdSidenav, $mdToast, Helper, FileUploader){
		$scope.toggleSidenav = function(menuID){
			$mdSidenav(menuID).toggle();
		}

		$scope.menu = {};
		$scope.menu.pages = [];

		$scope.menu.static = [
			{
				'state': 'main',
				'icon': 'mdi-bulletin-board',
				'label': 'Posts',
			},
			{
				'state': 'main.reservations',
				'icon': 'mdi-format-list-numbers',
				'label': 'Reservations',
			},
		];

		$scope.menu.section = [
			{
				'name':'Apps',
				'icon':'mdi-application',
			},
		];

		// set section as active
		$scope.setActive = function(index){
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').toggleClass('active'));
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').siblings().removeClass('active'));
		};
		
		$scope.logout = function(){
			Helper.post('/user/logout')
				.success(function(){
					window.location.href = '/';
				});
		}

		$scope.changePassword = function()
		{
			$mdDialog.show({
		      controller: 'changePasswordDialogController',
		      templateUrl: '/app/shared/templates/dialogs/change-password-dialog.template.html',
		      parent: angular.element(document.body),
		      fullscreen: true,
		    })
		    .then(function(){
		    	Helper.notify('Password changed.')
		    });
		}

		var uploader = {};

		uploader.filter = {
            name: 'photoFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        uploader.sizeFilter = {
		    'name': 'enforceMaxFileSize',
		    'fn': function (item) {
		        return item.size <= 2000000;
		    }
        }

        uploader.error = function(item /*{File|FileLikeObject}*/, filter, options) {
            $scope.fileError = true;
            $scope.photoUploader.queue = [];
        };

        uploader.headers = { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')};

		$scope.clickUpload = function(){
		    angular.element('#upload').trigger('click');
		};

		Helper.post('/user/check')
			.success(function(data){
				var settings = false;
				var settings_menu = [];

				angular.forEach(data.roles, function(role){
					if(role.name == 'approvals')
					{
						var item = {
							'state': 'main.approvals',
							'icon': 'mdi-clipboard-check',
							'label': 'Approvals',
						}

						$scope.menu.static[2] = item;
					}
					else if(role.name == 'manage-groups')
					{
						settings = true;

						var item = {
							'label': 'Groups',
							action: function(){
								$state.go('main.groups');
							},
						}

						settings_menu.push(item);
					}
					else if(role.name == 'manage-users')
					{
						settings = true;

						var item = {
							'label': 'Users',
							action: function(){
								$state.go('main.users');
							},
						}

						settings_menu.push(item); 
					}
					else if(role.name == 'manage-locations')
					{
						settings = true;

						var item = {
							'label': 'Locations',
							action: function(){
								$state.go('main.locations');
							},
						}

						settings_menu.push(item); 
					}
					else if(role.name == 'manage-equipments')
					{
						settings = true;

						var item = {
							'label': 'Equipments',
							action: function(){
								$state.go('main.equipments');
							},
						}

						settings_menu.push(item); 
					}
					else if(role.name == 'manage-links')
					{
						settings = true;

						var item = {
							'label': 'Links',
							action: function(){
								$state.go('main.links');
							},
						}

						settings_menu.push(item); 
					}

				});

				if(settings)
				{
					$scope.menu.section[1] = {
						'name':'Settings',
						'icon':'mdi-settings',
					}

					$scope.menu.pages[1] = settings_menu;
				}

				$scope.user = data;
				$scope.currentTime = Date.now();

				Helper.setAuthUser(data);

				/* Photo Uploader */
				$scope.photoUploader = new FileUploader({
					url: '/user/upload-avatar/' + $scope.user.id,
					headers: uploader.headers,
					queueLimit : 1
				})

				// FILTERS
		        $scope.photoUploader.filters.push(uploader.filter);
		        $scope.photoUploader.filters.push(uploader.sizeFilter);
		        
				$scope.photoUploader.onWhenAddingFileFailed = uploader.error;
				$scope.photoUploader.onAfterAddingFile  = function(){
					$scope.fileError = false;
					if($scope.photoUploader.queue.length)
					{	
						$scope.photoUploader.uploadAll()
					}
				};

				$scope.photoUploader.onCompleteItem  = function(data, response){
					$scope.currentTime = Date.now();
					$scope.photoUploader.queue = [];
				}
			})

		Helper.get('/link')
			.success(function(data){
				var links = [];

				angular.forEach(data, function(link){
					var item = {};

					item.label = link.name;	
					item.action = function(){
						window.open(link.link);
					}

					links.push(item);
				});
				
				$scope.menu.pages[0] = links;
			})

		$scope.$on('closeSidenav', function(){
			$mdSidenav('left').close();
		});
	}]);
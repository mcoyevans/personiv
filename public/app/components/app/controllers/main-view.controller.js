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
				'icon': 'mdi-home',
				'label': 'Home',
			},
			// {
			// 	'state': 'main.posts',
			// 	'icon': 'mdi-bulletin-board',
			// 	'label': 'Posts',
			// },
			{
				'state': 'main.reservations',
				'icon': 'mdi-format-list-numbers',
				'label': 'Training Room Reservations',
			},
			{
				'state': 'main.notifications',
				'icon': 'mdi-bell',
				'label': 'Notifications',
			},
		];

		$scope.menu.section = [
			{
				'name':'Apps',
				'icon':'mdi-application',
			},
			{
				'name':'Forms',
				'icon':'mdi-file-document',
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

		$scope.markAllAsRead = function(){
			Helper.post('/user/mark-all-as-read')
				.success(function(){
					$scope.user.unread_notifications = [];
				})
		}

		var fetchUnreadNotifications = function(){
			Helper.post('/user/check')
	    		.success(function(data){
	    			$scope.user = data;
	    		});
		}

		Helper.post('/user/check')
			.success(function(data){
				var settings = false;
				var settings_menu = [];

				angular.forEach(data.roles, function(role){
					if(role.name == 'posts')
					{
						data.can_post = true;
					}
					else if(role.name == 'approvals')
					{
						var item = {
							'state': 'main.approvals',
							'icon': 'mdi-clipboard-check',
							'label': 'Approvals',
						}

						$scope.menu.static.push(item);
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
							'label': 'Rooms',
							action: function(){
								$state.go('main.locations');
							},
						}

						settings_menu.push(item); 
					}
					else if(role.name == 'manage-equipment')
					{
						settings = true;

						var item = {
							'label': 'Equipment',
							action: function(){
								$state.go('main.equipment');
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
					else if(role.name == 'manage-birthdays')
					{
						settings = true;

						var item = {
							'label': 'Birthdays',
							action: function(){
								$state.go('main.birthdays');
							},
						}

						settings_menu.push(item); 
					}
					else if(role.name == 'manage-forms')
					{
						settings = true;

						var item = {
							'label': 'Forms',
							action: function(){
								$state.go('main.forms');
							},
						}

						settings_menu.push(item); 
					}
				});

				if(settings)
				{
					$scope.menu.section[2] = {
						'name':'Settings',
						'icon':'mdi-settings',
					}

					$scope.menu.pages[2] = settings_menu;
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
					if($scope.user.avatar_path)
					{
						$scope.currentTime = Date.now();
						$scope.photoUploader.queue = [];
					}
					else{
						$state.go($state.current, {}, {reload:true});
					}
				}

				var pusher = new Pusher('0521fe41d7482726355c', {
			      	encrypted: true,
			      	auth: {
					    headers: {
					      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
					    }
				  	}
			    });

				var channel = {};

				channel.user = pusher.subscribe('private-App.User.' + $scope.user.id);

				channel.user.bindings = [
				 	channel.user.bind('Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', function(data) {
				 		// formating the notification
				 		data.created_at = data.attachment.created_at;

				 		data.data = {};
				 		data.data.attachment = data.attachment;
				 		data.data.url = data.url;
				 		data.data.withParams = data.withParams;
				 		data.data.sender = data.sender;
				 		data.data.message = data.message;

				 		// pushes the new notification in the unread_notifications array
				 		$scope.$apply(function(){
					    	$scope.user.unread_notifications.unshift(data);
				 		});

				 		// notify the user with a toast message
				 		Helper.notify(data.sender.name + ' ' + data.message);

				 		if($state.current.name == data.data.url)
						{
							$state.go($state.current, {}, {reload:true});
						}
				    }),
				];
			})

		$scope.markAsRead = function(notification){
			Helper.post('/user/mark-as-read', notification)
				.success(function(){
					var index = $scope.user.unread_notifications.indexOf(notification);

					$scope.user.unread_notifications.splice(index, 1);
				})
				.error(function(){
					Helper.error();
				});
		}

		$scope.read = function(notification){			
			$state.go(notification.data.url);

			if(notification.type == 'App\\Notifications\\PostCreated' || notification.type == 'App\\Notifications\\RepostCreated')
			{	
				// $state.go(notification.data.url, {'postID':notification.data.attachment.id});
				Helper.set(notification.data.attachment.id);
				$scope.$broadcast('read-post');
			}
			else if(notification.type == 'App\\Notifications\\CommentCreated')
			{
				// $state.go(notification.data.url, {'postID':notification.data.attachment.post_id});
				Helper.set(notification.data.attachment.post_id);
				$scope.$broadcast('read-post-and-comments');
			}

			else if(notification.type == 'App\\Notifications\\ReservationCreated')
			{
				// $state.go(notification.data.url, {'reservationID':notification.data.attachment.id});
				Helper.set(notification.data.attachment.id);
				$scope.$broadcast('read-approval');
			}
			

			$scope.markAsRead(notification);
		}


		$scope.fetchLinks = function(){		
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
		}

		$scope.fetchForms = function(){		
			Helper.get('/form')
				.success(function(data){
					var forms = [];

					angular.forEach(data, function(form){
						var item = {};

						item.label = form.name;	
						item.action = function(){
							window.open('/form/' + form.id);
						}

						forms.push(item);
					});
					
					$scope.menu.pages[1] = forms;
				})
		}

		$scope.fetchLinks();
		$scope.fetchForms();

		$scope.$on('closeSidenav', function(){
			$mdSidenav('left').close();
		});

		$scope.$on('fetchLinks', function(){
			$scope.fetchLinks();
		});

		$scope.$on('fetchForms', function(){
			$scope.fetchForms();
		});
	}]);
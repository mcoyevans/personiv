app
	.controller('postDialogController', ['$scope', 'Helper', 'FileUploader', function($scope, Helper, FileUploader){
		$scope.config = Helper.fetch();

		var query = {};

		query.self_group = true;

		Helper.post('/group/enlist', query)
			.success(function(data){
				$scope.groups = data;
			});

		$scope.repost = {};

		$scope.post = {};
		$scope.post.group_id = 'all';
		$scope.post.chips = [];

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
		        return item.size <= 10485760;
		    }
        }

        uploader.error = function(item /*{File|FileLikeObject}*/, filter, options) {
            $scope.fileError = true;
            $scope.postPhotoUploader.queue = [];
        };

        uploader.headers = { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')};

		$scope.clickUpload = function(){
		    angular.element('#post-upload').trigger('click');
		};

		/* Photo Uploader */
		$scope.postPhotoUploader = new FileUploader({
			url: '/temp-upload/upload-photo',
			headers: uploader.headers,
			queueLimit : 1
		})

		if($scope.config.action == 'edit')
		{
			$scope.currentTime = Date.now();
			
			var query = {};

			query.with = [
				{
					'relation':'hashtags',
					'withTrashed': false,	
				},
			];

			query.where = [
				{
					'label':'id',
					'condition':'=',
					'value': $scope.config.id,
				}
			];

			query.first = true;

			Helper.post('/post/enlist', query)
				.success(function(data){
					data.chips = [];

					angular.forEach(data.hashtags, function(hashtag){
						data.chips.push(hashtag.tag);
					});

					$scope.post = data;
					$scope.post.group_id = data.group_id ? data.group_id : 'all';
					$scope.post.allow_comments = data.allow_comments ? true : false;
				})
				.error(function(){
					Helper.error();
				});
		}

		$scope.duplicate = false;

		$scope.busy = false;

		// FILTERS
        $scope.postPhotoUploader.filters.push(uploader.filter);
        $scope.postPhotoUploader.filters.push(uploader.sizeFilter);
        
		$scope.postPhotoUploader.onWhenAddingFileFailed = uploader.error;
		$scope.postPhotoUploader.onAfterAddingFile  = function(){
			$scope.fileError = false;
			if($scope.postPhotoUploader.queue.length)
			{	
				$scope.postPhotoUploader.uploadAll()
			}
		};

		$scope.postPhotoUploader.onCompleteItem  = function(data, response){
			$scope.temp_upload = response;
			$scope.post.image_path = response.path;
			if(response)
			{
				$scope.preview = true;
				$scope.currentTime = Date.now();
			}
		}

		$scope.postPhotoUploader.onErrorItem = function()
		{
			Helper.error();
		}

		$scope.replace = function(){
			// $scope.post.image_path = null;
			// $scope.temp_upload = {};
			// $scope.preview = false;
			$scope.postPhotoUploader.queue = [];
			$scope.clickUpload();
		}

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.submit = function(){
			if($scope.postForm.$invalid){
				angular.forEach($scope.postForm.$error, function(field){
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
					Helper.post('/post', $scope.post)
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
					Helper.put('/post' + '/' + $scope.config.id, $scope.post)
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
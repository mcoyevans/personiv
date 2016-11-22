app
	.controller('slideshowContentContainerController', ['$scope', '$state', '$stateParams', 'FileUploader', 'Helper', function($scope, $state, $stateParams, FileUploader, Helper){
		/*
		 *
		 * Object for toolbar
		 * 
		*/
		$scope.toolbar = {};

		$scope.slideshow = {}

		$scope.slideshow.slides = [];

		/*
		 *
		 * Object for fab
		 * 
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-upload';
		$scope.fab.label = 'Upload';
		$scope.fab.action = function(){
			Helper.preload();

			angular.forEach($scope.slideshow.slides, function(item, key){
				item.order = key;
			});

			if(!$stateParams.slideshowID)
			{
				Helper.post('/slideshow', $scope.slideshow)
					.success(function(){
						Helper.stop();
						Helper.notify('Upload successfuly.');
						$state.go('main');
					})
					.error(function(){
						Helper.error();
					})
			}
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
		        return item.size <= 10485760;
		    }
        }

        uploader.error = function(item /*{File|FileLikeObject}*/, filter, options) {
            $scope.fileError = true;
            $scope.photoUploader.queue = [];
        };

        uploader.headers = { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')};

		$scope.slideUploader = function(){
			angular.element('#slides').trigger('click');
		}

		/* Photo Uploader */
		$scope.photoUploader = new FileUploader({
			url: '/temp-upload/upload-photo',
			headers: uploader.headers,
		})

		// FILTERS
        $scope.photoUploader.filters.push(uploader.filter);
        $scope.photoUploader.filters.push(uploader.sizeFilter);
        
		$scope.photoUploader.onWhenAddingFileFailed = uploader.error;
		$scope.photoUploader.onAfterAddingFile  = function(){
			$scope.fileError = false;
			if($scope.photoUploader.queue.length)
			{	
				angular.forEach($scope.photoUploader.queue, function(item, key){
					$scope.photoUploader.uploadItem(key)
				});
			}
		};

		$scope.photoUploader.onCompleteItem  = function(data, response){
			$scope.slideshow.slides.push(response);
		}

		$scope.photoUploader.onErrorItem = function()
		{
			Helper.error();
		}

		$scope.photoUploader.onCompleteAll = function(){
			$scope.show = true;
			$scope.fab.show = true;
			$scope.photoUploader.queue = [];
		}

		$scope.moveUp = function(slide){
			var idx = $scope.slideshow.slides.indexOf(slide);

			$scope.slideshow.slides.splice(idx, 1);
			$scope.slideshow.slides.splice(idx - 1, 0, slide);
		}

		$scope.moveDown = function(slide){
			var idx = $scope.slideshow.slides.indexOf(slide);

			$scope.slideshow.slides.splice(idx, 1);
			$scope.slideshow.slides.splice(idx + 1, 0, slide);
		}

		$scope.delete = function(slide){
			var dialog = {
				'title': 'Delete',
				'message': 'This image will be deleted permanently.',
				'ok': 'Delete',
				'cancel': 'Cancel',
			}

			Helper.confirm(dialog)
				.then(function(){

				}, function(){
					return;
				});
		}
	}]);
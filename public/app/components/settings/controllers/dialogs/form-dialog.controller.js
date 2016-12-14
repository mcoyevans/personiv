app
	.controller('formDialogController', ['$scope', 'Helper', 'FileUploader', function($scope, Helper, FileUploader){
		$scope.document = {};

		var busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.clickUpload = function(){
		    angular.element('#file-upload').trigger('click');
		};

		var uploader = {};

		uploader.filter = {
            name: 'fileTypeFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|pdf|'.indexOf(type) !== -1;
            }
        };

        uploader.error = function(item /*{File|FileLikeObject}*/, filter, options) {
            $scope.fileError = true;
            $scope.pdfUploader.queue = [];
        };

        uploader.headers = { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')};

		/* Question Uploader */
		$scope.pdfUploader = new FileUploader({
			url: '/temp-upload/upload-file',
			headers: uploader.headers,
			queueLimit : 1
		})
		// FILTERS
        $scope.pdfUploader.filters.push(uploader.filter);
        
		$scope.pdfUploader.onWhenAddingFileFailed = uploader.error;
		$scope.pdfUploader.onAfterAddingFile  = function(){
			$scope.fileError = false;
			if($scope.pdfUploader.queue.length)
			{	
				$scope.pdfUploader.uploadAll();
			}
		};

		$scope.pdfUploader.onCompleteItem  = function(data, response){
			$scope.document.path = response;
		}

		$scope.pdfUploader.onErrorItem = function()
		{
			$scope.error = true;
		}



	}]);
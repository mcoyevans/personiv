app
	.controller('repostDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		var query = {};

		query.self_group = true;

		Helper.post('/group/enlist', query)
			.success(function(data){
				$scope.groups = data;
			});

		$scope.repost = {};

		if($scope.config.action == 'create')
		{
			
			var query = {};

			query.with = [
				{
					'relation':'hashtags',
					'withTrashed': false,	
				},
				{
					'relation':'user',
					'withTrashed': true,
				},
				{
					'relation':'group',
					'withTrashed': true,
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
					data.created_at = new Date(data.created_at);
					data.chips = [];

					angular.forEach(data.hashtags, function(hashtag){
						data.chips.push(hashtag.tag);
					});

					$scope.repost.post = data;
					$scope.repost.post.pinned = data.pinned ? true : false;
					$scope.repost.post.allow_comments = data.allow_comments ? true : false;

					$scope.repost.group_id = data.group_id ? data.group_id : 'all';
				})
				.error(function(){
					Helper.error();
				});
		}

		else if($scope.config.action == 'edit')
		{
			var query = {};

			query.with = [
				{
					'relation':'post',
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

			Helper.post('/repost/enlist', query)
				.success(function(data){
					data.post.created_at = new Date(data.post.created_at);
					data.post.chips = [];

					angular.forEach(data.post.hashtags, function(hashtag){
						data.post.chips.push(hashtag.tag);
					});

					$scope.repost.post = data.post;
					$scope.repost.post.pinned = data.post.pinned ? true : false;
					$scope.repost.post.allow_comments = data.post.allow_comments ? true : false;

					$scope.repost.group_id = data.post.group_id ? data.post.group_id : 'all';

					Helper.get('/post/' + $scope.config.id)
						.success(function(data){
							$scope.repost.id = data.repost_id;
							$scope.repost.title = data.title;
							$scope.repost.pinned = data.pinned ? true : false;
							$scope.repost.allow_comments = data.allow_comments ? true : false;
							$scope.repost.group_id = data.group_id ? data.group_id : 'all';
						});
				})
				.error(function(){
					Helper.error();
				});

		}

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.submit = function(){
			if($scope.repostForm.$invalid){
				angular.forEach($scope.repostForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			$scope.busy = true;

			if($scope.config.action == 'create')
			{
				Helper.post('/repost', $scope.repost)
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
				Helper.put('/repost' + '/' + $scope.config.id, $scope.repost)
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
	}]);
<?php

namespace App\Policies;

use App\User;
use App\Repost;
use Illuminate\Auth\Access\HandlesAuthorization;

class RepostPolicy
{
    use HandlesAuthorization;

    public function before($user, $ability)
    {
        if ($user->super_admin) {
            return true;
        }
    }
    /**
     * Determine whether the user can view the repost.
     *
     * @param  App\User  $user
     * @param  App\Repost  $repost
     * @return mixed
     */
    public function view(User $user, Repost $repost)
    {
        //
    }

    /**
     * Determine whether the user can create reposts.
     *
     * @param  App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the repost.
     *
     * @param  App\User  $user
     * @param  App\Repost  $repost
     * @return mixed
     */
    public function update(User $user, Repost $repost)
    {
        return $user->id == $repost->user_id;
    }

    /**
     * Determine whether the user can delete the repost.
     *
     * @param  App\User  $user
     * @param  App\Repost  $repost
     * @return mixed
     */
    public function delete(User $user, Repost $repost)
    {
        //
    }
}

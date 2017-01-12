<?php

namespace App\Policies;

use App\User;
use App\Reservation;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReservationPolicy
{
    use HandlesAuthorization;

    public function before($user, $ability)
    {
        if ($user->super_admin) {
            return true;
        }
    }
    /**
     * Determine whether the user can view the reservation.
     *
     * @param  App\User  $user
     * @param  App\Reservation  $reservation
     * @return mixed
     */
    public function view(User $user, Reservation $reservation)
    {
        //
    }

    /**
     * Determine whether the user can create reservations.
     *
     * @param  App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the reservation.
     *
     * @param  App\User  $user
     * @param  App\Reservation  $reservation
     * @return mixed
     */
    public function update(User $user, Reservation $reservation)
    {
        return $user->id == $reservation->user_id;
    }

    /**
     * Determine whether the user can delete the reservation.
     *
     * @param  App\User  $user
     * @param  App\Reservation  $reservation
     * @return mixed
     */
    public function delete(User $user, Reservation $reservation)
    {
        $user = User::with('roles')->where('id', $user->id)->first();

        foreach ($user->roles as $role) {
            if($role->name == 'approvals')
            {
                $can_approve = true;
            }
        }

        return $user->id == $reservation->user_id || $can_approve;
    }
}

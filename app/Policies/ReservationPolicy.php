<?php

namespace App\Policies;

use App\User;
use App\Reservation;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReservationPolicy
{
    use HandlesAuthorization;

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
        return $user->id == $reservation->user_id;
    }
}

<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

use App\Reservation;
use App\User;
use Carbon\Carbon;

class ReservationApprovedConfirmation extends Notification implements ShouldQueue
{
    use Queueable;

    protected $reservation;
    protected $user;
    protected $sender;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Reservation $reservation, User $user, User $sender)
    {
        $this->reservation = $reservation;
        $this->user = $user;
        $this->sender = $sender;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Approved Room Reservation Confirmation')
            ->greeting('Hi!')
            ->line('You just approved ' . $this->user->name . '\'s request for room reservation at '. $this->reservation->location->name .' around '. Carbon::parse($this->reservation->start)->toDayDateTimeString() . ' to ' . Carbon::parse($this->reservation->end)->toDayDateTimeString(). '.')
            ->action('View Reservation', 'http://172.17.0.210:914/home#/reservations');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'attachment' => $this->reservation,
            'sender' => $this->sender,
            'message' => 'approved a room reservation.',
            'url' => 'main.reservations',
            'withParams' => false,
        ];
    }
}

<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

use App\Reservation;
use Carbon\Carbon;

class ReservationCreated extends Notification implements ShouldQueue
{
    use Queueable;

    protected $reservation;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
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
                    ->subject('New Room Reservation')
                    ->greeting('Hey there!')
                    ->line($this->reservation->user->name . ' requested for a room reservation that needs your approval.')
                    ->line($this->reservation->location->name . ' from ' . Carbon::parse($this->reservation->start)->toDayDateTimeString() . ' to ' . Carbon::parse($this->reservation->end)->toDayDateTimeString())
                    ->action('View Reservation', env('APP_URL') . "/home#/approvals");
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
            'sender' => $this->reservation->user,
            'message' => 'created a new reservation.',
            'url' => 'main.approvals',
            'withParams' => false,
        ];
    }
}

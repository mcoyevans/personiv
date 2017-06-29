<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

use App\Reservation;
use Carbon\Carbon;

class ReservationUpdated extends Notification implements ShouldQueue
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
                    ->subject('Updated Room Reservation')
                    ->greeting('Hello!')
                    ->line($this->reservation->user->name . ' needs approval for his/her updated room reservation.')
                    ->line($this->reservation->location->name . ' from ' . Carbon::parse($this->reservation->start)->toDayDateTimeString() . ' to ' . Carbon::parse($this->reservation->end)->toDayDateTimeString())
                    ->action('View Reservation', 'http://172.17.0.210:914/home#/approvals');
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
            'message' => 'updated a reservation.',
            'url' => 'main.approvals',
            'withParams' => false,
        ];
    }
}

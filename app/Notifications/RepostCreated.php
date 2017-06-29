<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

use App\Post;

class RepostCreated extends Notification implements ShouldQueue
{
    use Queueable;

    protected $post;
    protected $repost;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Post $post, Post $repost)
    {
        $this->post = $post;
        $this->repost = $repost;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database', 'broadcast'];
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
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', 'http://172.17.0.210:914/home#/')
                    ->line('Thank you for using our application!');
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
            'attachment' => $this->post,
            'sender' => $this->post->user,
            'message' => 'reposted '. $this->repost->user->name .' post.',
            'url' => 'main',
        ];
    }
}

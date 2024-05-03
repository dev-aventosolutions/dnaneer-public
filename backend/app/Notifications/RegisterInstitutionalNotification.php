<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\Notifications;

class RegisterInstitutionalNotification extends Notification
{
    use Queueable;
    protected $recipientType; // 'admin' or 'user'
    protected $isAdmin;
    protected $data;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($data, $recipientType)
    {
        $this->recipientType = $recipientType;
        $this->data = $data;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        if ($this->recipientType === 'admin') {
            $this->isAdmin = 1;
            // Insert test data into the notifications table
            Notifications::create([
                'user_id' => $this->data->id,
                'title' => 'New user signup',
                'text' => 'A institutional user ('.$this->data->email.') is registered on the dnaneer.',
                'url' => null,
                'seen' => 0,
                'is_admin' => 1
            ]);
            // return $this->adminContent();
        } elseif ($this->recipientType === 'user') {
            $this->isAdmin = 0;
            // Insert test data into the notifications table
            Notifications::create([
                'user_id' => $this->data->id,
                'title' => 'New user signup',
                'text' => 'Welcome to dnaneer.',
                'url' => null,
                'seen' => 0,
                'admin_url' => null,
                'is_admin' => 0
                
            ]);
            // return $this->userContent();
        }
        // return (new MailMessage)
        //             ->line('The introduction to the notification.')
        //             ->action('Notification Action', url('/'))
        //             ->line('Thank you for using our application!');
    }    

    protected function adminContent()
    {
        return (new MailMessage)
            ->line('New user signup:')
            ->line('A institutional user ('.$this->data->email.') is registered on the dnaneer.')
            ->line('Thank you');
    }

    protected function userContent()
    {
        return (new MailMessage)
            ->line('Welcome to dnaneer')
            ->line('Thank you for register yourself on Dnaneer.');
            // ->line('Thank you for your cooperation.');
    }
}
?>
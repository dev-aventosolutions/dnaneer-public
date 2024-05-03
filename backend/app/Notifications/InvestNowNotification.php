<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\Notifications;

class InvestNowNotification extends Notification
{
    use Queueable;
    protected $data;
    protected $recipientType; // 'admin' or 'user'
    protected $isAdmin;
    protected $opportunity;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($data, $recipientType, $opportunity)
    {
        $this->data = $data;
        $this->recipientType = $recipientType;
        $this->opportunity = $opportunity;
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
                'user_id' => $this->data->user_id,
                'title' => 'Invest Now',
                'text' => 'A user id ('.$this->data->user_id.') invested SAR '.$this->data->amount.' on the #'.$this->opportunity->opportunity_number,
                'url' => null,
                'seen' => 0,
                'is_admin' => $this->isAdmin
            ]);
            // return $this->adminContent();
        } elseif ($this->recipientType === 'user') {
            $this->isAdmin = 0;
            // Insert test data into the notifications table
            Notifications::create([
                'user_id' => $this->data->user_id,
                'title' => 'Invest Now',
                'text' => 'Thank you for investing SAR '.$this->data->amount.' on the opportunity #'.$this->opportunity->opportunity_number,
                'url' => null,
                'seen' => 0,
                'is_admin' => $this->isAdmin
            ]);
            // return $this->userContent();
        }
    }    

    protected function adminContent()
    {
        return (new MailMessage)
            ->line('User Information:')
            ->line('A user id ('.$this->data->user_id.') invested SAR '.$this->data->amount.' on the #'.$this->opportunity->opportunity_number)
            ->line('Thank you');
    }

    protected function userContent()
    {
        return (new MailMessage)
            ->line('Thank you for investing SAR '.$this->data->amount.' on the opportunity #'.$this->opportunity->opportunity_number )
            ->line('Once the opportunity closed or fulfilled we will inform you.')
            ->line('Thank you for your cooperation.');
    }
}

<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\Notifications;

class IndividualKYCNotification extends Notification
{
    use Queueable;
    protected $recipientType; // 'admin' or 'user'
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
                'title' => 'Individual KYC Form',
                'text' => 'A user ('.$this->data->email.') submitted their kyc fo rm.',
                'url' => null,
                'seen' => 0,
                'is_admin' =>1
            ]);
            // return $this->adminContent();
        } elseif ($this->recipientType === 'user') {
            $this->isAdmin = 0;
            // Insert test data into the notifications table
            Notifications::create([
                'user_id' => $this->data->id,
                'title' => 'KYC Form',
                'text' => 'Thank you for submitting the kyc form. Our team will contact you soon.',
                'url' => null,
                'seen' => 0,
                'is_admin' =>0,
                'admin_url' => null
            ]);
            // return $this->userContent();
        }
    }
    
    protected function adminContent()
    {
        return (new MailMessage)
            ->line('KYC Form:')
            ->line('A Individual user ('.$this->data->email.') submitted his KYC form.')
            ->line('Thank you');
    }

    protected function userContent()
    {
        return (new MailMessage)
            ->line('Dear '.$this->data->email)
            ->line('Thank you for submitting the kyc form.')
            ->line('Wait for the approval from the dnaneer.')
            ->line('Thanks');
    }
}
?>
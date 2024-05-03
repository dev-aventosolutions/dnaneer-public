<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\Notifications;

class AdminKYCAcceptRejectNotification extends Notification
{
    use Queueable;
    protected $status; // 'approved' or 'rejected'
    protected $data;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($data, $status)
    {
        $this->status = $status;
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
        if($this->status == 'approved'){
            // Insert test data into the notifications table
            Notifications::create([
                'user_id' => $this->data->id,
                'title' => 'KYC Request Approval',
                'text' => 'Dnaneer admin accepted your KYC request.',
                'url' => null,
                'seen' => 0,
                'is_admin' =>0,
                'admin_url' => null
            ]);
            // return $this->Approved();
        }else{
            // Insert test data into the notifications table
            Notifications::create([
                'user_id' => $this->data->id,
                'title' => 'KYC Request Rejection',
                'text' => 'Dnaneer admin rejected your KYC request.',
                'url' => null,
                'seen' => 0,
                'is_admin' =>0,
                'admin_url' => null
            ]);
            // return $this->Rejected();
        } 
    }
    
    protected function Approved()
    {
        return (new MailMessage) 
            ->line('KYC Request Approval:')
            ->line('Dear '.$this->data->email)
            ->line('Your KYC form request has been approved.')
            ->line('Thank you');
    }

    protected function Rejected()
    {
        return (new MailMessage)
            ->line('KYC Request Rejection:')
            ->line('Dear '.$this->data->email)
            ->line('Your KYC form request has been rejected. Please contact the dnaneer Support.')
            ->line('Thank you');
    }
}
?>
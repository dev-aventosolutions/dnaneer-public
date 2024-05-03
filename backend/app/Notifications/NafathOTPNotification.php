<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NafathOTPNotification extends Notification
{
    use Queueable;
    protected $otp;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($otp)
    {
        $this->otp = $otp;
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
        return [
            'subject' => 'Your Nafath OTP',
            'line1' => 'Your Nafath OTP is ' . $this->otp,
            'line2' => 'Please enter this OTP to verify your account.',
            'actionText' => 'Verify OTP',
            'actionUrl' => 'https://example.com/verify-otp',
        ];
    }

    public function toNafath($notifiable)
    {
        return (new NafathOTP($this->otp));
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
            //
        ];
    }
}

<?php

namespace App\Users;

use App\Model\Orm;
use App\Model\User;
use Nette\Application\LinkGenerator;
use Nette\Mail\IMailer;
use Nette\Mail\Message;
use Nette\Utils\Random;
use Nette\Utils\Strings;

class UserCreator
{
    /**
     * @var string
     */
    private $senderEmail;

    /**
     * @var int
     */
    private $tokenLength = 40;

    /**
     * @var Orm
     */
    private $orm;

    /**
     * @var IMailer
     */
    private $mailer;

    /**
     * @var LinkGenerator
     */
    private $linkGenerator;

    public function __construct(string $senderEmail, Orm $orm, IMailer $mailer, LinkGenerator $linkGenerator)
    {
        $this->senderEmail = $senderEmail;
        $this->orm = $orm;
        $this->mailer = $mailer;
        $this->linkGenerator = $linkGenerator;
    }

    /**
     * @param string $email
     * @return User
     * @throws EmailAlreadyTakenException
     */
    public function createUserAndSendAuthEmail(string $email) : User
    {
        $user = $this->createUser($email);
        $this->sendAuthEmail($user);
        return $user;
    }

    /**
     * @param string $email
     * @return User
     * @throws EmailAlreadyTakenException
     */
    private function createUser(string $email) : User
    {
        $email = Strings::lower($email);

        if ($this->orm->users->isEmailTaken($email)) {
            throw new EmailAlreadyTakenException();
        }

        $user = new User();
        $user->email = $email;
        $user->passwordHash = null;
        $user->token = Random::generate($this->tokenLength);
        $this->orm->persistAndFlush($user);
        return $user;
    }

    private function sendAuthEmail(User $user) : void
    {
        $message = new Message();
        $message->setFrom($this->senderEmail);
        $message->addTo($user->email);
        $message->setSubject('Welcome to WhateverBox');
        $message->setHtmlBody($this->formatAuthEmailHtmlBody($user));
        $this->mailer->send($message);
    }

    private function formatAuthEmailHtmlBody(User $user) : string
    {
        $html = file_get_contents(__DIR__ . '/templates/auth-email.html');

        $url = $this->linkGenerator->link('Sign:setPassword', ['email' => $user->email, 'token' => $user->token]);
        $html = str_replace('{url}', htmlspecialchars($url, ENT_QUOTES, 'UTF-8'), $html);

        return $html;
    }
}

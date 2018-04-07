<?php

namespace App\Security;

use App\Model\Orm;
use App\Model\User;
use Nette\Security\AuthenticationException;
use Nette\Security\IAuthenticator;
use Nette\Security\Identity;
use Nette\Security\IIdentity;

class Authenticator implements IAuthenticator
{
    /**
     * @var Orm
     */
    private $orm;

    public function __construct(Orm $orm)
    {
        $this->orm = $orm;
    }

    /**
     * @param array $credentials
     * @return IIdentity
     * @throws AuthenticationException
     */
    public function authenticate(array $credentials)
    {
        $email = $credentials[self::USERNAME];
        $password = $credentials[self::PASSWORD];

        /** @var User $user */
        $user = $this->orm->users->getBy(['email' => $email]);

        if (!$user) {
            throw new AuthenticationException('User does not exist.');
        }

        if (!$user->passwordEquals($password)) {
            throw new AuthenticationException('Invalid password.');
        }

        return new Identity($user->id);
    }
}

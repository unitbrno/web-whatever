<?php

namespace App\Model;

use Nette\Security\Passwords;
use Nextras\Orm\Entity\Entity;

/**
 * @property int $id {primary}
 * @property string $email
 * @property string|null $passwordHash
 * @property string|null $token
 */
class User extends Entity
{
    public function setPassword(string $password) : void
    {
        $this->passwordHash = Passwords::hash($password);
    }

    public function passwordEquals(string $password) : bool
    {
        return Passwords::verify($password, $this->passwordHash);
    }
}

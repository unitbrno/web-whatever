<?php

namespace App\Model;

use Nextras\Orm\Repository\Repository;

final class UsersRepository extends Repository
{
    public static function getEntityClassNames() : array
    {
        return [User::class];
    }

    public function isEmailTaken(string $email) : bool
    {
        return $this->getBy(['email' => $email]) !== null;
    }
}

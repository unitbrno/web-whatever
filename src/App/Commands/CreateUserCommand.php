<?php

namespace App\Console;

use App\Model\Orm;
use App\Model\User;
use Nette\Utils\Random;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CreateUserCommand extends Command
{
    /**
     * @var Orm
     * @inject
     */
    public $orm;

    protected function configure()
    {
        $this->setName('create-user');
        $this->setDescription('Creates a new user');
        $this->addArgument('email', InputArgument::REQUIRED, 'Email');
        $this->addArgument('password', InputArgument::OPTIONAL, 'Password');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $email = $input->getArgument('email');
        $password = $input->getArgument('password') ?: Random::generate();

        $user = new User();
        $user->email = $email;
        $user->setPassword($password);
        $this->orm->persistAndFlush($user);

        $output->writeln('Email: ' . $email);
        $output->writeln('Password: ' . $password);
    }
}

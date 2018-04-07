<?php

namespace App\Google;

use Nette\Http\Url;
use Nette\Utils\Json;

class GoogleMapsApiKeyProvider
{
    /**
     * @var string
     */
    private $apiKey;

    public function __construct(string $apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function getApiKey() : string
    {
        return $this->apiKey;
    }
}

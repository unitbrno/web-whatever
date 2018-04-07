<?php

namespace App\Presenters;

use App\Google\GoogleMapsApiKeyProvider;
use App\Model\Orm;
use Kdyby\Autowired\AutowireComponentFactories;
use Kdyby\Translation\Translator;
use Nette\Application\UI\Presenter;
use Nette\Bridges\ApplicationLatte\Template;

/**
 * @method Template getTemplate()
 */
abstract class BasePresenter extends Presenter
{
    use AutowireComponentFactories;

    /**
     * @var Translator
     * @inject
     */
    public $translator;

    /**
     * @var GoogleMapsApiKeyProvider
     * @inject
     */
    public $googleMapsApiKeyProvider;

    /**
     * @var Orm
     * @inject
     */
    public $orm;

    protected function beforeRender()
    {
        parent::beforeRender();

        $template = $this->getTemplate();
        $template->add('googleMapsApiKey', $this->googleMapsApiKeyProvider->getApiKey());
        $template->add('translations', [
            'today' => $this->translator->translate('front.base.today'),
            'tomorrow' => $this->translator->translate('front.base.tomorrow'),
        ]);
    }
}

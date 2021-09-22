<?php

declare(strict_types=1);

namespace oat\parccTei\migrations;

use Doctrine\DBAL\Schema\Schema;
use oat\tao\scripts\tools\migrations\AbstractMigration;
use Doctrine\Migrations\Exception\IrreversibleMigration;
use oat\qtiItemPci\model\IMSPciModel;
use oat\parccTei\scripts\install\RegisterPciGraphZoomNumberLineInteraction;


/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version202109151320123025_parccTei extends AbstractMigration
{

    public function getDescription(): string
    {
        return 'Fix graphZoomNumberLineInteraction';
    }

    public function up(Schema $schema): void
    {
        $registry = (new IMSPciModel())->getRegistry();
        if ($registry->has('graphZoomNumberLineInteraction')) {
            /** @noinspection PhpUnhandledExceptionInspection */
            $registry->removeAllVersions('graphZoomNumberLineInteraction');
        }
        $this->addReport($this->propagate(new RegisterPciGraphZoomNumberLineInteraction())([]));
    }

    public function down(Schema $schema): void
    {
        throw new IrreversibleMigration(
            'In order to undo this migration, please revert the client-side changes and run ' . RegisterPciGraphZoomNumberLineInteraction::class
        );
    }
}

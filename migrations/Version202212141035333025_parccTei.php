<?php

declare(strict_types=1);

namespace oat\parccTei\migrations;

use Doctrine\DBAL\Schema\Schema;
use oat\tao\scripts\tools\migrations\AbstractMigration;
use Doctrine\Migrations\Exception\IrreversibleMigration;
use oat\parccTei\scripts\install\RegisterPciFractionModelInteraction;
use oat\parccTei\scripts\install\RegisterPciGraphNumberLineInteraction;
use oat\parccTei\scripts\install\RegisterPciGraphZoomNumberLineInteraction;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version202212141035333025_parccTei extends AbstractMigration
{

    public function getDescription(): string
    {
        return 'Update graphic PCIs to support Solar TR';
    }

    public function up(Schema $schema): void
    {
        $this->addReport(
            $this->propagate(
                new RegisterPciFractionModelInteraction()
            )(
                ['1.0.2']
            )
        );
        $this->addReport(
            $this->propagate(
                new RegisterPciGraphNumberLineInteraction()
            )(
                ['2.0.1']
            )
        );
        $this->addReport(
            $this->propagate(
                new RegisterPciGraphZoomNumberLineInteraction()
            )(
                ['1.0.3']
            )
        );
    }

    public function down(Schema $schema): void
    {
        throw new IrreversibleMigration(
            'In order to undo this migration, please revert the client-side changes and run '
            . RegisterPciFractionModelInteraction::class . ', '
            . RegisterPciGraphNumberLineInteraction::class . ', '
            . RegisterPciGraphZoomNumberLineInteraction::class . '.'
        );
    }
}

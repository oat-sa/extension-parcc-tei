<?php

declare(strict_types=1);

namespace oat\parccTei\migrations;

use Doctrine\DBAL\Schema\Schema;
use oat\tao\scripts\tools\migrations\AbstractMigration;
use Doctrine\Migrations\Exception\IrreversibleMigration;
use oat\parccTei\scripts\install\RegisterGraphFunctionInteraction;
use oat\parccTei\scripts\install\RegisterPciFractionModelInteraction;
use oat\parccTei\scripts\install\RegisterPciLineAndPointInteraction;
use oat\parccTei\scripts\install\RegisterPciGraphNumberLineInteraction;
use oat\parccTei\scripts\install\RegisterPciGraphPointLineGraphInteraction;
use oat\parccTei\scripts\install\RegisterPciGraphZoomNumberLineInteraction;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version202209140900513025_parccTei extends AbstractMigration
{

    public function getDescription(): string
    {
        return 'Update graphic PCIs to fix review';
    }

    public function up(Schema $schema): void
    {
        $this->addReport(
            $this->propagate(
                new RegisterGraphFunctionInteraction()
            )(
                ['1.0.1']
            )
        );
        $this->addReport(
            $this->propagate(
                new RegisterPciFractionModelInteraction()
            )(
                ['1.0.1']
            )
        );
        $this->addReport(
            $this->propagate(
                new RegisterPciLineAndPointInteraction()
            )(
                ['1.0.1']
            )
        );
        $this->addReport(
            $this->propagate(
                new RegisterPciGraphNumberLineInteraction()
            )(
                ['2.0.0']
            )
        );
        $this->addReport(
            $this->propagate(
                new RegisterPciGraphPointLineGraphInteraction()
            )(
                ['1.0.1']
            )
        );
        $this->addReport(
            $this->propagate(
                new RegisterPciGraphZoomNumberLineInteraction()
            )(
                ['1.0.2']
            )
        );
    }

    public function down(Schema $schema): void
    {
        throw new IrreversibleMigration(
            'In order to undo this migration, please revert the client-side changes and run '
            . RegisterGraphFunctionInteraction::class . ', '
            . RegisterPciFractionModelInteraction::class . ', '
            . RegisterPciLineAndPointInteraction::class . ', '
            . RegisterPciGraphNumberLineInteraction::class . ', '
            . RegisterPciGraphPointLineGraphInteraction::class . ', '
            . RegisterPciGraphZoomNumberLineInteraction::class . ', '
        );
    }
}

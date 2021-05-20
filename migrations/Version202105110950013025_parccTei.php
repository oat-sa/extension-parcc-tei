<?php

declare(strict_types=1);

namespace oat\parccTei\migrations;

use Doctrine\DBAL\Schema\Schema;
use oat\tao\scripts\tools\migrations\AbstractMigration;
use Doctrine\Migrations\Exception\IrreversibleMigration;
use oat\parccTei\scripts\install\RegisterPciGraphNumberLineInteraction;

final class Version202105110950013025_parccTei extends AbstractMigration
{

    public function getDescription(): string
    {
        return 'Refactor graphNumberLineInteraction to standard IMS compliant';
    }

    public function up(Schema $schema): void
    {
        $this->addReport(
            $this->propagate(
                new RegisterPciGraphNumberLineInteraction()
            )(
                ['2.0.0']
            )
        );
    }

    public function down(Schema $schema): void
    {
        throw new IrreversibleMigration(
            'In order to undo this migration, please revert the client-side changes and run ' . RegisterPciGraphNumberLineInteraction::class
        );
    }
}

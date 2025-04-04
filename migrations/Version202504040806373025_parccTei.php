<?php

declare(strict_types=1);

namespace oat\parccTei\migrations;

use Doctrine\DBAL\Schema\Schema;
use oat\tao\scripts\tools\migrations\AbstractMigration;
use Doctrine\Migrations\Exception\IrreversibleMigration;
use oat\parccTei\scripts\install\RegisterPciGraphPointLineGraphInteraction;

/**
 * Auto-generated Migration: Please modify to your needs!
 *
 * phpcs:disable Squiz.Classes.ValidClassName
 */
final class Version202504040806373025_parccTei extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Update graGraphPointLine PCI to fix review';
    }

    public function up(Schema $schema): void
    {
        $this->addReport(
            $this->propagate(
                new RegisterPciGraphPointLineGraphInteraction()
            )(
                ['1.0.2']
            )
        );
    }

    public function down(Schema $schema): void
    {
        throw new IrreversibleMigration(
            'In order to undo this migration, please revert the client-side changes and run '
            . RegisterPciGraphPointLineGraphInteraction::class . ', '
        );
    }
}

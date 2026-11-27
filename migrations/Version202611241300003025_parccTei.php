<?php

declare(strict_types=1);

namespace oat\parccTei\migrations;

use Doctrine\DBAL\Schema\Schema;
use oat\tao\scripts\tools\migrations\AbstractMigration;
use Doctrine\Migrations\Exception\IrreversibleMigration;
use oat\parccTei\scripts\install\RegisterPciGraphNumberLineInteraction;

/**
 * Auto-generated Migration: Please modify to your needs!
 *
 * phpcs:disable Squiz.Classes.ValidClassName
 */
final class Version202611241300003025_parccTei extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Update graphNumberLineInteraction: one instance per interaction, restore the state only once';
    }

    public function up(Schema $schema): void
    {
        $this->addReport(
            $this->propagate(
                new RegisterPciGraphNumberLineInteraction()
            )(
                ['2.0.3']
            )
        );
    }

    public function down(Schema $schema): void
    {
        throw new IrreversibleMigration(
            'In order to undo this migration, please revert the client-side changes and run '
            . RegisterPciGraphNumberLineInteraction::class . ', '
        );
    }
}

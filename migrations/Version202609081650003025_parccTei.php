<?php

/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2026 (original work) Open Assessment Technologies SA;
 */

declare(strict_types=1);

namespace oat\parccTei\migrations;

use Doctrine\DBAL\Schema\Schema;
use oat\tao\scripts\tools\migrations\AbstractMigration;
use Doctrine\Migrations\Exception\IrreversibleMigration;
use oat\parccTei\scripts\install\RegisterPciFractionModelInteraction;

/**
 * Auto-generated Migration: Please modify to your needs!
 *
 * phpcs:disable Squiz.Classes.ValidClassName
 */
final class Version202609081650003025_parccTei extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Treat Fractions PCI default pie as unanswered until the candidate interacts';
    }

    public function up(Schema $schema): void
    {
        $this->addReport(
            $this->propagate(
                new RegisterPciFractionModelInteraction()
            )(
                ['1.0.3']
            )
        );
    }

    public function down(Schema $schema): void
    {
        throw new IrreversibleMigration(
            'In order to undo this migration, please revert the client-side changes and run '
            . RegisterPciFractionModelInteraction::class . '.'
        );
    }
}

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
use oat\qtiItemPci\model\IMSPciModel;
use oat\parccTei\scripts\install\RegisterPciFractionModelInteraction;
use oat\qtiItemPci\model\portableElement\storage\IMSPciRegistry;
use oat\taoQtiItem\model\portableElement\PortableElementService;

/**
 * Auto-generated Migration: Please modify to your needs!
 *
 * phpcs:disable Squiz.Classes.ValidClassName
 */
final class Version202611051733003025_parccTei extends AbstractMigration
{
    private const TYPE_IDENTIFIER = 'fractionModelInteraction';

    private const VERSION_UP = '1.0.4';

    private const VERSION_DOWN = '1.0.3';

    private const VERSION_ALIAS = '1.0.*';

    public function getDescription(): string
    {
        return 'Re-register Fraction Model PCI 1.0.4 (keyboard navigation and focus indicator)';
    }

    public function up(Schema $schema): void
    {
        $this->addReport(
            $this->propagate(
                new RegisterPciFractionModelInteraction()
            )(
                [self::VERSION_UP]
            )
        );
    }

    public function down(Schema $schema): void
    {
        $registry = (new IMSPciModel())->getRegistry();

        if (!$registry->has(self::TYPE_IDENTIFIER, self::VERSION_UP)) {
            return;
        }

        if ($this->hasNewerVersion($registry)) {
            $registry->unregister($registry->fetch(self::TYPE_IDENTIFIER, self::VERSION_UP));
            return;
        }

        $previousVersionPackage = $registry->export(
            $registry->fetch(self::TYPE_IDENTIFIER, self::VERSION_DOWN)
        );

        try {
            $registry->unregister($registry->fetch(self::TYPE_IDENTIFIER, self::VERSION_UP));
            $registry->unregister($registry->fetch(self::TYPE_IDENTIFIER, self::VERSION_ALIAS));

            $service = new PortableElementService();
            $service->setServiceLocator($this->getServiceLocator());
            $service->import(IMSPciModel::PCI_IDENTIFIER, $previousVersionPackage);
        } finally {
            if (is_file($previousVersionPackage)) {
                unlink($previousVersionPackage);
            }
        }
    }

    private function hasNewerVersion(IMSPciRegistry $registry): bool
    {
        $latestVersion = $registry->getLatestVersion(self::TYPE_IDENTIFIER)->getVersion();

        return version_compare($latestVersion, self::VERSION_UP, '>');
    }
}

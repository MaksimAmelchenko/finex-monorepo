import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { AddButton, BackButton, Header } from '../../components/Header/Header';
import { IUnit } from '../../types/unit';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';
import { Unit } from '../../stores/models/unit';
import { UnitRow } from './UnitRow/UnitRow';
import { UnitWindowMobile } from '../UnitWindowMobile/UnitWindowMobile';
import { UnitsRepository } from '../../stores/units-repository';
import { analytics } from '../../lib/analytics';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

const t = getT('UnitsMobile');

export interface UnitsMobileContentProps {
  onSelect?: (unit: Unit) => void;
  onClose: () => void;
}

export const UnitsMobileContent = observer<UnitsMobileContentProps>(({ onSelect, onClose }) => {
  const unitsRepository = useStore(UnitsRepository);
  const [unit, setUnit] = useState<Partial<IUnit> | Unit | null>(null);
  const { units } = unitsRepository;
  const isSelectMode = Boolean(onSelect);

  useEffect(() => {
    analytics.view({
      page_title: 'units-mobile',
    });
  }, []);

  const handleAddClick = useCallback(() => {
    setUnit({});
  }, []);

  const handleClick = useCallback(
    (unit: Unit, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect?.(unit);
      } else {
        setUnit(unit);
      }
    },
    [isSelectMode, onSelect]
  );

  return (
    <>
      <Header
        title={t('Units')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={<AddButton onClick={handleAddClick} />}
      />
      <SideSheetBody>
        {units.map(unit => (
          <UnitRow unit={unit} onClick={handleClick} key={unit.id} />
        ))}
      </SideSheetBody>

      <SideSheetMobile open={Boolean(unit)}>
        {unit && <UnitWindowMobile unit={unit} onClose={() => setUnit(null)} />}
      </SideSheetMobile>
    </>
  );
});

export default UnitsMobileContent;

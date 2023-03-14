import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { BackButton, Header } from '../../components/Header/Header';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { Unit } from '../../stores/models/unit';
import { UnitRow } from './UnitRow/UnitRow';
import { UnitsRepository } from '../../stores/units-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';
import { analytics } from '../../lib/analytics';

const t = getT('UnitsMobile');

export interface UnitsMobileContentProps {
  onSelect?: (unit: Unit) => void;
  onClose: () => void;
}

export const UnitsMobileContent = observer<UnitsMobileContentProps>(({ onSelect, onClose }) => {
  const unitsRepository = useStore(UnitsRepository);
  const { units } = unitsRepository;
  const isSelectMode = Boolean(onSelect);

  useEffect(() => {
    analytics.view({
      page_title: 'units-mobile',
    });
  }, []);

  const handleClick = useCallback(
    (unit: Unit, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect?.(unit);
      }
    },
    [isSelectMode, onSelect]
  );

  return (
    <>
      <Header title={t('Units')} startAdornment={<BackButton onClick={onClose} />} />
      <SideSheetBody>
        {units.map(unit => {
          return <UnitRow unit={unit} onClick={handleClick} key={unit.id} />;
        })}
      </SideSheetBody>
    </>
  );
});

export default UnitsMobileContent;

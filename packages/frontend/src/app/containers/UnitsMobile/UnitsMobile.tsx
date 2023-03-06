import React from 'react';
import { observer } from 'mobx-react-lite';

import { Drawer } from '../../components/Drawer/Drawer';
import { Header } from '../../components/Header/Header';
import { Unit } from '../../stores/models/unit';
import { UnitRow } from './UnitRow/UnitRow';
import { UnitsRepository } from '../../stores/units-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './UnitsMobile.module.scss';

const t = getT('UnitsMobile');

interface UnitsMobileProps {
  open: boolean;
  onSelect: (unit: Unit) => void;
  onClose: () => void;
}

export const UnitsMobile = observer<UnitsMobileProps>(({ open, onSelect, onClose }) => {
  const unitsRepository = useStore(UnitsRepository);
  const { units } = unitsRepository;
  const isSelectMode = Boolean(onSelect);

  const handleOnClick = (unit: Unit, event: React.MouseEvent<HTMLButtonElement>) => {
    if (isSelectMode) {
      onSelect(unit);
    }
  };

  return (
    <Drawer open={open} className={styles.root}>
      <Header title={t('Units')} onClickBack={onClose} onClickAdd={() => {}} />
      <main className={styles.root__main}>
        {units.map(unit => {
          return <UnitRow unit={unit} onClick={handleOnClick} key={unit.id} />;
        })}
      </main>
    </Drawer>
  );
});

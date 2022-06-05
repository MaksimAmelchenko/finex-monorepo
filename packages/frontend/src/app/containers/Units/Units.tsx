import React, { useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Button } from '@finex/ui-kit';
import { IUnit } from '../../types/unit';
import { Unit as UnitModel } from '../../stores/models/unit';
import { UnitRow } from './UnitRow/UnitRow';
import { UnitWindow } from '../UnitWindow/UnitWindow';
import { UnitsRepository } from '../../stores/units-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './Units.module.scss';

const t = getT('Units');

export const Units = observer(() => {
  const unitsRepository = useStore(UnitsRepository);
  const { units } = unitsRepository;
  const { enqueueSnackbar } = useSnackbar();

  const [isOpenedUnitWindow, setIsOpenedUnitWindow] = useState<boolean>(false);
  const [unit, setUnit] = useState<Partial<IUnit> | UnitModel | null>(null);

  const handleAddClick = () => {
    setUnit({});
    setIsOpenedUnitWindow(true);
  };

  const selectedUnits = units.filter(({ isSelected }) => isSelected);

  const handleDeleteClick = () => {
    if (selectedUnits.length > 1) {
      if (!window.confirm(t('Are you sure you what to delete several units?'))) {
        return;
      }
    }
    selectedUnits.forEach(unit => {
      unitsRepository.deleteUnit(unit).catch(err => {
        let message = '';
        switch (err.code) {
          case 'cashflow_detail_2_unit': {
            message = t("You can't delete unit with transaction");
            break;
          }
          default:
            message = err.message;
        }
        enqueueSnackbar(message, { variant: 'error' });
      });
    });
  };

  const handleRefreshClick = () => {
    unitsRepository.getUnits();
  };

  const handleClickOnUnit = (unit: UnitModel) => {
    setUnit(unit);
    setIsOpenedUnitWindow(true);
  };

  const handleCloseUnitWindow = () => {
    setIsOpenedUnitWindow(false);
  };

  return (
    <>
      <article>
        <div className={styles.panel}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button variant="contained" size="small" color="secondary" onClick={handleAddClick}>
                {t('New')}
              </Button>
              <Button variant="outlined" size="small" disabled={!selectedUnits.length} onClick={handleDeleteClick}>
                {t('Delete')}
              </Button>
              <Button variant="outlined" size="small" onClick={handleRefreshClick}>
                {t('Refresh')}
              </Button>
            </div>
          </div>
        </div>
        <table className={clsx('table table-hover table-sm', styles.table)}>
          <thead>
            <tr>
              <th />
              <th>{t('Name')}</th>
            </tr>
          </thead>
          <tbody>
            {units.map(unit => (
              <UnitRow unit={unit} onClick={handleClickOnUnit} key={unit.id} />
            ))}
          </tbody>
        </table>
      </article>

      {unit && <UnitWindow isOpened={isOpenedUnitWindow} unit={unit} onClose={handleCloseUnitWindow} />}
    </>
  );
});

export default Units;

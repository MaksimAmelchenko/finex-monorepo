import React, { useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Button } from '@finex/ui-kit';
import { Drawer } from '../../components/Drawer/Drawer';
import { IMoney } from '../../types/money';
import { Money } from '../../stores/models/money';
import { MoneyRow } from './MoneyRow/MoneyRow';
import { MoneyWindow } from '../MoneyWindow/MoneyWindow';
import { MoneysRepository } from '../../stores/moneys-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './Moneys.module.scss';

const t = getT('Moneys');

export const Moneys = observer(() => {
  const moneysRepository = useStore(MoneysRepository);
  const { moneys } = moneysRepository;

  const [isOpenedMoneyWindow, setIsOpenedMoneyWindow] = useState<boolean>(false);
  const [money, setMoney] = useState<Partial<IMoney> | Money | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleAddClick = () => {
    setMoney({});
    setIsOpenedMoneyWindow(true);
  };

  const selectedMoneys = moneys.filter(({ isSelected }) => isSelected);

  const handleDeleteClick = () => {
    if (selectedMoneys.length > 1) {
      if (!window.confirm(t('Are you sure you what to delete several moneys?'))) {
        return;
      }
    }
    selectedMoneys.forEach(money => {
      moneysRepository.deleteMoney(money).catch(err => {
        let message = '';
        switch (err.code) {
          case 'cashflow_detail_2_money': {
            message = t('There are transactions with this money');
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
    moneysRepository.getMoneys();
  };

  const handleClickOnMoney = (money: Money) => {
    setMoney(money);
    setIsOpenedMoneyWindow(true);
  };

  const handleCloseMoneyWindow = () => {
    setIsOpenedMoneyWindow(false);
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
              <Button variant="outlined" size="small" disabled={!selectedMoneys.length} onClick={handleDeleteClick}>
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
              <th>{t('Symbol')}</th>
              <th>{t('Active')}</th>
              <th>{t('Currency')}</th>
            </tr>
          </thead>
          <tbody>
            {moneys.map(money => (
              <MoneyRow money={money} onClick={handleClickOnMoney} key={money.id} />
            ))}
          </tbody>
        </table>
      </article>

      <Drawer isOpened={isOpenedMoneyWindow}>
        {money && <MoneyWindow money={money} onClose={handleCloseMoneyWindow} />}
      </Drawer>
    </>
  );
});

export default Moneys;

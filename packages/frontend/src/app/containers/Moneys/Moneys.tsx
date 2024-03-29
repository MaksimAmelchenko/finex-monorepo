import React, { useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Button, Coins02Icon, PlusIcon, RefreshCW01Icon, Tag01Icon } from '@finex/ui-kit';
import { Drawer } from '../../components/Drawer/Drawer';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { IMoney } from '../../types/money';
import { Money } from '../../stores/models/money';
import { MoneyRow } from './MoneyRow/MoneyRow';
import { MoneyWindow } from '../MoneyWindow/MoneyWindow';
import { MoneysRepository } from '../../stores/moneys-repository';
import { TrashIcon } from '../../components/TrashIcon/TrashIcon';
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
      if (!window.confirm(t('Are you sure you want to delete several moneys?'))) {
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

  const isDeleteButtonDisabled = Boolean(!selectedMoneys.length);
  const isNoData = Boolean(!moneys.length);

  return (
    <>
      <article className={styles.article}>
        <div className={clsx(styles.article__panel, styles.panel)}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button size="md" startIcon={<PlusIcon />} onClick={handleAddClick}>
                {t('New')}
              </Button>
              <Button
                variant="secondaryGray"
                size="md"
                startIcon={<TrashIcon disabled={isDeleteButtonDisabled} />}
                disabled={isDeleteButtonDisabled}
                onClick={handleDeleteClick}
              >
                {t('Delete')}
              </Button>
              <Button variant="secondaryGray" size="md" startIcon={<RefreshCW01Icon />} onClick={handleRefreshClick}>
                {t('Refresh')}
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          {isNoData ? (
            <div className={styles.tableWrapper__emptyState}>
              <EmptyState
                illustration={<Coins02Icon className={styles.emptyState__illustration} />}
                text={t('You do not have moneys yet')}
                supportingText={t('Start creating by clicking on\u00A0"Create\u00A0money"')}
              >
                <Button size="lg" startIcon={<PlusIcon />} onClick={handleAddClick}>
                  {t('Create money')}
                </Button>
              </EmptyState>
            </div>
          ) : (
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
          )}
        </div>
      </article>

      <Drawer open={isOpenedMoneyWindow}>
        {money && <MoneyWindow money={money} onClose={handleCloseMoneyWindow} />}
      </Drawer>
    </>
  );
});

export default Moneys;

import React, { useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Building02Icon, Button, PlusIcon, RefreshCW01Icon } from '@finex/ui-kit';
import { Contractor as ContractorModel } from '../../stores/models/contractor';
import { ContractorRow } from './Contractor/ContractorRow';
import { ContractorWindow } from '../ContractorWindow/ContractorWindow';
import { ContractorsRepository } from '../../stores/contractors-repository';
import { Drawer } from '../../components/Drawer/Drawer';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { IContractor } from '../../types/contractor';
import { TrashIcon } from '../../components/TrashIcon/TrashIcon';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './Contractors.module.scss';

const t = getT('Contractors');

export const Contractors = observer(() => {
  const contractorsRepository = useStore(ContractorsRepository);
  const { contractors } = contractorsRepository;
  const { enqueueSnackbar } = useSnackbar();

  const [isOpenedContractorWindow, setIsOpenedContractorWindow] = useState<boolean>(false);
  const [contractor, setContractor] = useState<Partial<IContractor> | ContractorModel | null>(null);

  const handleAddClick = () => {
    setContractor({});
    setIsOpenedContractorWindow(true);
  };

  const selectedContractors = contractors.filter(({ isSelected }) => isSelected);

  const handleDeleteClick = () => {
    if (selectedContractors.length > 1) {
      if (!window.confirm(t('Are you sure you want to delete several contractors?'))) {
        return;
      }
    }
    selectedContractors.forEach(contractor => {
      contractorsRepository.deleteContractor(contractor).catch(err => {
        let message = '';
        switch (err.code) {
          case 'cashflow_2_contractor': {
            message = t("You can't delete contractor with transaction");
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
    contractorsRepository.getContractors();
  };

  const handleClickOnContractor = (contractor: ContractorModel) => {
    setContractor(contractor);
    setIsOpenedContractorWindow(true);
  };

  const handleCloseContractorWindow = () => {
    setIsOpenedContractorWindow(false);
  };

  const isDeleteButtonDisabled = Boolean(!selectedContractors.length);
  const isNoData = Boolean(!contractors.length);

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
                illustration={<Building02Icon className={styles.emptyState__illustration} />}
                text={t('You do not have contractors yet')}
                supportingText={t('Start creating by clicking on\u00A0"Create\u00A0contractor"')}
              >
                <Button size="lg" startIcon={<PlusIcon />} onClick={handleAddClick}>
                  {t('Create contractor')}
                </Button>
              </EmptyState>
            </div>
          ) : (
            <table className={clsx('table table-hover table-sm', styles.table)}>
              <thead>
                <tr>
                  <th />
                  <th>{t('Name')}</th>
                  <th>{t('Note')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {contractors.map(contractor => (
                  <ContractorRow contractor={contractor} onClick={handleClickOnContractor} key={contractor.id} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </article>

      <Drawer open={isOpenedContractorWindow}>
        {contractor && <ContractorWindow contractor={contractor} onClose={handleCloseContractorWindow} />}
      </Drawer>
    </>
  );
});

export default Contractors;

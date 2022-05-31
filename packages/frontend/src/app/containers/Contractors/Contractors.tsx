import React, { useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Contractor as ContractorModel } from '../../stores/models/contractor';
import { Contractor } from './Contractor/Contractor';
import { ContractorWindow } from '../ContractorWindow/ContractorWindow';
import { ContractorsRepository } from '../../stores/contractors-repository';
import { Button } from '@finex/ui-kit';
import { IContractor } from '../../types/contractor';
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
      if (!window.confirm(t('Are you sure you what to delete several contractors?'))) {
        return;
      }
    }
    selectedContractors.forEach(contractor => {
      contractorsRepository.deleteContractor(contractor).catch(err => {
        let message: string = '';
        switch (err.code) {
          case 'cashflow_2_contractor': {
            message = t("You can't delete contractor with transaction");
            break;
          }
          default:
            message = err.data.message;
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

  return (
    <>
      <article>
        <div className={styles.panel}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button variant="contained" size="small" color="secondary" onClick={handleAddClick}>
                {t('New')}
              </Button>
              <Button
                variant="outlined"
                size="small"
                disabled={!selectedContractors.length}
                onClick={handleDeleteClick}
              >
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
              <th>{t('Note')}</th>
            </tr>
          </thead>
          <tbody>
            {contractors.map(contractor => (
              <Contractor contractor={contractor} onClick={handleClickOnContractor} key={contractor.id} />
            ))}
          </tbody>
        </table>
      </article>

      {contractor && (
        <ContractorWindow
          isOpened={isOpenedContractorWindow}
          contractor={contractor}
          onClose={handleCloseContractorWindow}
        />
      )}
    </>
  );
});

export default Contractors;

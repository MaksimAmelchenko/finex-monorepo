import React, { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { observer } from 'mobx-react-lite';

import { BackButton, Header } from '../../../components/Header/Header';
import { ConnectionsRepository } from '../../../stores/connections-repository';
import { Container } from '../../../components/Container/Container';
import { IInstitution } from '../../../types/connections';
import { Input, IOption, SearchMdIcon, SelectNative } from '@finex/ui-kit';
import { InstitutionCard } from '../InstitutionCard/InstitutionCard';
import { Loader } from '../../../components/Loader/Loader';
import { SideSheetBody } from '../../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from './AddConnectionWindow.module.scss';

interface AddConnectionsWindowProps {
  isRetrieveMaxPeriodTransactions: boolean;
  onClose: () => void;
}

const t = getT('AddConnectionWindow');

export const AddConnectionWindow = observer<AddConnectionsWindowProps>(
  ({ onClose, isRetrieveMaxPeriodTransactions }) => {
    const connectionsRepository = useStore(ConnectionsRepository);

    const [country, setCountry] = useState('DE');
    const [searchTerm, setSearchTerm] = useState('');
    const [institutions, setInstitutions] = useState<IInstitution[]>([]);

    const { countries } = connectionsRepository;

    useEffect(() => {
      if (!countries.length) {
        connectionsRepository.getCountries();
      }
    }, [connectionsRepository, countries.length]);

    useEffect(() => {
      connectionsRepository.getInstitutions(country);
    }, [connectionsRepository, country]);

    const selectCountryOptions = useMemo<IOption[]>(() => {
      return countries.map(({ code: value, name: label }) => ({ value, label }));
    }, [countries]);

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const country = event.target.value;
      setCountry(country);
    };

    const handleSearch = useCallback(
      (searchTerm: string) => {
        let institutions = connectionsRepository.institutions;

        if (searchTerm) {
          institutions = connectionsRepository.institutions.filter(({ name }) =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        setInstitutions(institutions);
      },
      [connectionsRepository.institutions]
    );

    const debouncedSearch = useCallback(
      debounce(searchTerm => handleSearch(searchTerm), 200),
      [handleSearch]
    );

    useEffect(() => {
      if (searchTerm) {
        debouncedSearch(searchTerm);
      } else {
        setInstitutions(connectionsRepository.institutions);
      }

      return () => {
        debouncedSearch.cancel();
      };
    }, [searchTerm, debouncedSearch, connectionsRepository.institutions]);

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchTerm = event.target.value;
      setSearchTerm(searchTerm);
    };

    const handleClickInstitution = useCallback(
      (institutionId: string) => {
        connectionsRepository
          .createNordigenRequisition(institutionId, { isRetrieveMaxPeriodTransactions })
          .then(({ link }) => {
            const a = document.createElement('a');
            a.setAttribute('href', link);
            a.dispatchEvent(new MouseEvent('click', { view: window, bubbles: true, cancelable: true }));
          });
      },
      [connectionsRepository]
    );

    return (
      <>
        <Header title={t('Connect a bank')} startAdornment={<BackButton onClick={onClose} />} />
        <SideSheetBody className={styles.main}>
          <Container>
            <section className={styles.main__form}>
              <SelectNative
                label={t('Country')}
                options={selectCountryOptions}
                value={country}
                onChange={handleCountryChange}
              />

              <Input
                startIcon={<SearchMdIcon />}
                placeholder={t('Search')}
                value={searchTerm}
                onChange={handleSearchTermChange}
                type="search"
              />
            </section>
          </Container>

          <section className={styles.main__content}>
            {connectionsRepository.institutionsLoadState.isPending() ? (
              <Loader />
            ) : (
              institutions.map(({ id, logo, name }) => (
                <InstitutionCard id={id} logo={logo} name={name} onClick={handleClickInstitution} key={id} />
              ))
            )}
          </section>
        </SideSheetBody>
      </>
    );
  }
);

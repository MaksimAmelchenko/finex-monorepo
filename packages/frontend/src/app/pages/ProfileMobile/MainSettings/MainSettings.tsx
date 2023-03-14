import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Form, FormBody, FormButton, FormInput } from '../../../components/Form';
import { FormSelectNative } from '../../../components/Form/FormSelectNative/FormSelectNative';
import { IOption } from '@finex/ui-kit';
import { ProfileRepository } from '../../../stores/profile-repository';
import { ProjectsRepository } from '../../../stores/projects-repository';
import { Shape } from '../../../types';
import { UpdateProfileChanges } from '../../../types/profile';
import { getPatch } from '../../../lib/core/get-patch';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from '../ProfileMobileContent.module.scss';

interface IFormValues {
  name: string;
  email: string;
  projectId: string | null;
}

const t = getT('Profile');

export const MainSettings = observer(() => {
  const { projects } = useStore(ProjectsRepository);
  const profileRepository = useStore(ProfileRepository);
  const { enqueueSnackbar } = useSnackbar();

  const { profile } = profileRepository;

  const selectProjectOptions = useMemo<IOption[]>(() => {
    return projects.map(({ id: value, name: label }) => ({ value, label }));
  }, [projects]);

  const onSubmit = useCallback(
    ({ name, projectId }: IFormValues) => {
      if (!profile) {
        return;
      }
      const changes: UpdateProfileChanges = getPatch(
        { name: profile.name, projectId: profile.project?.id },
        { name, projectId }
      );

      return profileRepository.updateProfile(changes).then(() => {
        enqueueSnackbar(t('Profile has been updated'), { variant: 'success' });
      });
    },
    [profileRepository, profile]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<IFormValues>>({
        name: Yup.string().required(t('Please enter name')),
      }),
    []
  );

  if (!profile) {
    return null;
  }

  const { name, email, timeout, project } = profile;

  return (
    <div className={styles.section}>
      <div className={clsx(styles.section__header, styles.header)}>
        <h2 className={styles.header__title}>{t('Main settings')}</h2>
      </div>

      <Form<IFormValues>
        onSubmit={onSubmit}
        initialValues={{ name, email, projectId: project?.id ?? null }}
        validationSchema={validationSchema}
        name="profile-settings-mobile"
      >
        <FormBody>
          <FormInput name="email" type="email" label={t('E-mail')} readOnly disabled />
          <FormInput name="name" type="text" label={t('Name')} />
          <FormSelectNative name="projectId" label={t('Project by default')} options={selectProjectOptions} />
        </FormBody>

        <footer className={styles.section__footer}>
          <FormButton type="submit" variant="primary" size="sm" isIgnoreValidation>
            {t('Update profile settings')}
          </FormButton>
        </footer>
      </Form>
    </div>
  );
});

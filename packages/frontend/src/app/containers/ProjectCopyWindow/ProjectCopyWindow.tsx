import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import { Drawer } from '../../components/Drawer/Drawer';
import { DrawerFooter } from '../../components/Drawer/DrawerFooter';
import { Form, FormButton, FormLayout, FormTextField } from '../../components/Form';
import { FormSelect } from '../../components/Form/FormSelect/FormSelect';
import { ISelectOption } from '@finex/ui-kit';
import { Project } from '../../stores/models/project';
import { ProjectsRepository } from '../../stores/projects-repository';
import { Shape } from '../../types';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './ProjectCopyWindow.module.scss';

interface CopyProjectFormValues {
  projectId: string;
  name: string;
}

interface ProjectCopyWindowProps {
  isOpened: boolean;
  project?: Project | null;
  onClose: () => unknown;
}

const t = getT('ProjectCopyWindow');

export function ProjectCopyWindow({ isOpened, project, onClose }: ProjectCopyWindowProps): JSX.Element {
  const projectsRepository = useStore(ProjectsRepository);
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = useCallback(
    ({ projectId, name }: CopyProjectFormValues) => {
      return projectsRepository
        .copyProject(projectId, { name })
        .then(() => {
          onClose();
        })
        .catch(err => {
          let message = '';
          switch (err.code) {
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [projectsRepository, enqueueSnackbar, onClose]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<CopyProjectFormValues>>({
        name: Yup.string().required('Enter a project name'),
      }),
    []
  );

  const selectProjectsOptions = useMemo<ISelectOption[]>(() => {
    return projectsRepository.projects.map(({ id: value, name: label }) => ({ value, label }));
  }, [projectsRepository.projects]);

  const initProject = project || projectsRepository.projects[0];

  return (
    <Drawer isOpened={isOpened} title={t('Copy project')} onClose={onClose}>
      <Form<CopyProjectFormValues>
        onSubmit={onSubmit}
        initialValues={{
          projectId: initProject.id,
          name: '',
        }}
        validationSchema={validationSchema}
        className={styles.form}
      >
        <div className={styles.form__bodyWrapper}>
          <FormLayout className={styles.form__body}>
            <FormSelect name="projectId" label={t('Project to be copied')} options={selectProjectsOptions} />
            <FormTextField name="name" label={t('Project name')} />
          </FormLayout>
        </div>

        <DrawerFooter className={styles.footer}>
          <FormButton variant="outlined" isIgnoreValidation onClick={onClose}>
            {t('Cancel')}
          </FormButton>
          <FormButton type="submit" color="secondary" isIgnoreValidation>
            {t('Copy project')}
          </FormButton>
        </DrawerFooter>
      </Form>
    </Drawer>
  );
}

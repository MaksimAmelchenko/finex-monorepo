import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import { Form, FormBody, FormButton, FormFooter, FormHeader, FormSelect, FormTextField } from '../../components/Form';
import { ISelectOption } from '@finex/ui-kit';
import { Project } from '../../stores/models/project';
import { ProjectsRepository } from '../../stores/projects-repository';
import { Shape } from '../../types';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

interface CopyProjectFormValues {
  projectId: string;
  name: string;
}

interface ProjectCopyWindowProps {
  project?: Project | null;
  onClose: () => unknown;
}

const t = getT('ProjectCopyWindow');

export function ProjectCopyWindow({ project, onClose }: ProjectCopyWindowProps): JSX.Element {
  const projectsRepository = useStore(ProjectsRepository);
  const { enqueueSnackbar } = useSnackbar();

  const nameFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.focus();
    }
  }, []);

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
        name: Yup.string().required(t('Enter a project name')),
      }),
    []
  );

  const selectProjectsOptions = useMemo<ISelectOption[]>(() => {
    return projectsRepository.projects.map(({ id: value, name: label }) => ({ value, label }));
  }, [projectsRepository.projects]);

  const initProject = project || projectsRepository.projects[0];

  return (
    <Form<CopyProjectFormValues>
      onSubmit={onSubmit}
      initialValues={{
        projectId: initProject.id,
        name: '',
      }}
      validationSchema={validationSchema}
    >
      <FormHeader title={t('Copy project')} onClose={onClose} />

      <FormBody>
        <FormSelect name="projectId" label={t('Project to be copied')} options={selectProjectsOptions} />
        <FormTextField name="name" label={t('Project name')} ref={nameFieldRefCallback} />
      </FormBody>

      <FormFooter>
        <FormButton variant="outlined" isIgnoreValidation onClick={onClose}>
          {t('Cancel')}
        </FormButton>
        <FormButton type="submit" color="primary" isIgnoreValidation>
          {t('Copy project')}
        </FormButton>
      </FormFooter>
    </Form>
  );
}

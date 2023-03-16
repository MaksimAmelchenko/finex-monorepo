import React, { useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { BackButton, DeleteButton, Header } from '../../components/Header/Header';
import { CreateProjectData, IProject, UpdateProjectChanges } from '../../types/project';
import { Form, FormBody, FormButton, FormInput } from '../../components/Form';
import { FormTextAreaField } from '../../components/Form/FormTextArea2/FormTextArea';
import { ISelectOption } from '@finex/ui-kit';
import { ProfileRepository } from '../../stores/profile-repository';
import { Project } from '../../stores/models/project';
import { ProjectsRepository } from '../../stores/projects-repository';
import { Shape } from '../../types';
import { UsersRepository } from '../../stores/users-repository';
import { analytics } from '../../lib/analytics';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './ProjectWindowMobile.module.scss';

interface ProjectFormValues {
  name: string;
  note: string;
  editors: string[];
}

interface ProjectWindowMobileProps {
  project: Partial<IProject> | Project;
  onClose: () => unknown;
}

const t = getT('ProjectWindow');

function mapValuesToCreatePayload({ name, note, editors }: ProjectFormValues): CreateProjectData {
  return {
    name,
    note,
    editors,
  };
}

function mapValuesToUpdatePayload({ name, note, editors }: ProjectFormValues): UpdateProjectChanges {
  return {
    name,
    note,
    editors,
  };
}

export function ProjectWindowMobile({ project, onClose }: ProjectWindowMobileProps): JSX.Element {
  const projectsRepository = useStore(ProjectsRepository);
  const profileRepository = useStore(ProfileRepository);
  const usersRepository = useStore(UsersRepository);

  const isNew = !(project instanceof Project);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    analytics.view({
      page_title: 'project-mobile',
    });
  }, []);

  const nameFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      // node.focus();
      requestAnimationFrame(() => node.focus());
    }
  }, []);

  const onSubmit = useCallback(
    (values: ProjectFormValues, _: FormikHelpers<ProjectFormValues>, initialValues: ProjectFormValues) => {
      let result: Promise<unknown>;
      if (isNew) {
        const data: CreateProjectData = mapValuesToCreatePayload(values);
        result = projectsRepository.createProject(data);
      } else {
        const changes: UpdateProjectChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = projectsRepository.updateProject(project, changes);
      }

      return result
        .then(() => {
          onClose();
        })
        .catch(err => {
          let message = '';
          switch (err.code) {
            case 'project_id_user_name_u':
              message = t('That name is taken. Try another.');
              break;
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [project, projectsRepository, enqueueSnackbar, onClose]
  );

  const handleDeleteClick = () => {
    if (!window.confirm(t('Are you sure you want to delete this project?'))) {
      return;
    }

    projectsRepository
      .deleteProject(project as Project)
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
  };

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<ProjectFormValues>>({
        name: Yup.string().required(t('Enter a project name')),
      }),
    []
  );

  const selectUsersOptions = useMemo<ISelectOption[]>(() => {
    return usersRepository.users
      .filter(({ id }) => id !== profileRepository.profile!.user.id)
      .map(({ id: value, name: label }) => ({ value, label }));
  }, [profileRepository.profile, usersRepository.users]);

  const { name, note, editors } = project;

  return (
    <Form<ProjectFormValues>
      onSubmit={onSubmit}
      initialValues={{
        name: name ?? '',
        note: note ?? '',
        editors: editors?.map(({ id }) => id) ?? [],
      }}
      validationSchema={validationSchema}
      name="project-mobile"
    >
      <Header
        title={isNew ? t('New project') : t('Edit project')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={!isNew && <DeleteButton onClick={handleDeleteClick} />}
      />
      <FormBody className={styles.main}>
        <FormInput name="name" label={t('Project name')} ref={nameFieldRefCallback} />
        <FormTextAreaField name="note" label={t('Project description (optional)')} />

        {/*
        <FormFieldSet legend={t('Permissions')}>
          <FormSelect
            name="editors"
            isMulti
            label={t('Editors')}
            options={selectUsersOptions}
            helperText={t('List of users who have the right to add, edit and delete transactions on this project')}
          />
        </FormFieldSet>
        */}
      </FormBody>

      <footer className={styles.footer}>
        <FormButton type="submit" color="primary" isIgnoreValidation>
          {isNew ? t('Create project') : t('Save')}
        </FormButton>
      </footer>
    </Form>
  );
}

import React, { useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { BackButton, DeleteButton, Header } from '../../components/Header/Header';
import { CreateTagData, ITag, UpdateTagChanges } from '../../types/tag';
import { Form, FormBody, FormButton, FormInput } from '../../components/Form';
import { Shape } from '../../types';
import { Tag } from '../../stores/models/tag';
import { TagsRepository } from '../../stores/tags-repository';
import { analytics } from '../../lib/analytics';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './TagWindowMobile.module.scss';

interface TagFormValues {
  name: string;
}

interface TagWindowMobileProps {
  tag: Partial<ITag> | Tag;
  onClose: () => unknown;
}

const t = getT('TagWindow');

function mapValuesToPayload({ name }: TagFormValues): CreateTagData {
  return {
    name,
  };
}

export function TagWindowMobile({ tag, onClose }: TagWindowMobileProps): JSX.Element {
  const tagsRepository = useStore(TagsRepository);

  const { enqueueSnackbar } = useSnackbar();

  const isNew = !(tag instanceof Tag);

  useEffect(() => {
    analytics.view({
      page_title: 'tag-mobile',
    });
  }, []);

  const nameFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      // node.focus();
      requestAnimationFrame(() => node.focus());
    }
  }, []);

  const onSubmit = useCallback(
    (values: TagFormValues, _: FormikHelpers<TagFormValues>, initialValues: TagFormValues) => {
      let result: Promise<unknown>;
      if (isNew) {
        const data: CreateTagData = mapValuesToPayload(values);
        result = tagsRepository.createTag(data);
      } else {
        const changes: UpdateTagChanges = getPatch(mapValuesToPayload(initialValues), mapValuesToPayload(values));
        result = tagsRepository.updateTag(tag, changes);
      }

      return result
        .then(() => {
          onClose();
        })
        .catch(err => {
          let message = '';
          switch (err.code) {
            case 'tag_id_project_name_u':
              message = t('Tag already exists');
              break;
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [enqueueSnackbar, isNew, onClose, tag, tagsRepository]
  );

  const handleDeleteClick = () => {
    tagsRepository
      .deleteTag(tag as Tag)
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
      Yup.object<Shape<TagFormValues>>({
        name: Yup.string().required(t('Please fill name')),
      }),
    []
  );

  const { name } = tag;

  return (
    <Form<TagFormValues>
      onSubmit={onSubmit}
      initialValues={{
        name: name ?? '',
      }}
      validationSchema={validationSchema}
      name="tag-mobile"
    >
      <Header
        title={isNew ? t('Add new tag') : t('Edit tag')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={!isNew && <DeleteButton onClick={handleDeleteClick} />}
      />

      <FormBody className={styles.main}>
        <FormInput name="name" label={t('Name')} ref={nameFieldRefCallback} />
      </FormBody>

      <footer className={styles.footer}>
        <FormButton type="submit" variant="primary" isIgnoreValidation>
          {t('Save')}
        </FormButton>
      </footer>
    </Form>
  );
}

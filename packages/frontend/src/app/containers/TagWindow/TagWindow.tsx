import React, { useCallback, useMemo, useRef } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { CreateTagData, ITag, UpdateTagChanges } from '../../types/tag';
import { Drawer } from '../../components/Drawer/Drawer';
import { DrawerFooter } from '../../components/Drawer/DrawerFooter';
import { Form, FormButton, FormLayout, FormTextField } from '../../components/Form';
import { Shape } from '../../types';
import { Tag } from '../../stores/models/tag';
import { TagsRepository } from '../../stores/tags-repository';
import { getPatch } from '../../lib/core/get-path';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './TagWindow.module.scss';

interface TagFormValues {
  name: string;
}

interface TagWindowProps {
  isOpened: boolean;
  tag: Partial<ITag> | Tag;
  onClose: () => unknown;
}

const t = getT('TagWindow');

function mapValuesToPayload({ name }: TagFormValues): CreateTagData {
  return {
    name,
  };
}
export function TagWindow({ isOpened, tag, onClose }: TagWindowProps): JSX.Element {
  const tagsRepository = useStore(TagsRepository);
  const { enqueueSnackbar } = useSnackbar();

  const nameFieldRef = useRef<HTMLInputElement | null>(null);

  const handleOnOpen = useCallback(() => {
    nameFieldRef.current?.focus();
  }, []);

  const onSubmit = useCallback(
    (values: TagFormValues, _: FormikHelpers<TagFormValues>, initialValues: TagFormValues) => {
      let result: Promise<unknown>;
      if (tag instanceof Tag) {
        const changes: UpdateTagChanges = getPatch(mapValuesToPayload(initialValues), mapValuesToPayload(values));
        result = tagsRepository.updateTag(tag, changes);
      } else {
        const data: CreateTagData = mapValuesToPayload(values);
        result = tagsRepository.createTag(data);
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
    [enqueueSnackbar, onClose, tag, tagsRepository]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<TagFormValues>>({
        name: Yup.string().required('Please fill name'),
      }),
    []
  );

  const { name } = tag;

  return (
    <Drawer
      isOpened={isOpened}
      title={tag instanceof Tag ? t('Edit tag') : t('Add new tag')}
      onClose={onClose}
      onOpen={handleOnOpen}
    >
      <Form<TagFormValues>
        onSubmit={onSubmit}
        initialValues={{
          name: name ?? '',
        }}
        validationSchema={validationSchema}
        className={styles.form}
      >
        <div className={styles.form__bodyWrapper}>
          <FormLayout className={styles.form__body}>
            <FormTextField name="name" label={t('Name')} ref={nameFieldRef} />
          </FormLayout>
        </div>
        <DrawerFooter className={styles.footer}>
          <FormButton variant="outlined" isIgnoreValidation onClick={onClose}>
            {t('Cancel')}
          </FormButton>
          <FormButton type="submit" color="secondary" isIgnoreValidation>
            {t('Save')}
          </FormButton>
        </DrawerFooter>
      </Form>
    </Drawer>
  );
}

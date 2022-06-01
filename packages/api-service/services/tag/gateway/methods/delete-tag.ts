import { Tag } from '../../model/tag';
import { IRequestContext } from '../../../../types/app';

export async function deleteTag(ctx: IRequestContext, projectId: string, tagId: string): Promise<void> {
  ctx.log.trace({ tagId }, 'try to delete tag');
  const idProject = Number(projectId);
  const idTag = Number(tagId);

  const knex = Tag.knex();
  await knex
    .raw(
      `
        update cf$.cashFlow_detail cfd
           set tags = array_remove (tags, ?)
         where cfd.id_project = ?
           and cfd.tags && array[?]::int[];
    `,
      [idTag, idProject, idTag]
    )
    .transacting(ctx.trx);

  await knex
    .raw(
      `
        update cf$.cashFlow cf
           set tags = array_remove (tags, ?)
         where cf.id_project = ?
           and cf.tags && array[?]::int[];
    `,
      [idTag, idProject, idTag]
    )
    .transacting(ctx.trx);

  await Tag.query(ctx.trx).delete().where({
    idProject,
    idTag,
  });

  ctx.log.info({ tagId }, 'deleted tag');
}

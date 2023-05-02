import { IModel } from './app';

const bucket: string = process.env.FILE_BUCKET!;

export type TContent = any;

export interface IFile extends IModel {
  userId: number;
  projectId: number;
  id: number;
  contentType: string;
  name: string;
  size: number;
  content?: TContent;
}

export interface IPublicFile extends IModel {
  projectId: number;
  id: number;
  userId: number;
  contentType: string;
  name: string;
  size: number;
  content?: TContent;
}

export interface ICreateParams {
  contentType: string;
  name: string;
  size: number;
}

export interface ISaveParams extends ICreateParams {
  content: TContent;
}

export interface IUpdateParams {
  contentType?: string;
  name?: string;
  size?: number;
}

export interface INotModified {
  status: 304;
}

export interface IDownloadFile {
  filename: string;
  content: TContent;
  contentType: string;
}

export interface IUploadedFile {
  name: string;
  contentType: string;
  content: TContent;
  size: number;
}

export interface ISendFile {
  content: TContent;
  contentType: string;
  ETag: string;
}

export { bucket };

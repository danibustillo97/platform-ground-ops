export interface FileObject {
  id_case: string;
  fileUrl: string;
  file: File;
  mediaSave?: boolean;
  image_id?: string;
}


export interface FileObjectLoad extends Omit<FileObject, "id_case"> { id_case: string; }
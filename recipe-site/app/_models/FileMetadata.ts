import { FileRole } from "../_constants/FileRole";

export default class FileMetadata {
    fileId: number;
    uuId: string;
    filename: string;
    contentType: string;
    sizeBytes: number;
    fileRole: FileRole;
    url: string | undefined;

    constructor(
        fileId: number,
        uuId: string,
        filename: string,
        contentType: string,
        sizeBytes: number,
        fileRole: FileRole,
        url?: string
    ) {
        this.fileId = fileId;
        this.uuId = uuId;
        this.filename = filename;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
        this.fileRole = fileRole;
        this.url = url;
    }
}
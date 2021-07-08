import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { environment } from '@environments/environment';
import { AttachmentList } from '@models/attachmentList';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  baseUrl = environment.apiUrl + 'initiative/';

  constructor(private http: HttpClient) { }

  GetAttachment(id) {
    return this.http.get<AttachmentList>(this.baseUrl + 'Attachment/' + id);
  }

  GetDownloadAttachment(id, fileName) {
    return this.http.get(this.baseUrl + 'DownloadBlob/' + id + '/' + fileName,  { responseType: 'blob' });
  }

  DeleteAttachment(id) {
    return this.http.delete(this.baseUrl + 'Attachment/' + id);
  }
}

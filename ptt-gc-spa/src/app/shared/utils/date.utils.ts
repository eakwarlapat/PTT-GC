import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtil {

  GetDate(date) {
    return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
  }

  SetDate(date) {
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  }

  SetYear(date) {
    return date.getFullYear().toString();
  }
}

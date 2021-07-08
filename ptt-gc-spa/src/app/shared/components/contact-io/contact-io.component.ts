import { Component, OnInit, ViewChild, ElementRef, OnChanges, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ContactService } from '@services/contact/contact.service';
import { AuthService } from '@services/authentication/auth.service';

@Component({
  selector: 'app-contact-io',
  templateUrl: './contact-io.component.html',
  styleUrls: ['./contact-io.component.css']
})
export class ContactIoComponent implements OnInit, OnChanges {

  @ViewChild('CommentText') el: ElementRef;

  @Input() id;

  @Output() modelClose = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private contactService: ContactService
  ) { }

  contact = this.fb.group({ contactIO : '', contactIOBy : '' });

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    setTimeout(() => this.el.nativeElement.focus(), 200);
  }

  CloseModal() {
    this.contact.patchValue({ contactIO : '', contactIOBy : '' });
    this.modelClose.emit();
  }

  Save() {
    this.authService.getUser().subscribe((user) => {
      this.contact.patchValue({ contactIOBy : user.username });
      this.contactService.ContactIO(this.id, this.contact.value).subscribe(() => {});
      this.CloseModal();
    });
  }

}

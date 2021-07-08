import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { InitiativeService } from '@services/initiative/initiative.service';
import { AuthService } from '@services/authentication/auth.service';
import { UnauthorizedService } from '@errors/unauthorized/unauthorized.service';
import { FormBuilder } from '@angular/forms';
import { DateUtil } from '@utils/date.utils';
import { ImpactService } from '@services/impact/impact.service';
import { MaxService } from '@services/max/max.service';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.css']
})
export class AdvanceSearchComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private dateUtil: DateUtil,
    private authService: AuthService,
    private unauthorized: UnauthorizedService,
    private initiativeService: InitiativeService,
    private impactService: ImpactService,
    private maxService: MaxService,
  ) { }

  @Input() name: string;

  @Input() progress: boolean;
  @Input() complete: boolean;
  @Input() cancel: boolean;

  @Output() modelClose = new EventEmitter();
  @Output() AdvancedSearch = new EventEmitter();

  params: any = {};
  owners: any = [];
  organizations: any = [];
  plants: any = [];
  typeOfInvestments: any = [];
  workStreams: any = [];
  subWorkstreams: any = [];

  advancedSearchForm = this.fb.group({
    id: '',
    name: '',
    status: '',
    type: '',
    registerDateSince: '',
    registerDateTo: '',
    ownerName: null,
    organization: null,
    plant: null,
    typeOfInvestment: null,
    username: '',
    progress: true,
    complete: true,
    cancel: true,
    workstream: '',
    subWorkstream2: { value: '', disabled: true }
  });

  bsConfig = { isAnimated: true, dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false };

  ngOnInit(): void {
    this.initiativeService.GetOwners().subscribe(owners => this.owners = owners);
    this.initiativeService.GetOrganizations().subscribe(organizations => this.organizations = organizations);
    this.impactService.GetWorkStream().subscribe(workStreams => this.workStreams = workStreams);
    this.initiativeService.GetTypeOfInvestments().subscribe(typeOfInvestments => {
      this.typeOfInvestments = typeOfInvestments;
      this.typeOfInvestments.push({ id: 9999, typeOfInvestment: 'Others', typeOfInvestmentTitle: 'Others' });
    });
    this.initiativeService.GetPlants().subscribe(plants => {
      this.plants = plants;
      this.plants.push({ id: 9999, plantId: 'P9999', plantTitle: 'Others (please specify)' });
    });
  }

  HideModal() {
    this.modelClose.emit();
  }

  AdvanceSearch(): void {
    console.log('Test', this.name);
    const statusProgress = this.progress;
    const statusComplete = this.complete;
    const statusCancel = this.cancel;
    const DateSince = this.advancedSearchForm.value.registerDateSince;
    const DateTo = this.advancedSearchForm.value.registerDateTo;
    const setDateSince = DateSince ? this.dateUtil.SetDate(this.advancedSearchForm.value.registerDateSince) : null;
    const setDateTo = DateTo ? this.dateUtil.SetDate(this.advancedSearchForm.value.registerDateTo) : null;
    this.advancedSearchForm.patchValue({
      progress: statusProgress,
      complete: statusComplete,
      cancel: statusCancel,
      registerDateSince: setDateSince,
      registerDateTo: setDateTo
    });
    switch (this.name) {
      case 'My Tasks':
        this.authService.getUser().subscribe((user) => {
          this.advancedSearchForm.patchValue({ username: user.username });
          this.AdvancedSearch.emit(this.advancedSearchForm.value);
          this.PatchSearch();
        }, error => this.unauthorized.error(error));
        break;
      case 'My Own Initiatives':
        this.authService.getUser().subscribe((user) => {
          this.advancedSearchForm.patchValue({ username: user.username });
          this.AdvancedSearch.emit(this.advancedSearchForm.value);
          this.PatchSearch();
        }, error => this.unauthorized.error(error));
        break;
      case 'Overview':
        this.AdvancedSearch.emit(this.advancedSearchForm.value);
        this.PatchSearch();
        break;
    }
    this.GetOwners();
  }

  PatchSearch() {
    this.advancedSearchForm.patchValue({
      id: '',
      username: '',
      name: '',
      status: '',
      type: '',
      registerDateSince: '',
      registerDateTo: '',
      ownerName: null,
      organization: null,
      plant: null,
      typeOfInvestment: null,
    });
  }

  SearchOwnerName(event) {
    this.GetOwners(event.term);
  }

  ClearOwnerName() {
    this.GetOwners();
  }

  GetOwners(Text?) {
    this.params.text = Text ? Text : '';
    this.initiativeService.GetOwners(this.params).subscribe(owners => {
      this.owners = owners;
    });
  }

  OnChangeWorkstream(event) {
    const workstreamName = event.target.value;
    this.advancedSearchForm.controls.subWorkstream2.enable();
    this.advancedSearchForm.patchValue({subWorkstream2: ''});
    this.maxService.GetSubWorkstream(workstreamName).subscribe(subWorkstream => this.subWorkstreams = subWorkstream);
  }

}

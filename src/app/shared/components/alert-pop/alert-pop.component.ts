import { Component, OnInit, Input } from '@angular/core';
import { AlertPopService } from './alert-pop.service';
import { Subscription, Observable } from 'rxjs';
import { CommonMethodsService } from '../../../candidate/services/common-method.service';

@Component({
  selector: 'app-alert-pop',
  templateUrl: './alert-pop.component.html',
  styleUrls: ['./alert-pop.component.css']
})
export class AlertPopComponent implements OnInit {

    @Input() id: string;
    @Input() message : string;
    @Input() type : string;
    @Input() showAlert : boolean;

    alert = null;
    subscription:Subscription;
    colors = {
      'success' : 'green',
      'danger' : 'red',
      'info' : '#31708f',
    }

    constructor(private alertService: AlertPopService,
      private commonMethodsService : CommonMethodsService) { }

    ngOnInit() {
      this.subscription = this.alertService.messenger$.subscribe((alert) => {
        if (alert && !alert.message) {
          this.alert = null;
          return;
        }else if(alert && alert.message){
          this.alert = alert;
          this.commonMethodsService.bodyUnscrollable();
        }

      });
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

    close() {
      this.commonMethodsService.bodyScrollable();
      this.alert = null
    }
}

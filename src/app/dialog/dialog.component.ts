import { Component, OnInit,OnDestroy,ChangeDetectorRef,Input,Output,EventEmitter} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import {DataService} from '../data.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit, OnDestroy {
  constructor(private service: DataService,private changeDetectorRef: ChangeDetectorRef) {
   this.service.updateCartProducts().subscribe((data) => {
      this.allRecord=data.data;
      this.changeDetectorRef.detectChanges();
    },(err)=>{
      this.allRecord="";
    });
   }
  public dialogType:string='loader';
  public allRecord:any;
  onDialogType$Subscription: Subscription;
  public productUpdate:boolean=false;
  pId:any;
  @Output()
  uploaded:EventEmitter<string> = new EventEmitter();
  ngOnInit() {
   this.service.updateCartProducts().subscribe((data) => {
      this.allRecord=data.data;
      this.changeDetectorRef.detectChanges();
    },(err)=>{
      this.allRecord="";
    });
  }
  closeDialog(){
    this.service.hidePopUp();
  }
  ngOnDestroy() {
    if (this.onDialogType$Subscription) {
      this.onDialogType$Subscription.unsubscribe();
    }
  }
  updatedProduct(){
   this.service.updateCartProducts().subscribe((data) => {
      this.allRecord=data.data;
      this.changeDetectorRef.detectChanges();
    // console.log(searchData);
    },(err)=>{
      this.allRecord="";
    })
  }
  updateProductList(){
   this.service.updateProducts(this.pId,this.productUpdate).subscribe((data) => {
      this.updatedProduct();
    });
  }
  deleteProduct(product){
   this.productUpdate=false;  
   this.pId=product._id;
   this.updateProductList();
   this.uploaded.emit('complete');
  }

}

import { Component,ChangeDetectorRef,ViewChild } from '@angular/core';
import {DataService} from './data.service';
import{DialogComponent} from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
   @ViewChild(DialogComponent) child:DialogComponent;
  constructor(private service: DataService,private changeDetectorRef:ChangeDetectorRef) {
   var cartCount = 0;
   let cartItems=(this.service.getStorage('order_items'))?JSON.parse(this.service.getStorage('order_items')):[];
   this.service.getProducts().subscribe((data)=>{
      this.allRecord=data.data;
      console.log(this.allRecord);
      this.changeDetectorRef.detectChanges();
    // console.log(searchData);
    },(err)=>{
      this.allRecord="";
    })
   this.updateCart();
   }
  title = 'app';
  public searchRecord:any;
  public allRecord:any;
  cartCount:any;
  cartPrice:any;
  public productUpdate:boolean=false;
  public pId:number;

  ngOnInit(){
    this.service.getProducts().subscribe((data)=>{
      this.allRecord=data.data;
      
    // console.log(searchData);
    },(err)=>{
      this.allRecord="";
    })
  }

  updatedProduct(){
   this.service.getProducts().subscribe((data)=>{
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
      this.updateCart();
    });
  }
  updateCart(){
   let totalPrice=0;
   this.service.updateCartProducts().subscribe((data) => {
      this.cartCount=data.data.length;
      //alert(this.cartCount);
      if(data.data.length>0){
         let cartProduct=data.data;
         for(let i=0;i<data.data.length;i++){
            totalPrice+=parseInt(cartProduct[i].price);
            //alert(totalPrice);
         }
         
      }
      this.cartPrice=totalPrice;
    });
  }

  addToCart(e,product:any){
   this.productUpdate=true;  
   this.pId=product._id;
   this.updateProductList();
  
  }

  viewCart(){
   this.service.showPopUp();
   this.child.ngOnInit();
  }
  updateRecord(e){
   this.service.getProducts().subscribe((data)=>{
      this.allRecord=data.data;
      console.log(this.allRecord);
      
    // console.log(searchData);
    },(err)=>{
      this.allRecord="";
    })
    this.updateCart();
    this.changeDetectorRef.detectChanges();
  }
}

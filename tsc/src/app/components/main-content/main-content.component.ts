import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css'],
  standalone: true,
  imports: [CommonModule]
})

export class MainContentComponent implements OnDestroy {
  [x: string]: any;
  currentView: string = 'menu';
  currentTable: string = '3';
  activeOrders: { [key: string]: any } = {};
  currentOrderId: string = this.generateOrderId();
  discountAmount: number = 0;
  selectedItems: any[] = [];
  orderNotes: string = '';
  orderStatus: string = 'active';
  orderTotal: number = 0;
  orderDiscount: number = 0;
  orderFinalTotal: number = 0;
  orderId: string = this.generateOrderId();
  orderTable: string = this.currentTable;
  orderItems: any[] = [];
  orderDiscountAmount: number = 0;
  orderNotesText: string = '';
  orderStatusText: string = 'active';
  orderIdText: string = this.generateOrderId();
  orderTableText: string = this.currentTable;
  orderItemsText: any[] = [];
  orderDiscountText: number = 0;
  orderNotesTextArea: string = '';
  orderStatusTextArea: string = 'active';
  orderIdTextArea: string = this.generateOrderId();
  orderTableTextArea: string = this.currentTable;
  orderItemsTextArea: any[] = [];
  orderDiscountTextArea: number = 0;
  orderNotesTextAreaText: string = '';
  orderStatusTextAreaText: string = 'active';
  orderIdTextAreaText: string = this.generateOrderId();
  orderTableTextAreaText: string = this.currentTable;
  orderItemsTextAreaText: any[] = [];
  orderDiscountTextAreaText: number = 0;
  orderIdTextAreaTextArea: string = this.generateOrderId();
  orderTableTextAreaTextArea: string = this.currentTable;
  orderItemsTextAreaTextArea: any[] = [];
  orderDiscountTextAreaTextArea: number = 0;
  orderNotesTextAreaTextArea: string = '';
  orderStatusTextAreaTextArea: string = 'active';
  sidebarCollapsed: boolean = false;
  private sidebarSubscription: Subscription;
  isMobileView: boolean = window.innerWidth <= 768;

  constructor(public commonService: CommonService) {
    this.sidebarSubscription = this.commonService.sidebarCollapsed$.subscribe(collapsed => {
      this.sidebarCollapsed = collapsed;
    });
    // Initialize with one active order
    this.activeOrders[this.currentOrderId] = {
      table: this.currentTable,
      items: [
        { name: 'Masala Chai', price: 40, quantity: 2 },
        { name: 'Cappuccino', price: 80, quantity: 1 },
        { name: 'Sandwich', price: 120, quantity: 1 }
      ],
      discount: 0,
      notes: '',
      status: 'active'
    };
    this.orderId = this.currentOrderId;
    this.orderTable = this.currentTable;
    this.orderItems = [];
    this.orderDiscount = 0;
    this.orderNotes = '';
    this.orderStatus = 'active';
    this.orderTotal = 0;
    this.orderDiscountAmount = 0;
    this.orderFinalTotal = 0;
    this.orderIdText = this.currentOrderId;
    this.orderTableText = this.currentTable;
    this.orderItemsText = [];
    this.orderDiscountText = 0;
    this.orderNotesText = '';
    this.orderStatusText = 'active';
    this.orderIdTextArea = this.currentOrderId;
    this.orderTableTextArea = this.currentTable;
    this.orderItemsTextArea = [];
    this.orderDiscountTextArea = 0;
    this.orderNotesTextArea = '';
    this.orderStatusTextArea = 'active';
    this.orderIdTextAreaText = this.currentOrderId;
    this.orderTableTextAreaText = this.currentTable;
    this.orderItemsTextAreaText = [];
    this.orderDiscountTextAreaText = 0;
    this.orderNotesTextAreaText = '';
    this.orderStatusTextAreaText = 'active';
    this.orderIdTextAreaTextArea = this.currentOrderId;
    this.orderTableTextAreaTextArea = this.currentTable;
    this.orderItemsTextAreaTextArea = [];
    this.orderDiscountTextAreaTextArea = 0;
    this.orderNotesTextAreaTextArea = '';
    this.orderStatusTextAreaTextArea = 'active';
    this.orderIdTextAreaTextArea = this.currentOrderId;
    this.orderTableTextAreaTextArea = this.currentTable;
    this.orderItemsTextAreaTextArea = [];
    this.orderDiscountTextAreaTextArea = 0;
    this.orderNotesTextAreaTextArea = '';
    this.orderStatusTextAreaTextArea = 'active';
    this.renderOrderTabs();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobileView = event.target.innerWidth <= 768;
  }

  isMobile(): boolean {
    return this.isMobileView;
  }

  ngOnDestroy() {
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  addToOrder(item: any): void {
    const ind = this.commonService.selectedItems.findIndex((i: any) => i.name === item.name);
    if (ind !== -1) {
      this.commonService.selectedItems[ind].quantity++;
    } else {
      this.commonService.selectedItems.push({ ...item, quantity: 1 });
    }
    this.commonService.totalPriceAmount += item.price;
  }

  clearOrder() {
    this.commonService.selectedItems = [];
    this.commonService.totalPriceAmount = 0;
  }

  removeOrder(index: number) {
    this.commonService.selectedItems.splice(index, 1);
    this.commonService.totalPriceAmount = this.commonService.selectedItems.reduce((sum: any, item: { price: any; quantity: any; }) => sum + (item.price * item.quantity), 0);
  }

  increaseQuantity(item: any) {
    const ind = this.commonService.selectedItems.findIndex((i: any) => i.name === item.name);
    if (ind !== -1) {
      this.commonService.selectedItems[ind].quantity++;
      this.commonService.totalPriceAmount += item.price;
    }
  }

  decreaseQuantity(item: any) {
    const ind = this.commonService.selectedItems.findIndex((i: any) => i.name === item.name);
    if (ind !== -1) {
      this.commonService.selectedItems[ind].quantity--;
      this.commonService.totalPriceAmount -= item.price;
      if (this.commonService.selectedItems[ind].quantity <= 0) {
        this.commonService.selectedItems.splice(ind, 1);
      }
    }
  }

  generateOrderId(): string {
    return 'ORD-' + Math.floor(Math.random() * 10000).toString();
  }

  renderOrderTabs(): void {
    const activeOrderCount = Object.values(this.activeOrders).filter(order => order.status === 'active').length;
    const orderTabsContainer = document.querySelector('.order-tabs-container') as HTMLElement;
    const activeOrdersCountElement = document.querySelector('.active-orders-count') as HTMLElement;

    if (activeOrdersCountElement) {
      activeOrdersCountElement.textContent = `${activeOrderCount} active`;
    }

    if (orderTabsContainer) {
      orderTabsContainer.innerHTML = Object.entries(this.activeOrders)
        .filter(([_, order]) => order.status === 'active')
        .map(([orderId, order]) => `
          <button class="order-tab px-4 py-2 text-sm ${orderId === this.currentOrderId ? 'active-order-tab' : 'text-gray-600'}" 
                  data-order-id="${orderId}">
              Table ${order.table} (${order.items.reduce((sum: any, item: { quantity: any; }) => sum + item.quantity, 0)} items)
          </button>
        `).join('');

      // Add event listeners to order tabs
      orderTabsContainer.querySelectorAll('.order-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const orderId = (tab as HTMLElement).dataset['orderId']!;
          this.currentOrderId = orderId;
          this.currentTable = this.activeOrders[orderId].table;

          // Update UI
          // Update UI
          this['updateCurrentOrderDisplay']();
          this.renderOrderTabs();

          // Update table buttons
          document.querySelectorAll('.table-btn').forEach(btn => {
            btn.classList.remove('active-table');
            btn.classList.add('hover:bg-amber-600');
            if ((btn as HTMLElement).dataset['table'] === this.currentTable) {
              btn.classList.add('active-table');
              btn.classList.remove('hover:bg-amber-600');
            }
          });
        });
      });
    }
  }

  selectOrder(orderId: string): void {
    this.currentOrderId = orderId;
    this.currentTable = this.activeOrders[orderId].table;
    this.orderItems = this.activeOrders[orderId].items;
    this.orderDiscount = this.activeOrders[orderId].discount;
    this.orderNotes = this.activeOrders[orderId].notes;
    this.orderStatus = this.activeOrders[orderId].status;
    this.orderTotal = this.calculateOrderTotal();
  }

  calculateOrderTotal(): number {
    let total = 0;
    this.orderItems.forEach(item => {
      total += item.price * item.quantity;
    });
    return total - this.orderDiscount;
  }

  addItemToOrder(item: any): void {
    const existingItem = this.orderItems.find((i: any) => i.name === item.name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.orderItems.push({ ...item, quantity: 1 });
    }
    this.updateOrderTotal();
  }

  removeItemFromOrder(item: any): void {
    const existingItem = this.orderItems.find((i: any) => i.name === item.name);
    if (existingItem) {
      existingItem.quantity--;
      if (existingItem.quantity <= 0) {
        this.orderItems = this.orderItems.filter((i: any) => i.name !== item.name);
      }
    }
    this.updateOrderTotal();
  }

  updateOrderTotal(): void {
    this.orderTotal = this.calculateOrderTotal();
    this.orderFinalTotal = this.orderTotal - this.discountAmount;
  }

  applyDiscount(): void {
    this.orderDiscount = this.discountAmount;
    this.updateOrderTotal();
  }

  saveOrder(): void {
    this.activeOrders[this.currentOrderId] = {
      table: this.currentTable,
      items: this.orderItems,
      discount: this.orderDiscount,
      notes: this.orderNotes,
      status: this.orderStatus
    };
    this.renderOrderTabs();
  }

  changeOrderStatus(status: string): void {
    this.orderStatus = status;
    this.activeOrders[this.currentOrderId].status = status;
    this.renderOrderTabs();
  }

  updateCurrentOrderDisplay(): void {
    const order = this.activeOrders[this.currentOrderId];
    if (order) {
      this.orderItems = order.items;
      this.orderDiscount = order.discount;
      this.orderNotes = order.notes;
      this.orderStatus = order.status;
      this.orderTotal = this.calculateOrderTotal();
    }
  }

  addOrder(): void {
    const newOrderId = this.generateOrderId();
    this.activeOrders[newOrderId] = {
      table: this.currentTable,
      items: [],
      discount: 0,
      notes: '',
      status: 'active'
    };
    this.currentOrderId = newOrderId;
    this.renderOrderTabs();
  }

  deleteOrder(orderId: string): void {
    delete this.activeOrders[orderId];
    if (this.currentOrderId === orderId) {
      this.currentOrderId = Object.keys(this.activeOrders)[0] || '';
      this.updateCurrentOrderDisplay();
    }
    this.renderOrderTabs();
  }

  updateOrderNotes(): void {
    this.activeOrders[this.currentOrderId].notes = this.orderNotes;
    this.renderOrderTabs();
  }

  updateOrderDiscount(): void {
    this.activeOrders[this.currentOrderId].discount = this.orderDiscount;
    this.renderOrderTabs();
  }

  updateOrderStatus(): void {
    this.activeOrders[this.currentOrderId].status = this.orderStatus;
    this.renderOrderTabs();
  }

  updateOrderId(): void {
    this.activeOrders[this.currentOrderId].id = this.orderId;
    this.renderOrderTabs();
  }

  updateOrderTable(): void {
    this.activeOrders[this.currentOrderId].table = this.orderTable;
    this.renderOrderTabs();
  }

  updateOrderItems(): void {
    this.activeOrders[this.currentOrderId].items = this.orderItems;
    this.renderOrderTabs();
  }

  updateOrderDiscountAmount(): void {
    this.activeOrders[this.currentOrderId].discount = this.orderDiscountAmount;
    this.renderOrderTabs();
  }

  updateOrderNotesText(): void {
    this.activeOrders[this.currentOrderId].notes = this.orderNotesText;
    this.renderOrderTabs();
  }

  updateOrderStatusText(): void {
    this.activeOrders[this.currentOrderId].status = this.orderStatusText;
    this.renderOrderTabs();
  }

  updateOrderIdText(): void {
    this.activeOrders[this.currentOrderId].id = this.orderIdText;
    this.renderOrderTabs();
  }

  updateOrderTableText(): void {
    this.activeOrders[this.currentOrderId].table = this.orderTableText;
    this.renderOrderTabs();
  }

  updateOrderItemsText(): void {
    this.activeOrders[this.currentOrderId].items = this.orderItemsText;
    this.renderOrderTabs();
  }

  updateOrderDiscountText(): void {
    this.activeOrders[this.currentOrderId].discount = this.orderDiscountText;
    this.renderOrderTabs();
  }

  updateOrderNotesTextArea(): void {
    this.activeOrders[this.currentOrderId].notes = this.orderNotesTextArea;
    this.renderOrderTabs();
  }

  updateOrderStatusTextArea(): void {
    this.activeOrders[this.currentOrderId].status = this.orderStatusTextArea;
    this.renderOrderTabs();
  }

  updateOrderIdTextArea(): void {
    this.activeOrders[this.currentOrderId].id = this.orderIdTextArea;
    this.renderOrderTabs();
  }

  updateOrderTableTextArea(): void {
    this.activeOrders[this.currentOrderId].table = this.orderTableTextArea;
    this.renderOrderTabs();
  }

  updateOrderItemsTextArea(): void {
    this.activeOrders[this.currentOrderId].items = this.orderItemsTextArea;
    this.renderOrderTabs();
  }

  updateOrderDiscountTextArea(): void {
    this.activeOrders[this.currentOrderId].discount = this.orderDiscountTextArea;
    this.renderOrderTabs();
  }

  updateOrderNotesTextAreaText(): void {
    this.activeOrders[this.currentOrderId].notes = this.orderNotesTextAreaText;
    this.renderOrderTabs();
  }

  updateOrderStatusTextAreaText(): void {
    this.activeOrders[this.currentOrderId].status = this.orderStatusTextAreaText;
    this.renderOrderTabs();
  }

  updateOrderIdTextAreaText(): void {
    this.activeOrders[this.currentOrderId].id = this.orderIdTextAreaText;
    this.renderOrderTabs();
  }

  updateOrderTableTextAreaText(): void {
    this.activeOrders[this.currentOrderId].table = this.orderTableTextAreaText;
    this.renderOrderTabs();
  }

  updateOrderItemsTextAreaText(): void {
    this.activeOrders[this.currentOrderId].items = this.orderItemsTextAreaText;
    this.renderOrderTabs();
  }

  updateOrderDiscountTextAreaText(): void {
    this.activeOrders[this.currentOrderId].discount = this.orderDiscountTextAreaText;
    this.renderOrderTabs();
  }

  updateOrderNotesTextAreaTextArea(): void {
    this.activeOrders[this.currentOrderId].notes = this.orderNotesTextAreaTextArea;
    this.renderOrderTabs();
  }

  updateOrderStatusTextAreaTextArea(): void {
    this.activeOrders[this.currentOrderId].status = this.orderStatusTextAreaTextArea;
    this.renderOrderTabs();
  }

  updateOrderIdTextAreaTextArea(): void {
    this.activeOrders[this.currentOrderId].id = this.orderIdTextAreaTextArea;
    this.renderOrderTabs();
  }

  updateOrderTableTextAreaTextArea(): void {
    this.activeOrders[this.currentOrderId].table = this.orderTableTextAreaTextArea;
    this.renderOrderTabs();
  }

  updateOrderItemsTextAreaTextArea(): void {
    this.activeOrders[this.currentOrderId].items = this.orderItemsTextAreaTextArea;
    this.renderOrderTabs();
  }

  updateOrderDiscountTextAreaTextArea(): void {
    this.activeOrders[this.currentOrderId].discount = this.orderDiscountTextAreaTextArea;
    this.renderOrderTabs();
  }
}
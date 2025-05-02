import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminPageComponent {
  currentTab: 'items' | 'cashiers' = 'items';

  // Sample data for items and cashiers
  items = [
    { id: 1, name: 'Masala Chai', price: 40, category: 'Tea & Coffee' },
    { id: 2, name: 'Cappuccino', price: 80, category: 'Tea & Coffee' },
    { id: 3, name: 'Sandwich', price: 120, category: 'Food' }
  ];

  cashiers = [
    { id: 1, name: 'Cashier 1' },
    { id: 2, name: 'Cashier 2' }
  ];

  // For add/edit forms
  newItem = { id: 0, name: '', price: 0, category: '' };
  newCashier = { id: 0, name: '' };
  editingItemId: number | null = null;
  editingCashierId: number | null = null;

  // Switch tabs
  switchTab(tab: 'items' | 'cashiers') {
    this.currentTab = tab;
    this.cancelEdit();
  }

  // Item methods
  addItem() {
    if (this.newItem.name && this.newItem.price > 0 && this.newItem.category) {
      if (this.editingItemId === null) {
        // Add new item
        const newId = this.items.length ? Math.max(...this.items.map(i => i.id)) + 1 : 1;
        this.items.push({ ...this.newItem, id: newId });
      } else {
        // Update existing item
        const index = this.items.findIndex(i => i.id === this.editingItemId);
        if (index !== -1) {
          this.items[index] = { ...this.newItem, id: this.editingItemId };
        }
      }
      this.cancelEdit();
    }
  }

  editItem(item: any) {
    this.editingItemId = item.id;
    this.newItem = { ...item };
  }

  deleteItem(id: number) {
    this.items = this.items.filter(i => i.id !== id);
    if (this.editingItemId === id) {
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editingItemId = null;
    this.newItem = { id: 0, name: '', price: 0, category: '' };
    this.editingCashierId = null;
    this.newCashier = { id: 0, name: '' };
  }

  // Cashier methods
  addCashier() {
    if (this.newCashier.name) {
      if (this.editingCashierId === null) {
        const newId = this.cashiers.length ? Math.max(...this.cashiers.map(c => c.id)) + 1 : 1;
        this.cashiers.push({ ...this.newCashier, id: newId });
      } else {
        const index = this.cashiers.findIndex(c => c.id === this.editingCashierId);
        if (index !== -1) {
          this.cashiers[index] = { ...this.newCashier, id: this.editingCashierId };
        }
      }
      this.cancelEdit();
    }
  }

  editCashier(cashier: any) {
    this.editingCashierId = cashier.id;
    this.newCashier = { ...cashier };
  }

  deleteCashier(id: number) {
    this.cashiers = this.cashiers.filter(c => c.id !== id);
    if (this.editingCashierId === id) {
      this.cancelEdit();
    }
  }
}

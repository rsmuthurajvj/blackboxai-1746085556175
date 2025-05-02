import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { footCategories, IFootCategories, IQuickActions, ITableProperties, quickActions, tableProperties } from '../../models/common.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule]
})

export class SidebarComponent {
  isCollapsed: boolean = false;

  constructor(public commonService: CommonService) {
    this.commonService.sidebarCollapsed$.subscribe(collapsed => {
      this.isCollapsed = collapsed;
    });
  }
  tableProperties = tableProperties;
  footCategories = footCategories;
  quickActions = quickActions;

  changeTable(table: ITableProperties) {
    this.commonService.selectedTable = table;
  }
  
  changeCategory(category: IFootCategories) {
    this.commonService.selectedCategory = category;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.commonService.setSidebarCollapsed(this.isCollapsed);
  }
}
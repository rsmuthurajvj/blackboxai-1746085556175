import { Injectable } from '@angular/core';
import { footCategories, IFootCategories, ITableProperties, tableProperties } from '../models/common.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    currentOrderNumber: number = 1;
    public selectedTable: ITableProperties = tableProperties[0];
    public selectedCategory: IFootCategories = footCategories[0];
    public selectedCasier: any = {
        name: 'Casier 1'
    };
    public selectedItems: any[] = [];
    public totalPriceAmount: number = 0;

    private sidebarCollapsedSubject = new BehaviorSubject<boolean>(false);
    sidebarCollapsed$ = this.sidebarCollapsedSubject.asObservable();

    setSidebarCollapsed(collapsed: boolean) {
        this.sidebarCollapsedSubject.next(collapsed);
    }
}
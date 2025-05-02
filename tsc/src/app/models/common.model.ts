export interface ITableProperties {
    tableId?: number,
    name?: string
  }
  
  export interface IFootCategories {
    id?: number,
    displayName?: string,
    category?: "Drink" | "Starter" | "Snacks" | "Sweets" | "Food",
    icon?: string;
    menuItems?: IMenu[];
  }
  
  export interface IMenu {
    name?: string;
    price?: number;
    icon?: string;
    description?: string;
  }
  
  export interface IQuickActions {
    id?: number,
    action?: string,
    icon?: string
  }
  
  export const tableProperties: ITableProperties[] = [
    { tableId: 1, name: "Table 1" },
    { tableId: 2, name: "Table 2" },
    { tableId: 3, name: "Table 3" },
    { tableId: 4, name: "Table 4" },
    { tableId: 5, name: "Table 5" },
    { tableId: 6, name: "Table 6" },
    { tableId: 7, name: "Table 7" },
    { tableId: 8, name: "Table 8" },
    { tableId: 9, name: "Table 9" }
  ];
  
  export const footCategories: IFootCategories[] = [
    {
      id: 1, displayName: "Tea & Coffee", category: "Drink", icon: "fa-mug-hot",
      menuItems: [
        { name: 'Masala Chai', price: 40, icon: 'fa-mug-hot', description: 'Spiced Indian tea' },
        { name: 'Green Tea', price: 50, icon: 'fa-mug-hot', description: 'Refreshing herbal tea' },
        { name: 'Cappuccino', price: 80, icon: 'fa-coffee', description: 'Espresso with steamed milk' },
        { name: 'Kashmiri Kahwa', price: 70, icon: 'fa-mug-hot', description: 'Traditional saffron tea' },
        { name: 'Americano', price: 60, icon: 'fa-coffee', description: 'Black coffee' },
        { name: 'Ginger Tea', price: 45, icon: 'fa-mug-hot', description: 'Spicy ginger infusion' }
      ]
    },
    {
      id: 2, displayName: "Food", category: "Food", icon: "fa-utensils",
      menuItems: [
        { name: 'Sandwich', price: 120, icon: 'fa-bread-slice', description: 'Veg/Chicken options' },
        { name: 'Cookies', price: 60, icon: 'fa-cookie', description: 'Assorted flavors' },
        { name: 'Pizza Slice', price: 90, icon: 'fa-pizza-slice', description: 'Margherita/Pepperoni' },
        { name: 'Burger', price: 110, icon: 'fa-hamburger', description: 'Veg/Chicken options' },
        { name: 'Chicken Wings', price: 150, icon: 'fa-drumstick-bite', description: 'Spicy/Tangy options' },
        { name: 'Pasta', price: 130, icon: 'fa-bowl-food', description: 'White/Red sauce' }
      ]
    },
    {
      id: 3, displayName: "Beverages", category: "Drink", icon: "fa-glass-whiskey",
      menuItems:[
        { name: 'Fresh Lime', price: 50, icon: 'fa-glass-whiskey', description: 'Sweet/Salty options' },
        { name: 'Mojito', price: 70, icon: 'fa-glass-whiskey', description: 'Mint flavored' },
        { name: 'Iced Tea', price: 60, icon: 'fa-glass-whiskey', description: 'Lemon/Peach' },
        { name: 'Cold Coffee', price: 90, icon: 'fa-glass-whiskey', description: 'With ice cream' },
        { name: 'Milkshake', price: 80, icon: 'fa-glass-whiskey', description: 'Chocolate/Strawberry' },
        { name: 'Soda', price: 40, icon: 'fa-glass-whiskey', description: 'Various flavors' }
      ]
    },
    {
      id: 4, displayName: "Desserts", category: "Sweets", icon: "fa-ice-cream",
      menuItems: [
        { name: 'Ice Cream', price: 60, icon: 'fa-ice-cream', description: 'Various flavors' },
        { name: 'Brownie', price: 90, icon: 'fa-cookie', description: 'With ice cream' },
        { name: 'Cheesecake', price: 120, icon: 'fa-pie', description: 'Blueberry/Strawberry' },
        { name: 'Chocolate Mousse', price: 80, icon: 'fa-cookie', description: 'Rich chocolate flavor' },
        { name: 'Gulab Jamun', price: 60, icon: 'fa-cookie', description: '2 pieces' },
        { name: 'Tiramisu', price: 110, icon: 'fa-cookie', description: 'Coffee flavored' }
      ]
    }
  ];
  
  export const quickActions: IQuickActions[] = [
    { id: 1, action: "New Order", icon: "fa-plus-circle" },
    { id: 2, action: "Order History", icon: "fa-history" },
    { id: 3, action: "Reports", icon: "fa-chart-bar" },
    { id: 4, action: "Inventory", icon: "fa-boxes" }
  ];
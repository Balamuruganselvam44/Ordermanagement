# Restaurant Owner Dashboard

A comprehensive React-based dashboard for restaurant owners to monitor and analyze their business operations, order management, and delivery performance.

## 🚀 Features

### 📊 **Performance Metrics**
- **Order Statistics**: Total orders, delivered, pending, and in-transit orders
- **Revenue Analytics**: Total revenue, average order value, and order type breakdown
- **Operational Efficiency**: Success rates, customer satisfaction, and top performers
- **Time Analytics**: Peak hour orders, weekend performance, and time-based insights

### 📅 **Smart Date Filtering**
- **Compact Popup Design**: Space-efficient date filter with popup interface
- **Default Filter**: Automatically shows last 30 days of data
- **Quick Filters**: Today, Last 7 Days, Last 30 Days, All Time options
- **Real-time Updates**: Instant filtering of all dashboard metrics

### 🚚 **Delivery Performance**
- **Driver Analytics**: Individual driver performance tracking
- **Success Rates**: Color-coded performance indicators
- **Time-based Insights**: Peak hour and weekend delivery analysis
- **Order Assignment**: Clear distinction between assigned and unassigned orders

### 📈 **Data Visualization**
- **Top Items Chart**: Most popular menu items
- **Order Type Chart**: Online vs Dine-in order distribution
- **Detailed Analytics**: Comprehensive business insights
- **Orders Table**: Complete order listing with filtering

## 🛠️ Technology Stack

- **Frontend**: React 18
- **Styling**: CSS3 with modern design patterns
- **Data**: JSON-based order data
- **Build Tool**: Create React App
- **Responsive Design**: Mobile-first approach

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── DateFilter.jsx   # Date filtering component
│   ├── DateFilter.css   # Date filter styles
│   ├── DeliveryPerformance.jsx
│   ├── DeliveryPerformance.css
│   ├── DetailedAnalytics.jsx
│   ├── DetailedAnalytics.css
│   ├── OrdersTable.jsx
│   ├── OrdersTable.css
│   ├── OrderTypeChart.jsx
│   ├── OrderTypeChart.css
│   ├── PerformanceMetrics.jsx
│   ├── PerformanceMetrics.css
│   ├── StatusSummary.jsx
│   ├── StatusSummary.css
│   ├── TopItemsChart.jsx
│   └── TopItemsChart.css
├── data/
│   └── orders.json      # Sample order data
├── App.js              # Main application component
├── App.css             # Global styles
└── index.js            # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restaurant-owner-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Data Structure

### Order Data Format
```json
{
  "Order_ID": 1001,
  "Customer_Name": "John Smith",
  "Customer_Phone": "555-1234",
  "Customer_Address": "123 Main St",
  "Order_Date": "2025-09-15T18:30:00Z",
  "Items": [
    {
      "Item_Name": "Pepperoni Pizza",
      "Item_Price": 10.99,
      "Item_Type": "Food",
      "Quantity": 1,
      "Rating": "4",
      "Total_Price": 10.99
    }
  ],
  "Order_Type": "Online",
  "Order_Status": "Delivered",
  "Delivery_Person": "Sarah Johnson",
  "Delivery_Status": "Delivered"
}
```

## 🎨 Design Features

### **Modern UI/UX**
- Clean, professional design
- Purple gradient header
- Card-based layout
- Responsive design for all devices
- Smooth animations and transitions

### **Color Scheme**
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Success**: Green (#4CAF50)
- **Warning**: Orange (#FF9800)
- **Danger**: Red (#F44336)
- **Background**: Light gray (#f5f7fa)

## 📱 Responsive Design

- **Desktop**: Full grid layout with side-by-side cards
- **Tablet**: Stacked layout with optimized spacing
- **Mobile**: Single column layout with touch-friendly controls

## 🔧 Available Scripts

### Development
```bash
npm start          # Start development server
npm test           # Run test suite
npm run build      # Build for production
```

### Production
```bash
npm run build      # Create optimized build
npm install -g serve
serve -s build     # Serve production build locally
```

## 📈 Key Metrics Tracked

### **Order Management**
- Total orders count
- Order status distribution
- Order type analysis (Online vs Dine-in)
- Revenue tracking

### **Delivery Performance**
- Driver success rates
- Delivery time analysis
- Peak hour performance
- Weekend delivery metrics

### **Business Intelligence**
- Customer satisfaction scores
- Popular menu items
- Revenue trends
- Operational efficiency

## 🎯 Features Overview

### **Dashboard Components**

1. **Date Filter**
   - Compact popup design
   - Default 30-day filter
   - Quick filter options
   - Real-time data updates

2. **Performance Metrics**
   - Order statistics
   - Revenue analytics
   - Operational efficiency
   - Time-based insights

3. **Delivery Performance**
   - Individual driver stats
   - Success rate tracking
   - Peak hour analysis
   - Weekend performance

4. **Data Visualization**
   - Interactive charts
   - Order type distribution
   - Top items analysis
   - Detailed order table

## 🔄 Data Flow

1. **Data Loading**: Orders loaded from JSON file
2. **Date Filtering**: Real-time filtering based on selected date range
3. **Metric Calculation**: Automatic calculation of all performance metrics
4. **Component Updates**: All components update simultaneously with filter changes

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
```

### **Deploy to Netlify**

#### **Method 1: Netlify CLI (Recommended)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=build
```

#### **Method 2: Drag & Drop**
1. Run `npm run build` to create the production build
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `build` folder to the deploy area

#### **Method 3: Git Integration (Recommended for Continuous Deployment)**
1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit: Restaurant Dashboard"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose "GitHub" and select your repository
   - Netlify will auto-detect React settings

3. **Build Settings (Auto-detected)**
   - Build command: `npm run build`
   - Publish directory: `build`
   - Node version: `18` (specified in netlify.toml)

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy automatically
   - Future pushes will trigger automatic deployments

#### **Netlify Configuration**
The project includes a `netlify.toml` file with optimized settings for React deployment.

#### **Quick Deployment Checklist**
1. ✅ Ensure `npm run build` works locally
2. ✅ Test the build folder in browser
3. ✅ Verify all components load correctly
4. ✅ Check responsive design on different screen sizes
5. ✅ Confirm date filter functionality works
6. ✅ Test all dashboard metrics display properly

#### **Post-Deployment**
- Your dashboard will be available at `https://your-site-name.netlify.app`
- All features will work exactly as in development
- Automatic HTTPS and CDN optimization included

#### **Continuous Deployment Benefits**
- ✅ **Auto-deploy**: Every `git push` triggers a new deployment
- ✅ **Build logs**: See build progress and any errors
- ✅ **Preview deployments**: Test changes before going live
- ✅ **Rollback**: Easy rollback to previous versions
- ✅ **Custom domain**: Add your own domain name
- ✅ **Environment variables**: Secure configuration management

### **Other Deployment Options**
- Vercel
- GitHub Pages
- AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---
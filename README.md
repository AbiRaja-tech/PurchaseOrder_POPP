# Purchase Order Management System (PO-POPP)

A modern, comprehensive Purchase Order generation and management system built with React, TypeScript, and Material-UI, designed to be hosted on Google Cloud Platform with AI-powered analytics and assistance.

## 🚀 Features

### Core Functionality
- **Purchase Order Management**: Create, edit, approve, and track purchase orders
- **Vendor Management**: Comprehensive vendor catalog with performance tracking
- **Product Catalog**: Manage product listings, pricing, and inventory
- **Invoice Tracking**: Track invoices with approval workflows and payment status
- **Approval Workflows**: Multi-level approval system for purchase orders
- **User Management**: Role-based access control (Admin, Approver)

### Advanced Features
- **AI Assistant**: Powered by Google Vertex AI for intelligent analysis and recommendations
- **Data Analytics**: Comprehensive spending analysis and visualizations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Notifications**: Stay updated with PO status changes and approvals

### Technical Stack
- **Frontend**: React 18, TypeScript, Material-UI v5
- **State Management**: Redux Toolkit with RTK Query
- **Charts**: Recharts for data visualization
- **Forms**: Formik with Yup validation
- **Cloud Platform**: Google Cloud Platform
- **Database**: Cloud SQL (PostgreSQL)
- **Authentication**: Google Identity Platform
- **AI/ML**: Vertex AI for analytics and assistance

## 🏗️ Architecture

```
PurchaseOrder_POPP/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── Layout/         # Layout components (Sidebar, Header)
│   ├── pages/              # Page components
│   │   ├── Dashboard/      # Main dashboard with analytics
│   │   ├── PurchaseOrders/ # PO management
│   │   ├── Vendors/        # Vendor management
│   │   ├── Products/       # Product catalog
│   │   ├── Invoices/       # Invoice tracking
│   │   ├── Analytics/      # Data analytics
│   │   ├── AIAssistant/    # AI chat interface
│   │   └── Auth/           # Authentication pages
│   ├── store/              # Redux store and slices
│   │   └── slices/         # Redux slices for state management
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Google Cloud Platform account
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PurchaseOrder_POPP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Google Cloud Setup

1. **Enable required APIs**
   - Cloud SQL Admin API
   - Identity Platform API
   - Vertex AI API
   - Cloud Run API

2. **Create Cloud SQL instance**
   ```bash
   gcloud sql instances create po-database \
     --database-version=POSTGRES_14 \
     --tier=db-f1-micro \
     --region=us-central1
   ```

3. **Set up Identity Platform**
   - Configure authentication providers
   - Set up user management

4. **Deploy to Cloud Run**
   ```bash
   npm run build
   gcloud run deploy po-management \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

## 📱 Usage

### Authentication
- Login with your Google account or email/password
- Demo credentials: `admin@example.com` / `password123`

### Dashboard
- View key metrics and recent activity
- Access quick actions for common tasks
- Monitor spending trends and PO status

### Purchase Orders
- Create new purchase orders with multiple items
- Set priorities and expected delivery dates
- Track approval status and workflow progress

### Vendors
- Manage vendor information and contact details
- Track vendor performance and ratings
- View vendor-specific purchase history

### Analytics
- Analyze spending patterns by vendor, category, and time
- View interactive charts and reports
- Export data for external analysis

### AI Assistant
- Ask questions about purchase orders and spending
- Get intelligent recommendations
- Analyze patterns and trends

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_GOOGLE_CLOUD_PROJECT=your-project-id
REACT_APP_VERTEX_AI_ENDPOINT=your-vertex-ai-endpoint
```

### Google Cloud Configuration
- Set up service accounts with appropriate permissions
- Configure CORS for API endpoints
- Set up monitoring and logging

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Cloud Run Deployment
```bash
gcloud run deploy po-management \
  --source . \
  --platform managed \
  --region us-central1 \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10
```

### Custom Domain Setup
```bash
gcloud run domain-mappings create \
  --service po-management \
  --domain your-domain.com \
  --region us-central1
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Purchase Orders
- `GET /api/purchase-orders` - List purchase orders
- `POST /api/purchase-orders` - Create purchase order
- `PUT /api/purchase-orders/:id` - Update purchase order
- `POST /api/purchase-orders/:id/approve` - Approve purchase order

### Vendors
- `GET /api/vendors` - List vendors
- `POST /api/vendors` - Create vendor
- `PUT /api/vendors/:id` - Update vendor

### Analytics
- `GET /api/analytics/spending` - Get spending analytics
- `GET /api/analytics/vendors` - Get vendor analytics

### AI Assistant
- `POST /api/ai/chat` - Send message to AI assistant
- `GET /api/ai/conversations` - Get conversation history

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- HTTPS enforcement in production
- Regular security updates

## 📈 Performance

- Lazy loading for components
- Optimized bundle size
- Caching strategies
- CDN integration for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

### Phase 2 Features
- [ ] Advanced reporting and exports
- [ ] Mobile app development
- [ ] Integration with ERP systems
- [ ] Advanced AI features
- [ ] Multi-tenant support
- [ ] Advanced workflow automation

### Phase 3 Features
- [ ] Blockchain integration for transparency
- [ ] Advanced predictive analytics
- [ ] Voice-enabled AI assistant
- [ ] Real-time collaboration features
- [ ] Advanced compliance tracking

---

**Built with ❤️ using modern web technologies and Google Cloud Platform** 
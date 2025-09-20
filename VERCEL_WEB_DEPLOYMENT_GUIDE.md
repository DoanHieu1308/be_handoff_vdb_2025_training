# 🌐 HƯỚNG DẪN DEPLOY NESTJS LÊN VERCEL WEB DASHBOARD

## 📋 CÁC BƯỚC DEPLOY TRÊN WEB VERCEL

### 1. CHUẨN BỊ PROJECT

#### 1.1 Đảm bảo có các file cần thiết:
- ✅ `vercel.json`
- ✅ `main.ts` (đã cập nhật)
- ✅ `package.json`
- ✅ `.vercelignore`
- ✅ `env.example`

#### 1.2 Push code lên GitHub/GitLab/Bitbucket
```bash
# Khởi tạo git nếu chưa có
git init

# Add tất cả files
git add .

# Commit
git commit -m "Setup for Vercel deployment"

# Add remote repository
git remote add origin https://github.com/yourusername/your-repo.git

# Push lên repository
git push -u origin main
```

---

## 2. DEPLOY TRÊN VERCEL WEB DASHBOARD

### 2.1 Truy cập Vercel Dashboard
1. Vào [vercel.com](https://vercel.com)
2. Click **"Sign Up"** hoặc **"Login"**
3. Chọn **"Continue with GitHub"** (hoặc GitLab/Bitbucket)

### 2.2 Import Project
1. Click **"New Project"**
2. Chọn repository của bạn
3. Click **"Import"**

---

## 3. CẤU HÌNH PROJECT SETTINGS

### 3.1 Framework Preset
```
Framework Preset: Other
```
*Vercel sẽ tự động detect NestJS, nhưng nếu không có thì chọn "Other"*

### 3.2 Root Directory
```
Root Directory: ./
```
*Để trống hoặc điền `./` vì code ở root directory*

### 3.3 Build and Output Settings

#### Build Command:
```
vercel-build
```
*Hoặc:*
```
npm run build
```

#### Output Directory:
```
dist
```
*Thư mục chứa file build sau khi compile*

#### Install Command:
```
npm install
```
*Hoặc để trống để Vercel tự động detect*

### 3.4 Development Command (Optional)
```
vercel-dev
```
*Hoặc:*
```
npm run start:dev
```

---

## 4. CẤU HÌNH ENVIRONMENT VARIABLES

### 4.1 Vào Environment Variables
1. Trong project dashboard, click **"Settings"**
2. Click **"Environment Variables"**
3. Thêm từng biến một:

### 4.2 Danh sách Environment Variables cần thêm:

#### **Database Configuration:**
```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME = social_app
```

#### **JWT Configuration:**
```
JWT_SECRET = your_super_secret_jwt_key_here_min_32_chars
JWT_REFRESH_SECRET = your_super_secret_refresh_key_here_min_32_chars
JWT_EXPIRES_IN = 7d
JWT_REFRESH_EXPIRES_IN = 30d
```

#### **Server Configuration:**
```
NODE_ENV = production
PORT = 5000
```

#### **CORS Configuration:**
```
FRONTEND_URL = https://your-frontend-domain.vercel.app
```

#### **AWS S3 Configuration (nếu dùng file upload):**
```
AWS_ACCESS_KEY_ID = your_aws_access_key
AWS_SECRET_ACCESS_KEY = your_aws_secret_key
AWS_REGION = us-east-1
AWS_S3_BUCKET_NAME = your_s3_bucket_name
```

#### **Firebase Configuration (nếu dùng FCM):**
```
FIREBASE_PROJECT_ID = your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID = your_firebase_private_key_id
FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL = your_firebase_client_email
FIREBASE_CLIENT_ID = your_firebase_client_id
FIREBASE_AUTH_URI = https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI = https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL = https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL = https://www.googleapis.com/robot/v1/metadata/x509/your_firebase_client_email
```

#### **Rate Limiting:**
```
RATE_LIMIT_WINDOW_MS = 900000
RATE_LIMIT_MAX_REQUESTS = 100
```

#### **Upload Configuration:**
```
UPLOAD_MAX_SIZE = 10485760
UPLOAD_ALLOWED_TYPES = image/jpeg,image/png,image/gif,image/webp
```

### 4.3 Cấu hình Environment cho từng môi trường:
- **Production**: Tất cả biến
- **Preview**: Có thể dùng biến production hoặc tạo riêng
- **Development**: Có thể dùng biến production hoặc tạo riêng

---

## 5. CẤU HÌNH VERCEL.JSON (QUAN TRỌNG)

### 5.1 Kiểm tra file vercel.json hiện tại:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "main.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "main.ts": {
      "maxDuration": 30
    }
  }
}
```

### 5.2 Cấu hình bổ sung (nếu cần):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "main.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "main.ts": {
      "maxDuration": 30
    }
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  }
}
```

---

## 6. DEPLOY VÀ KIỂM TRA

### 6.1 Deploy
1. Sau khi cấu hình xong, click **"Deploy"**
2. Vercel sẽ tự động build và deploy
3. Chờ quá trình build hoàn tất (thường 2-5 phút)

### 6.2 Kiểm tra Deployment
1. Vào tab **"Deployments"** để xem tiến trình
2. Click vào deployment để xem logs
3. Nếu có lỗi, xem **"Function Logs"**

### 6.3 Test API
1. Copy URL deployment (dạng: `https://your-project.vercel.app`)
2. Test health check: `https://your-project.vercel.app/`
3. Test API docs: `https://your-project.vercel.app/api-docs`
4. Test API endpoints: `https://your-project.vercel.app/v1/api/...`

---

## 7. CẤU HÌNH DOMAIN (OPTIONAL)

### 7.1 Custom Domain
1. Vào **"Settings"** → **"Domains"**
2. Thêm domain của bạn
3. Cấu hình DNS records theo hướng dẫn

### 7.2 Subdomain
- Vercel tự động tạo subdomain: `your-project.vercel.app`
- Có thể đổi tên trong **"Settings"** → **"General"**

---

## 8. MONITORING VÀ MAINTENANCE

### 8.1 Analytics
1. Vào tab **"Analytics"**
2. Xem performance metrics
3. Monitor function execution times

### 8.2 Function Logs
1. Vào tab **"Functions"**
2. Xem real-time logs
3. Debug errors nếu có

### 8.3 Environment Variables
1. Vào **"Settings"** → **"Environment Variables"**
2. Có thể edit/delete/add biến mới
3. Click **"Redeploy"** sau khi thay đổi

---

## 9. TROUBLESHOOTING

### 9.1 Lỗi Build
**Triệu chứng:** Build failed, TypeScript errors
**Giải pháp:**
1. Kiểm tra logs trong **"Function Logs"**
2. Test build local: `npm run build`
3. Fix lỗi TypeScript
4. Push code mới và redeploy

### 9.2 Lỗi Runtime
**Triệu chứng:** Function execution failed
**Giải pháp:**
1. Kiểm tra Environment Variables
2. Kiểm tra MongoDB connection
3. Xem logs chi tiết

### 9.3 Lỗi CORS
**Triệu chứng:** CORS policy error
**Giải pháp:**
1. Cập nhật `FRONTEND_URL` trong Environment Variables
2. Kiểm tra CORS config trong `main.ts`

---

## 10. COMMANDS HỮU ÍCH

### 10.1 Vercel CLI (nếu cần)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy từ local
vercel

# Deploy production
vercel --prod

# Xem logs
vercel logs [deployment-url]
```

### 10.2 Git Commands
```bash
# Push code mới
git add .
git commit -m "Update for deployment"
git push origin main

# Vercel sẽ tự động redeploy
```

---

## 11. CHECKLIST DEPLOYMENT

### ✅ Trước khi deploy:
- [ ] Code đã push lên GitHub/GitLab/Bitbucket
- [ ] File `vercel.json` đã cấu hình đúng
- [ ] File `main.ts` có export default function
- [ ] Environment variables đã chuẩn bị

### ✅ Sau khi deploy:
- [ ] Health check endpoint hoạt động
- [ ] API docs accessible
- [ ] Database connection thành công
- [ ] CORS configuration đúng
- [ ] All API endpoints hoạt động

---

## 12. KẾT QUẢ MONG ĐỢI

Sau khi deploy thành công, bạn sẽ có:

### 🌐 **URLs:**
- **API Base URL:** `https://your-project.vercel.app`
- **Health Check:** `https://your-project.vercel.app/`
- **API Docs:** `https://your-project.vercel.app/api-docs`
- **API Endpoints:** `https://your-project.vercel.app/v1/api/...`

### 📊 **Features:**
- ✅ Serverless functions
- ✅ Auto-scaling
- ✅ Global CDN
- ✅ HTTPS enabled
- ✅ Environment variables secure
- ✅ Real-time monitoring

**Chúc bạn deploy thành công! 🎉**

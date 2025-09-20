# ⚡ CẤU HÌNH NHANH VERCEL WEB DASHBOARD

## 🎯 CÁC CẤU HÌNH CHÍNH XÁC CHO VERCEL WEB

### 1. FRAMEWORK PRESET
```
Framework Preset: Other
```
*Hoặc để Vercel tự động detect*

### 2. ROOT DIRECTORY
```
Root Directory: ./
```
*Để trống hoặc điền `./`*

### 3. BUILD AND OUTPUT SETTINGS

#### Build Command:
```
npm run build
```

#### Output Directory:
```
dist
```

#### Install Command:
```
npm install
```

#### Development Command (Optional):
```
npm run start:dev
```

---

## 🔧 ENVIRONMENT VARIABLES CẦN THÊM

### Database:
```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME = social_app
```

### JWT:
```
JWT_SECRET = your_super_secret_jwt_key_here_min_32_chars
JWT_REFRESH_SECRET = your_super_secret_refresh_key_here_min_32_chars
JWT_EXPIRES_IN = 7d
JWT_REFRESH_EXPIRES_IN = 30d
```

### Server:
```
NODE_ENV = production
PORT = 5000
```

### CORS:
```
FRONTEND_URL = https://your-frontend-domain.vercel.app
```

### AWS S3 (nếu dùng file upload):
```
AWS_ACCESS_KEY_ID = your_aws_access_key
AWS_SECRET_ACCESS_KEY = your_aws_secret_key
AWS_REGION = us-east-1
AWS_S3_BUCKET_NAME = your_s3_bucket_name
```

### Firebase (nếu dùng FCM):
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

---

## 📋 CHECKLIST DEPLOYMENT

### ✅ Trước khi deploy:
- [ ] Code đã push lên GitHub/GitLab/Bitbucket
- [ ] File `vercel.json` đã cấu hình đúng
- [ ] File `main.ts` có export default function
- [ ] Environment variables đã chuẩn bị

### ✅ Cấu hình trên Vercel Dashboard:
- [ ] Framework Preset: Other
- [ ] Root Directory: ./
- [ ] Build Command: npm run build
- [ ] Output Directory: dist
- [ ] Install Command: npm install
- [ ] Environment Variables đã thêm đầy đủ

### ✅ Sau khi deploy:
- [ ] Health check: `https://your-project.vercel.app/`
- [ ] API docs: `https://your-project.vercel.app/api-docs`
- [ ] API endpoints: `https://your-project.vercel.app/v1/api/...`

---

## 🚀 CÁC BƯỚC DEPLOY

1. **Vào [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import repository từ GitHub/GitLab/Bitbucket**
4. **Cấu hình theo settings ở trên**
5. **Thêm Environment Variables**
6. **Click "Deploy"**
7. **Chờ build hoàn tất**
8. **Test API endpoints**

---

## 🔍 TESTING

### Health Check:
```bash
curl https://your-project.vercel.app/
```

### API Documentation:
```
https://your-project.vercel.app/api-docs
```

### API Endpoints:
```
https://your-project.vercel.app/v1/api/auth/login
https://your-project.vercel.app/v1/api/posts
https://your-project.vercel.app/v1/api/users
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **MongoDB Atlas**: Whitelist IP `0.0.0.0/0`
2. **Environment Variables**: Phải thêm trên Vercel Dashboard
3. **File Upload**: Dùng AWS S3 vì Vercel có giới hạn
4. **WebSocket**: Vercel không hỗ trợ, cần external service
5. **Cold Start**: Lần đầu request có thể chậm

---

## 🎉 KẾT QUẢ

Sau khi deploy thành công, bạn sẽ có:
- ✅ API NestJS chạy trên Vercel
- ✅ URL: `https://your-project.vercel.app`
- ✅ Swagger docs: `https://your-project.vercel.app/api-docs`
- ✅ Environment variables được bảo mật
- ✅ Auto-scaling và global CDN

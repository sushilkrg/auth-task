## Task  — Authentication + JWT Refresh Token Flow

###
setup guide
```
git clone https://github.com/sushilkrg/auth-task.git

cd auth-task

npm install
```

then add .env file in root folder and teh below code with your secrets

### .env 

```
MONGODB_URI=mongodb://localhost:27017/auth-task?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false
JWT_REFRESH_SECRET=
JWT_ACCESS_SECRET=
PORT=8000

```

Then, run code by 

```
npm run dev

```

Thank you
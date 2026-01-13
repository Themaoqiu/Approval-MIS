# Approval MIS

## Getting Started

### Install PostgreSQL 16
1. Check the link: [PostgreSQL 安装教程](https://zhuanlan.zhihu.com/p/1908417758892369241)
2. Verify Installation: Open cmd and run 
```bash
psql --version
```
3. Create a database: Open cmd and run
```bash
# Create a new database user 'app_user' with the password '12345'
psql -d postgres -c "CREATE USER app_user WITH PASSWORD '12345';"

# Transfer ownership of the 'approval_mis' database to 'app_user' so this user has full control
psql -d postgres -c "ALTER DATABASE approval_mis OWNER TO app_user;"
```

### Install Bun
1. Check the link: [Bun 安装](https://www.bunjs.cn/docs/installation)
2. Verify Installation: Open cmd and run 
```bash
bun --version
```

### Create .env file
```bash
DATABASE_URL="postgresql://app_user:12345@localhost:5432/approval_mis"
BETTER_AUTH_SECRET="your_secret_key"
BETTER_AUTH_URL="http://localhost:3000"
```

### Install and run:

1. Initialize the database (one command):
```bash
# Install dependencies
bun install

# Apply migrations and seed database automatically
bunx prisma migrate dev --name init
```

2. Start development server:
```bash
bun dev
```

3. (Optional) View the database in Prisma Studio:
```bash
bunx prisma studio
```

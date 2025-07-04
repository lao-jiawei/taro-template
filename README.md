# taro-scaffold-template

Taro项目脚手架，用于快速初始化基于React和TypeScript的Taro应用。

## 安装

```bash
npm install -g taro-scaffold-template
# 或使用npx直接运行
npx taro-scaffold-template <project-name>
```

## 使用方法

### 创建新项目

```bash
create-taro-app my-taro-project
# 或使用npx
npx taro-scaffold-template my-taro-project
```

### 选项

- `-t, --typescript`: 使用TypeScript模板（默认启用）
- `-p, --page <name>`: 设置初始页面名称（默认：`index`）

### 示例

```bash
# 创建TypeScript项目并指定页面名称为home
create-taro-app my-app --typescript --page home

# 进入项目目录
cd my-app

# 安装依赖
npm install

# 启动微信小程序开发服务器
npm run dev:weapp
```

## 项目结构

生成的项目结构基于Taro 3.x，包含以下核心目录：

- `src/pages`: 页面组件目录
- `src/stores`: 状态管理目录
- `config`: 项目配置目录

## 可用脚本

在项目目录中运行：

- `npm run dev:<platform>`: 启动对应平台的开发服务器（weapp, h5, alipay等）
- `npm run build:<platform>`: 构建对应平台的生产版本
- `npm test`: 运行测试

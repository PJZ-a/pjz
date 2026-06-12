# 潘建泽 · 个人主页

简单的单页个人简介，包含：关于、教育、技能、项目与联系方式（含二维码）。

## 在线访问

🔗 **主页地址：[https://PJZ-a.github.io/pjz/](https://PJZ-a.github.io/pjz/)**

## 本地预览

1) 使用 Python 简易服务器：

```powershell
cd "c:\Users\86199\Desktop\个人主页"
py -3 -m http.server 8080
```

在浏览器打开： http://localhost:8080

2) 直接在浏览器打开 `index.html` 文件。

3) 在 VS Code 中使用 Live Server 扩展。

## 部署

本项目通过 GitHub Actions 自动部署到 GitHub Pages。推送代码到 `main` 分支即可触发部署。

### 手动打包

```powershell
py -3 tools/package_site.py
```

或：

```powershell
npm run build
```

## 技术栈

- 纯静态 HTML/CSS
- GitHub Pages 托管
- GitHub Actions 自动部署
- JSON-LD 结构化数据（SEO）
- Open Graph / Twitter Card 支持

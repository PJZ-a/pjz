# 潘建泽 · 个人主页

简单的单页个人简介，包含：关于、教育、技能、项目与联系方式（含二维码）。


本地预览（推荐与备选方法）：

1) 使用 Python 简易服务器（推荐在 Windows 上用 `py -3`，若不可用再用 `python`）：

```powershell
cd "c:\Users\86199\Desktop\个人主页"
py -3 -m http.server 8080
# 或者（如果没有 py）
python -m http.server 8080
```

在浏览器打开： http://localhost:8080

如果端口被占用，可换成 `5500` 或其他端口：

```powershell
py -3 -m http.server 5500
```

2) 直接用本地文件查看（无服务器）：

在浏览器地址栏输入：

```
file:///C:/Users/86199/Desktop/个人主页/index.html
```

3) 在 VS Code 中使用 Live Server（图形方式，自动选端口）：

- 安装扩展：Live Server
- 右键 `index.html` → "Open with Live Server"

常见问题：
- Windows 如出现端口占用，可通过 `netstat -ano | findstr :8080` 查找 PID 并用 `taskkill /PID <pid> /F` 结束。
- 若无法启动，确认已安装 Python 3，或尝试更换端口/允许防火墙通过 `python.exe`。

## 静态站点打包与 GitHub Pages 部署

### 生成可部署包

项目根目录下运行：

```powershell
cd "c:\Users\86199\Desktop\个人主页"
py -3 tools/package_site.py
```

或使用 npm script（必须先进入项目目录）：

```powershell
cd "c:\Users\86199\Desktop\个人主页"
npm run build
```

执行后会生成 `pan-jianze-homepage.zip`，里面包含可直接部署的静态站点文件。

### GitHub Pages 部署指南

1) 创建一个 GitHub 仓库，例如 `pan-jianze-homepage`。
2) 将以下文件和文件夹推送到仓库根目录：
   - `index.html`
   - `styles.css`
   - `README.md`
   - `简历.docx`
   - `assets/`（包括 `wechat.jpg`）
   - `.nojekyll`
3) 打开仓库页面，进入 `Settings` → `Pages`。
4) 在 `Source` 部分选择 `Deploy from a branch`，并选择 `main` 或 `master` 分支，根目录 (`/`)。
5) 保存后，GitHub 会给出站点 URL，通常形如：

```
https://<你的用户名>.github.io/<仓库名>/
```

6) 等待几分钟，刷新即可访问你的个人主页。

### 直接部署方法

如果想直接部署网站内容，可以将 `pan-jianze-homepage.zip` 解压后的文件上传到 GitHub 仓库根目录，或使用其他静态站点托管服务。

> 注意：`.nojekyll` 文件用于禁用 GitHub Pages 的 Jekyll 处理，如果你未来加入 `_` 开头的文件夹或自定义文件结构，保留它会更稳妥。


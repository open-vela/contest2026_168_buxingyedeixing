# BadminSense-Edge 开发任务清单

## 项目概述

| 项目 | 说明 |
|------|------|
| 项目名称 | BadminSense-Edge 腕上羽毛球智能监测系统 |
| 目标开发板 | SF32LB52 LCD |
| 项目形态 | 快应用 (Quick App) |
| 代码目录 | `quickapp/badminSense_edge/` |

### 核心功能
1. **高频挥拍动作捕获** - 六轴 IMU（加速度计 + 陀螺仪）
2. **运动心率与卡路里监测** - PPG 光电传感器
3. **击球类型分类** - 边缘计算，实时特征提取与分类

---

## AI Coding 日志要求

### 日志格式
- **存储位置**：`logs/<your-github-login>/<date>/`
- **文件格式**：`.jsonl`（JSON Lines）
- **记录内容**：与 AI 的对话、思考过程、工具调用、token 统计

### 支持的工具
1. ✅ **Claude Code**（CLI + AIoT-IDE 内嵌）- 主推
2. ✅ **OpenCode**（CLI / TUI / VS Code 扩展）
3. ✅ **Codex CLI**
4. ⚠️ **多人协作**模式（各成员独立配置 `GITHUB_LOGIN`）
5. ❌ ChatGPT、Cursor、Cody 等第三方工具**不计入有效工时**

### 安装步骤（一次性）
```bash
# 1. 下载安装脚本
curl -O https://raw.githubusercontent.com/open-vela/contest2026_168_buxingyedeixing/main/install.sh

# 2. 运行安装
bash install.sh

# 3. 验证安装
verify-setup.sh
```

### 隐私保护
- 仅识别到 `.repo/` 的目录树内操作才会采集
- 工作区外的对话完全不被采集
- 如涉及敏感内容，可在 `git commit` 前删除对应的 `.jsonl` 文件

### 日志提交
```bash
# 日志在会话结束时自动写入本地 logs/
# 需要手动提交到仓库
git add logs/
git commit -s -m "logs: sync AI sessions"
git push
```

### 注意事项
- ⚠️ 修改日志内容被视为**作弊**
- ⚠️ 日志序号断档会被检测到
- ⚠️ 只有在 openvela 工作区内（存在 `.repo/`）的操作才会被采集

---

## 阶段一：环境搭建与项目初始化

### 任务 1.1：开发环境配置
- [ ] 安装 Node.js v22 LTS（通过 nvm）
- [ ] 安装 ADB 工具
- [ ] 安装 AIoT IDE
- [ ] 配置 Claude Code for VS Code 插件
- [ ] 配置 MiMo 模型（~/.claude/settings.json）

### 任务 1.2：AI Coding 日志系统配置
- [ ] 下载并运行日志采集安装脚本（install.sh）
- [ ] 验证日志采集状态（运行 `verify-setup.sh`）
- [ ] 确认日志目录结构（`logs/saber8899110-arch/`）
- [ ] 测试日志记录功能（进行一次简单对话后检查 logs/ 目录）

### 任务 1.3：项目创建
- [ ] 使用工作流模板创建项目：`npx create-vela-workflow badminSense_edge --mode claude`
- [ ] 配置模拟器（选择 vela-watch-5 镜像）
- [ ] 测试模拟器启动和基本运行

**交付物**：可运行的空项目框架

---

## 阶段二：UI 界面开发

### 任务 2.1：主页面设计 (pages/index/)
- [ ] 设计整体布局（深色主题，运动风格）
- [ ] 实现顶部状态栏（监测状态指示）
- [ ] 实现挥拍计数器（圆形动画效果）
- [ ] 实现击球类型显示区域
- [ ] 实现健康数据面板（心率、卡路里、时长）
- [ ] 实现操作按钮（开始/停止、重置）
- [ ] 实现击球统计网格

### 任务 2.2：统计页面设计 (pages/stats/)
- [ ] 设计历史数据展示
- [ ] 实现击球类型分布图表
- [ ] 实现运动趋势图表

### 任务 2.3：设置页面设计 (pages/settings/)
- [ ] 实现阈值调整功能
- [ ] 实现个人信息设置（体重等）
- [ ] 实现数据导出功能

**交付物**：完整的三页面 UI 框架

---

## 阶段三：传感器数据采集

### 任务 3.1：IMU 数据管理模块 (common/imu-manager.js)
- [ ] 实现加速度计订阅（sensor.subscribeAccelerometer）
- [ ] 实现陀螺仪订阅（sensor.subscribeGyroscope）
- [ ] 实现数据同步（确保时间戳对齐）
- [ ] 实现高频采样（game 模式，50Hz）
- [ ] 实现数据缓冲区管理
- [ ] 实现启停控制

### 任务 3.2：健康数据管理模块 (common/health-monitor.js)
- [ ] 实现心率订阅（service.health）
- [ ] 实现卡路里估算算法
- [ ] 实现运动时长统计
- [ ] 实现后台运行支持

### 任务 3.3：传感器数据融合
- [ ] 实现加速度与角速度融合
- [ ] 实现数据校准（零偏校正）
- [ ] 实现噪声滤波（低通滤波器）

**交付物**：可获取实时传感器数据的管理模块

---

## 阶段四：核心算法开发

### 任务 4.1：挥拍检测算法 (common/swing-detector.js)
- [ ] 设计挥拍检测阈值（加速度峰值、角速度峰值）
- [ ] 实现挥拍开始检测
- [ ] 实现挥拍结束检测
- [ ] 实现挥拍时长判断（80ms - 400ms）
- [ ] 实现连续挥拍去重

### 任务 4.2：击球特征提取 (common/feature-extractor.js)
- [ ] 提取加速度特征（峰值、均值、标准差、斜率）
- [ ] 提取角速度特征（峰值、均值、标准差、斜率）
- [ ] 提取方向特征（up/down/horizontal）
- [ ] 提取挥拍角度特征（steep/high/flat/gentle）
- [ ] 提取能量特征

### 任务 4.3：击球类型分类器 (common/shot-classifier.js)
- [ ] 设计击球类型特征模板
  - 高远球 (highClear)
  - 杀球 (smash)
  - 平抽 (drive)
  - 挑球 (lift)
  - 吊球 (drop)
- [ ] 实现基于规则的分类算法
- [ ] 实现置信度计算
- [ ] 实现分类结果优化（时序平滑）

### 任务 4.4：数据存储模块 (common/data-store.js)
- [ ] 实现本地数据存储（storage API）
- [ ] 实现会话数据管理
- [ ] 实现历史数据查询
- [ ] 实现数据导出功能

**交付物**：完整的挥拍检测与击球分类算法

---

## 阶段五：功能集成与测试

### 任务 5.1：模块集成
- [ ] 集成 IMU 管理模块
- [ ] 集成挥拍检测算法
- [ ] 集成击球分类器
- [ ] 集成健康数据模块
- [ ] 集成数据存储模块

### 任务 5.2：模拟器调试
- [ ] 测试传感器数据获取（Mock 数据）
- [ ] 测试挥拍检测逻辑
- [ ] 测试击球分类准确率
- [ ] 测试 UI 交互响应
- [ ] 测试后台运行功能

### 任务 5.3：算法参数调优
- [ ] 调整挥拍检测阈值
- [ ] 调整击球分类特征权重
- [ ] 优化分类置信度
- [ ] 优化响应延迟

**交付物**：可正常运行的完整应用

---

## 阶段六：文档与提交

### 任务 6.1：项目文档
- [ ] 编写 README.md（项目介绍、功能说明、使用方法）
- [ ] 整理代码注释
- [ ] 编写 API 文档

### 任务 6.2：AI Coding 日志
- [ ] 验证日志采集状态（运行 `verify-setup.sh`）
- [ ] 检查日志完整性（运行 `validate-log.py logs/`）
- [ ] 查看日志内容（可选：`render-log.py` 生成报告）
- [ ] 补导历史对话（如有需要：`contest-snapshot --backfill`）
- [ ] 提交日志到仓库

### 任务 6.3：最终提交
- [ ] 更新 manifest.json（应用信息）
- [ ] 检查代码规范
- [ ] 测试最终版本
- [ ] 提交到仓库

**交付物**：完整的参赛作品

---

## 技术架构

```
quickapp/badminSense_edge/
├── manifest.json                 # 应用配置
├── app.ux                        # 应用入口
├── pages/
│   ├── index/                    # 主页面（实时监测）
│   │   ├── index.ux
│   │   ├── index.css
│   │   └── index.js
│   ├── stats/                    # 统计页面
│   │   ├── stats.ux
│   │   ├── stats.css
│   │   └── stats.js
│   └── settings/                 # 设置页面
│       ├── settings.ux
│       ├── settings.css
│       └── settings.js
├── common/
│   ├── imu-manager.js            # IMU 数据管理
│   ├── swing-detector.js         # 挥拍检测算法
│   ├── feature-extractor.js      # 特征提取
│   ├── shot-classifier.js        # 击球分类器
│   ├── health-monitor.js         # 健康数据监控
│   ├── data-store.js             # 数据存储
│   └── constants.js              # 常量定义
└── images/                       # 图标资源
```

---

## 关键 API 使用

### 传感器 API
```javascript
import sensor from '@system.sensor'

// 加速度计（50Hz）
sensor.subscribeAccelerometer({
  interval: 'game',
  callback: (data) => { /* x, y, z */ }
})

// 陀螺仪（50Hz）
sensor.subscribeGyroscope({
  interval: 'game',
  callback: (data) => { /* x, y, z */ }
})
```

### 健康数据 API
```javascript
import health from '@system.health'

// 心率订阅
health.subscribeSample({
  dataType: 0, // HEART_RATE
  callback: (data) => { /* value */ }
})
```

---

## 预期成果

### 功能完成度
- ✅ 六轴 IMU 数据采集（加速度计 + 陀螺仪）
- ✅ 挥拍动作实时检测
- ✅ 击球类型自动分类（5种类型）
- ✅ 心率实时监测
- ✅ 卡路里消耗估算
- ✅ 运动时长统计
- ✅ 本地数据存储与查询
- ✅ 美观的深色主题 UI

### 性能指标
- 挥拍检测延迟：< 100ms
- 击球分类准确率：> 70%（目标）
- 采样频率：50Hz
- 应用启动时间：< 2s

---

## 开发时间计划

| 阶段 | 任务 | 预计时间 |
|------|------|---------|
| 阶段一 | 环境搭建与项目初始化 | 1 天 |
| 阶段二 | UI 界面开发 | 2 天 |
| 阶段三 | 传感器数据采集 | 2 天 |
| 阶段四 | 核心算法开发 | 3 天 |
| 阶段五 | 功能集成与测试 | 2 天 |
| 阶段六 | 文档与提交 | 1 天 |
| **总计** | | **11 天** |

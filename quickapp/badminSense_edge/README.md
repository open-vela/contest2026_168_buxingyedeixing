# BadminSense-Edge 快应用

BadminSense-Edge 是面向 openvela 智能手表的羽毛球运动监测应用。它使用六轴 IMU 在端侧检测挥拍并对高远球、杀球、平抽、挑球和吊球进行规则分类，同时记录心率、卡路里、运动时长和历史训练。

## 当前版本

- 七页面：主页、设置、运动概览、击球记录、移动记录、运动总结、历史记录；
- 运动会话支持开始、暂停、恢复、结束、保存和放弃；
- 模拟器 Mock 模式会按固定顺序生成五类演示事件，所有页面持续标识“模拟数据”；
- 真机模式包含 50 Hz 加速度计/陀螺仪接入、挥拍检测、特征提取、五类规则分类和心率接入；
- 历史记录使用 `@system.storage` 本地保存；
- 真机 API 和算法阈值需要在 SF32LB52 固件上进一步验证和标定。

## 环境与构建

```bash
npm install
npm run build
```

开发预览：`npm run start`；发布包：`npm run release`。

## 模拟器测试

1. 打开应用，进入“训练设置”；
2. 确保数据来源选中“模拟器”；
3. 返回主页并开始运动；
4. 等待约 20 秒，分别打开运动概览、击球记录和移动记录；
5. 验证五类击球依次累计，心率、卡路里、步数和时长持续更新；
6. 验证暂停后时长和事件停止累计，继续后恢复；
7. 结束运动并保存；
8. 从历史记录进入只读训练详情，确认不会出现重复保存按钮。

## 数据真实性

Mock 模式只用于模拟器交互和流程验证，记录中的 `dataSource` 为 `mock`。真机模式不会用随机数伪造击球、心率或移动数据；传感器不可用时显示缺失或错误状态。

## 代码结构

```text
src/
├── pages/                         # 七个产品页面
├── common/
│   ├── workout-session.js         # 共享运动会话和生命周期
│   ├── imu-manager.js             # IMU 订阅和样本融合
│   ├── swing-detector.js          # 挥拍状态机与去重
│   ├── feature-extractor.js       # 窗口特征提取
│   ├── shot-classifier.js         # 五类规则分类器
│   ├── health-monitor.js          # 心率订阅
│   ├── mock-provider.js           # 明确标识的模拟器数据
│   ├── data-store.js              # 设置、会话和历史存储
│   └── constants.js               # 术语、阈值和默认设置
└── manifest.json                  # 应用权限与七页面路由
```

完整需求、算法、验收和大赛交付要求见外层参赛仓 `docs/BADMINSENSE_EDGE_DEVELOPMENT.md`。

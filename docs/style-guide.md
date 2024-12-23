# Vue3 Admin 样式规范指南

## 目录
1. [基础容器](#基础容器)
2. [布局工具类](#布局工具类)
3. [间距系统](#间距系统)
4. [文本样式](#文本样式)
5. [颜色系统](#颜色系统)
6. [阴影效果](#阴影效果)
7. [响应式设计](#响应式设计)
8. [动画与过渡](#动画与过渡)
9. [辅助工具类](#辅助工具类)

## 基础容器

### 标准容器
```html
<div class="container">
  <!-- 内容 -->
</div>
```

容器默认样式:
- 自适应内边距
- Element Plus 背景色
- 浅色边框
- 大圆角
- 轻微阴影
- 自动垂直滚动

## 布局工具类

### Flex 布局
```html
<!-- 基础 Flex -->
<div class="flex">...</div>

<!-- 居中对齐 -->
<div class="flex-center">...</div>

<!-- 两端对齐 -->
<div class="flex-between">...</div>

<!-- 环绕对齐 -->
<div class="flex-around">...</div>

<!-- 垂直布局 -->
<div class="flex-col">...</div>

<!-- Flex 换行 -->
<div class="flex-wrap">...</div>
<div class="flex-nowrap">...</div>

<!-- Flex 子元素 -->
<div class="flex-grow">...</div>
<div class="flex-shrink">...</div>
<div class="flex-no-shrink">...</div>
```

## 间距系统

### 预设间距类
```html
<!-- 外边距 -->
<div class="m-{size}">...</div>
<div class="mt-{size}">...</div>
<div class="mr-{size}">...</div>
<div class="mb-{size}">...</div>
<div class="ml-{size}">...</div>
<div class="mx-{size}">...</div>
<div class="my-{size}">...</div>

<!-- 内边距 -->
<div class="p-{size}">...</div>
<div class="pt-{size}">...</div>
<div class="pr-{size}">...</div>
<div class="pb-{size}">...</div>
<div class="pl-{size}">...</div>
<div class="px-{size}">...</div>
<div class="py-{size}">...</div>
```

### 精确像素间距
```html
<!-- 0-100px的精确间距 -->
<div class="mt{n}">...</div>
<div class="mr{n}">...</div>
<div class="mb{n}">...</div>
<div class="ml{n}">...</div>
<div class="pt{n}">...</div>
<div class="pr{n}">...</div>
<div class="pb{n}">...</div>
<div class="pl{n}">...</div>
```
其中 n 为 0-100 的整数。

## 文本样式

### 文本工具类
```html
<!-- 文本截断 -->
<div class="text-truncate">单行截断...</div>
<div class="text-sle">单行截断...</div>
<div class="text-truncate-2">两行截断...</div>
<div class="text-mle">两行截断...</div>
<div class="text-truncate-3">三行截断...</div>

<!-- 文本换行 -->
<div class="text-break">文本换行</div>

<!-- 文本对齐 -->
<div class="text-left">左对齐</div>
<div class="text-center">居中对齐</div>
<div class="text-right">右对齐</div>
```

### 字体大小
```html
<!-- 使用预设的字体大小 -->
<div class="text-{size}">...</div>
```

## 颜色系统

### 主题色
```html
<!-- 文本颜色 -->
<div class="text-{color}">...</div>

<!-- 背景颜色 -->
<div class="bg-{color}">...</div>
```

### 中性色
```html
<!-- 文本颜色 -->
<div class="text-{neutral}">...</div>

<!-- 背景颜色 -->
<div class="bg-{neutral}">...</div>
```

## 阴影效果

### 预设阴影
```html
<!-- 使用预设的阴影 -->
<div class="shadow-{size}">...</div>
```

## 响应式设计

### 响应式工具类
```html
<!-- 响应式显示/隐藏 -->
<div class="hidden-{breakpoint}-up">在特定断点以上隐藏</div>
<div class="visible-{breakpoint}-up">在特定断点以上显示</div>

<!-- 响应式容器 -->
<div class="container-{breakpoint}">响应式宽度的容器</div>
```

## 动画与过渡

### 过渡效果
```html
<!-- 基础过渡 -->
<div class="transition">...</div>

<!-- 快速过渡 -->
<div class="transition-fast">...</div>

<!-- 慢速过渡 -->
<div class="transition-slow">...</div>
```

## 辅助工具类

### 鼠标样式
```html
<div class="cursor-pointer">指针样式</div>
<div class="cursor-not-allowed">禁用样式</div>
<div class="cursor-wait">等待样式</div>
<div class="cursor-text">文本样式</div>
<div class="cursor-move">移动样式</div>
<div class="cursor-grab">抓取样式</div>
```

### 定位类
```html
<div class="position-relative">相对定位</div>
<div class="position-absolute">绝对定位</div>
<div class="position-fixed">固定定位</div>
<div class="position-sticky">粘性定位</div>
```

### 溢出控制
```html
<div class="overflow-hidden">隐藏溢出</div>
<div class="overflow-auto">自动滚动</div>
<div class="overflow-scroll">始终滚动</div>
<div class="overflow-visible">显示溢出</div>
```

### 清除浮动
```html
<div class="clearfix">...</div>
```

### z-index 层级
```html
<div class="z-{level}">控制层级</div>
```

## 注意事项

1. **命名规范**
   - 使用 BEM 命名规范
   - 组件名使用 kebab-case
   - 状态类使用 `--` 前缀
   - 子元素使用 `__` 前缀

2. **性能优化**
   - 避免深层嵌套（不超过3层）
   - 合理使用 CSS 选择器
   - 使用 CSS 变量实现主题切换
   - 使用 transform 和 opacity 实现动画效果

3. **维护建议**
   - 遵循 DRY 原则，使用 mixins 和变量
   - 保持样式文件的模块化
   - 注释关键的样式代码
   - 定期检查和清理未使用的样式
</rewritten_file> 
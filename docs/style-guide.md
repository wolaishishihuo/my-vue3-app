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

## 基础容器

### 标准容器
```html
<div class="container">
  <!-- 内容 -->
</div>
```

### 卡片容器
```html
<div class="container-card">
  <!-- 普通卡片内容 -->
</div>

<div class="container-card container-card--scroll">
  <!-- 可滚动的卡片内容 -->
</div>
```

## 布局工具类

### Flex 布局
```html
<!-- 基础 Flex -->
<div class="flex">...</div>

<!-- 居中对齐 -->
<div class="flex-center">...</div>

<!-- 两端对齐 -->
<div class="flex-between">...</div>

<!-- 垂直布局 -->
<div class="flex-col">...</div>

<!-- Flex 子元素 -->
<div class="flex-grow">...</div>
<div class="flex-shrink">...</div>
<div class="flex-no-shrink">...</div>
```

### SCSS Mixins
```scss
// Flex 布局
@include flex(row, space-between, center);
@include flex(column, center, flex-start);

// 绝对定位居中
@include absolute-center();
@include absolute-center('vertical');
@include absolute-center('horizontal');
```

## 间距系统

### 预定义间距
```scss
// 在 SCSS 中使用
margin-bottom: map-get($spacings, '4');  // 16px
padding: map-get($spacings, '5');        // 20px
gap: map-get($spacings, '2');           // 8px
```

### 工具类
```html
<!-- 外边距 -->
<div class="m-4">...</div>
<div class="mt-4">...</div>
<div class="mb-4">...</div>
<div class="mx-4">...</div>
<div class="my-4">...</div>

<!-- 内边距 -->
<div class="p-4">...</div>
<div class="pt-4">...</div>
<div class="pb-4">...</div>
<div class="px-4">...</div>
<div class="py-4">...</div>
```

## 文本样式

### 文本大小
```scss
// 在 SCSS 中使用
font-size: map-get($font-sizes, 'sm');   // 14px
font-size: map-get($font-sizes, 'base'); // 16px
font-size: map-get($font-sizes, 'lg');   // 18px
font-size: map-get($font-sizes, 'xl');   // 20px
```

### 文本工具类
```html
<!-- 文本截断 -->
<div class="text-truncate">单行截断...</div>
<div class="text-truncate-2">两行截断...</div>
<div class="text-truncate-3">三行截断...</div>

<!-- 文本对齐 -->
<div class="text-left">左对齐</div>
<div class="text-center">居中对齐</div>
<div class="text-right">右对齐</div>
```

### SCSS Mixins
```scss
// 文本截断
@include text-truncate(1);  // 单行截断
@include text-truncate(2);  // 两行截断
```

## 颜色系统

### Element Plus 变量
```scss
// 主题色
color: var(--el-color-primary);
background-color: var(--el-bg-color);
border-color: var(--el-border-color-light);

// 文本色
color: var(--el-text-color-primary);
color: var(--el-text-color-regular);
color: var(--el-text-color-secondary);
```

### 渐变效果
```scss
// 渐变背景
@include gradient(var(--el-color-primary-light-5), var(--el-color-primary), 135deg);
```

## 阴影效果

### 预定义阴影
```scss
// 在 SCSS 中使用
@include shadow('sm');    // 轻微阴影
@include shadow('base'); // 基础阴影
@include shadow('md');   // 中等阴影
@include shadow('lg');   // 大阴影
@include shadow('xl');   // 特大阴影
```

## 响应式设计

### 断点系统
```scss
// 在 SCSS 中使用
@media screen and (max-width: map-get($breakpoints, 'sm')) { ... }  // 640px
@media screen and (max-width: map-get($breakpoints, 'md')) { ... }  // 768px
@media screen and (max-width: map-get($breakpoints, 'lg')) { ... }  // 1024px
@media screen and (max-width: map-get($breakpoints, 'xl')) { ... }  // 1280px
```

### SCSS Mixins
```scss
// ��应式断点
@include respond-to('sm') {
  // 平板样式
}

@include respond-to('md') {
  // 小屏幕样式
}

@include respond-to('lg') {
  // 大屏幕样式
}
```

## 动画与过渡

### 过渡效果
```scss
// 基础过渡
@include transition();

// 自定义过渡
@include transition(transform, 0.2s, ease-out);
```

### 工具类
```html
<!-- 基础过渡 -->
<div class="transition">...</div>

<!-- 快速过渡 -->
<div class="transition-fast">...</div>

<!-- 慢速过渡 -->
<div class="transition-slow">...</div>
```

## 最佳实践

### 1. 组件样式结构
```scss
.component-container {
    // 1. 布局属性
    @include flex(column);
    padding: map-get($spacings, '5');
    
    // 2. 视觉属性
    background-color: var(--el-bg-color);
    @include shadow('sm');
    border-radius: map-get($border-radius, 'lg');
    
    // 3. 文本样式
    color: var(--el-text-color-primary);
    font-size: map-get($font-sizes, 'base');
    
    // 4. 交互效果
    @include transition();
    
    &:hover {
        @include shadow('md');
        transform: translateY(-2px);
    }
}
```

### 2. 响应式布局示例
```scss
.responsive-component {
    padding: map-get($spacings, '5');
    
    @include respond-to('lg') {
        padding: map-get($spacings, '4');
    }
    
    @include respond-to('md') {
        padding: map-get($spacings, '3');
    }
    
    @include respond-to('sm') {
        padding: map-get($spacings, '2');
    }
}
```

### 3. 表单布局示例
```html
<div class="container-card">
    <form class="flex-col">
        <div class="form-group mb-4">
            <label class="text-sm text-gray-600 mb-2">用户名</label>
            <input type="text" class="form-input" />
        </div>
        
        <div class="flex-between mt-6">
            <button class="btn-secondary">取消</button>
            <button class="btn-primary">提交</button>
        </div>
    </form>
</div>
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
# l_build的项目说明

#### 1.package.json文件 新添的一些包
sass:引用scss文件需要的一个预处理依赖
pinia：使用pinia状态管理器
@vitejs/plugin-vue：解析tsx文件需要一个包，如果不做这个处理，控制台会出现"React is not defined"报错
unplugin-vue-components和unplugin-auto-import:这两个包是为了自动按需引入element-plus组件库中的组件

#### 2. ts需要的配置
"jsx": "preserve",这个配置项是为了让编译器可以编译tsx文件
"resolveJsonModule": true,这个配置是为了让编译器可以找到json文件
declare.ts，这个文件中有几个声明，一个关于jsx的命名空间声明，做一个tsx的一个配置，确保使用tsx的时候不会出现any类型的警告；

(注释中的代码：在使用vite项目的时候似乎不会出现找不文件的情况)
一个是scss的模块声明，这个声明是为了让tsx文件可以识别找到scss文件，另外一个是关于css模块的声明，这个声明是为了让tsx文件可以识别找到css文件
##### 2.1 vite.config.ts 文件的修改
vueJsx()是为了解决控制台会出现"React is not defined"报错的相应修改
AutoImport和Component的配置是为了可以自动按需导入element-plus组件库
##### 2.2 declare文件夹中的element声明
该文件是解决按需导入对应组件的编译器报错问题，每次导入一个组件都需要在这个文件中进行一个声明

#### 3. data.json文件
container：是编辑器内容区的一个高度
blocks：是编辑器左侧组件库中的组件键值名，左侧组件库的渲染依靠该数据。
containerBlocks：是编辑器内容区要渲染的组件的值，内容区组件的渲染依靠该数据。


#### 4. components组件
1.editorAll 是整个编辑器组件
2.editorLeft 是编辑器中的左侧组件库
3.editorRight 是编辑器中右侧的组件相关数据的控制台
4.editorTop 是编辑器中顶部的一个编辑器快捷操作控制台
5.editorContent 是编辑器的主要内容，也即是编辑器的主体

#### 5. style文件夹
该文件夹是存放对应组件的scss样式，部分vue后缀的组件的css样式直接写在模版中

#### 6. icon文件夹
该文件夹是存放字体图标的样式的。其中icon.css 文件中的代码就是通过在线链接引用字体图标

#### 7. main.ts中的修改
import './icon/icon.css' 引用字体图标，让整个项目可以使用
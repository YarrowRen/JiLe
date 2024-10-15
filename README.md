# 系统具体实现

## 全部书库展示界面

在设计全部书库的展示界面时，一方面要重视界面的美观与简洁，另一方面也要保证用户的功能体验充足且高效，所以全部书库界面设计从第一视角分为两个主要部分。

界面上方为随机推荐部分，会从数据库随机读取指定数目的电子书数据，以其封面生成走马灯，用户可以通过点击走马灯上的图片使用默认方式打开电子书文件。

界面下部分为各个书库展示界面，每个展示卡片左半部分为书库封面，右半部分则为书库的名称与简介，单击书库卡片则会跳转对应书库界面，右键则会弹出响应补充功能按钮：打开书库，编辑书库，删除书库，以及打开书库所在文件夹。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527060944.png)

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527060956.png)

## 书库展示界面

界面最上方展示功能栏，功能栏第一项为上传书籍按钮，点击后调用系统文件管理器进行电子书文件选择并上传，第二项为刷新与同步按钮，点击后对本地电子书库进行数据同步，并刷新数据库，第三项为多功能搜索栏，用户可以根据指定搜索条件进行书籍的搜索。

功能栏下方为电子书展示与选择界面，用户可以查看所有电子书基本信息（书名，作者，出版商，评分，语言，出版日期，书号，页数，类型，标签等），并且可以根据指定栏目进行数据的排序展示。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527061023.png)

界面右部分为电子书详细信息展示界面，最上方展示电子书封面，右键电子书封面部分，弹出补充功能栏，主要有默认方式打开，书籍元数据编辑，移除书籍，文件夹打开以及豆瓣搜索指定书籍。封面下方展示书籍详细信息，最下方为对应功能按钮：编辑元数据信息，默认方式打开电子书以及移除电子书。

拖拽上传是一种非常简单的文件上传方式，不需要进行复杂的选择或点击操作，只需要在文件管理器中拖拽文件或文件夹到上传窗口即可。这种方式能够节省用户的时间，提高上传效率。支持多文件上传，用户可以将多个文件或文件夹拖拽到上传窗口中，然后一次性上传它们。这种方式能够帮助用户快速上传大量文件，节省时间和精力。项目重新实现了全局拖拽上传方式，具体核心代码见附录 1-核心代码 1：拖拽上传图书（前端）。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527061053.png)

## 书籍元数据编辑界面

编辑书籍元数据界面，在用户点击功能键后弹出，界面左半部分以展示封面图为主，最上方展示封面图，图片下方是切换封面图按钮，点击后调出系统文件选择器进行图片选择并缓存后设置为封面，最下方是切换收藏状态按钮。界面右部分是编辑书籍元数据表单，按照书籍内数据特性分配表单选项情况。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527061118.png)

## 全部图集界面

全部图集界面基本与全部书库界面保持一致，上方从数据库随机选择进行随机图片资源推荐，下方以栅栏式进行书库卡片的设计，自适应界面大小变化，其余功能键也与全部书库界面基本保持一致。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527061147.png)

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527061156.png)

## 图集展示界面

图集展示界面采用瀑布流式布局进行展示，一方面瀑布流布局可以使页面看起来更加美观，具有视觉冲击力。图片、文字、视频等元素可以根据不同的尺寸、比例进行排列，使得整个页面呈现出错落有致的感觉，给人以美感。另一方面瀑布流布局可以让用户轻松地快速浏览大量内容，不需要像传统布局方式一样翻页或者滚动到底部查看更多内容，用户可以浏览更多的内容，提高了用户的使用体验。同时，瀑布流布局可以节约页面空间，因为它可以让网页上的元素紧凑地排列，使得页面可以呈现更多内容，同时使得页面不显得过于拥挤。最重要的是瀑布流布局可以适应不同屏幕尺寸，因为它可以根据屏幕宽度自动调整元素的排列方式，从而使得页面可以在不同的设备上呈现出最佳的布局效果。

项目中重写了整个瀑布流的实现逻辑，保证了完整实现后的瀑布流更加适应桌面化应用开发与使用，同时为瀑布流增加了除自适应宽度外的手动调节栅栏宽度大小功能，用户可以通过功能键或者快捷键（CTRL+鼠标滚轮上滑/下滑）进行页面中瀑布流栅栏宽度的自定义。

界面上方为图集展示界面分页部分与功能区，主要包括返回按钮与瀑布流宽度调节按钮以及同步功能键和文件上传功能键。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527061241.png)

## 图集元数据编辑界面

在图集展示界面单击图片会展开图片资源展示与编辑界面栏，界面最上方是图片资源预览缓存图，图片下方展示图片的五个主色调色块，单击或右键可以选择复制色块的 RGB 值或 16 进制值。随后的是收藏状态切换栏，之后是图片信息编辑栏，支持用户编辑图片的相关网址链接，图片基本信息或简介，以及图片的标签内容。最下方是图片基本信息内容，会调用系统指令分析图片的分辨率，类型以及创建日期等基本信息。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527061307.png)

## 图片详情界面

点击图片下方链接或者右键进入详情，即可进入图片详情界面，页面分为左右两个卡片界面，左半部分卡片主要进行图片内容的展示，点击缓存图片可以唤起预览窗口，在应用内预览图片情况，下方进行图片主色调分析，将图片的五个主色调以色块的形式进行展示。最下方对应两个主要功能键，页面截图和文件夹内打开。

页面右半部分则是功能键与基本信息展示卡片，最上方三个按钮分别支持用户将图片分享至 QQ 空间与微信或是复制文件路径，下方展示了图片的评分，相关链接，图片信息备注，标签，创建日期以及分辨率和图片类型等基本信息。最后一部分则是默认方式打开图片以及收藏状态切换按钮。

为了方便用户在使用过程中将软件内图片或使用情况分享给其他用户，项目重写了页面截图功能方法

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527061346.png)

## 全部影集界面

全部影集界面设计方案与前面两部分（全部书库，全部图集）异曲同工，上半部分进行影视的随机推荐，点击后唤起默认视频播放器进行播放。页面下半部分以栅栏式进行书库卡片的设计，自适应界面大小变化，其余功能键也与全部书库界面基本保持一致。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527061418.png)

## 影集展示界面

影集展示界面主要参考主流视频网站设计方式，以分立格式对视频资源进行管理，上方提供视频上传功能按钮以及本地文件同步功能。

下方逐个展示视频资源，展示栏大小同样使用栅栏式设计，随页面大小变化进行动态变化，每个视频展示栏上方展示封面，封面支持自动生成或主动上传，下方展示视频评分，名称以及功能键栏，用户可以通过功能栏，修改视频基本信息，默认方式打开，文件夹内打开或是删除指定视频。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527061449.png)

## 视频元数据编辑界面

编辑视频基本信息界面，左半部分为视频封面以及收藏状态修改按钮，用户可以通过在此处修改视频封面，右半部分为视频基本信息编辑表单，按照每个栏目相关属性对表单进行优化，方便用户快捷修改，提高用户使用体验。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527061527.png)

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527061537.png)

## 视频详情展示界面

影视详情界面，最上方展示视频名称，下方以标签形式展示视频相关 tag，随后是视频基本信息卡片，分栏形式展示视频的简介，导演，编剧，演员等相关人员，上映日期，相应链接，以及帧长，时长，声道等细节信息，最下方是默认播放按钮以及收藏状态切换栏。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527061606.png)

最下方重写了原生视频播放器，对视频播放器进行拟物设计，并实现相应功能键。实现了对视频的播放/暂停切换，音量调节，进度调节，页面截图，视频搜做，静音，重置播放器，全屏切换，返回等功能。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527061624.png)

---

# 摘要

随着互联网的发展与短视频等流媒体展示分享方式的普及，如何同时进行多种多媒体文件资源的管理与分类逐渐成为困扰人们进行文件管理的主要问题。本项目为解决上述问题，设计了一款多媒体集成管理器，采用前后端分离的方式，使用 Electron 和 Vue.js 作为前端框架，Springboot 作为后端框架。项目主要模块分为电子书管理模块，图片管理模块以及影视资源管理模块。项目基本功能主要有：文件元数据编辑，文件标签操作，文件夹同步，高级文件搜索，本地文件操作，瀑布流展示，文件分享，应用内预览，页面自动截图，拟物播放器等。最后对系统进行了综合测试与结果分析，结果表明：项目交互性良好，兼容性高，实现了目标功能。具有实际应用意义。

# 系统详细设计

通过对项目整体进行可行性分析与需求分析，项目设计的基本方向和功能内容相对明确，项目以普通用户为设计视角，详细介绍对应功能与界面的设计和实现。

## 系统总体架构设计

项目总体架构设计采用前后端分离的设计模式，前端使用 Electron 和 Vue.js 作为前端开发框架，同时使用 Node.js 中的 Axios 作为网络通信库与后端通过 Http 请求进行数据通信和功能通信。后端使用 Spring boot 作为开发框架，利用 MyBatis 与 MySQL 数据库进行数据传输。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230526223546.png)

## 系统数据库设计

项目内共使用 14 张数据表，表间关系通过外键相连接，下图为项目 E-R 图

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230526223732.png)

### 数据库表设计

数据表主要分为三大类，与影视资源相关数据表（vc_info,video_info,video_tag 等）与电子书资源相关数据表（ec_info,ebook_info,ebook_tag,ebook_author 等），与图片资源相关数据表（ic_info,image_info,image_tag 等）。下面以相对全面的影视资源数据表为例介绍项目建表原则。

<center><p>表 4.1 影视合集数据表</p></center>

| 字段     | 数据类型 | 说明                                 |
| -------- | -------- | ------------------------------------ |
| ID(主键) | INT      | 影视合集数据表主键，唯一标识符，自增 |
| VC_NAME  | VARCHAR  | 影视合集名称                         |
| VC_PATH  | VARCHAR  | 影视合集所在文件夹路径               |
| VC_DESC  | VARCHAR  | 影视合集简介                         |
| VC_COVER | VARCHAR  | 影视合集封面（缓存）                 |

<center><p>表4.2 视频资源数据表</p></center>

| 字段        | 数据类型 | 说明                                    |
| ----------- | -------- | --------------------------------------- |
| VC_ID       | INT      | 视频资源所属影视合集 ID，外键           |
| videoID     | INT      | 视频资源主键，视频资源唯一标识符，自增  |
| videoName   | VARCHAR  | 视频资源名称，即用于辨识也用于标识路径  |
| videoCover  | VARCHAR  | 视频资源封面（缓存）                    |
| videoScore  | TINYINT  | 0-5 数字，用于表示用户对视频的评分      |
| Followed    | TINYINT  | 0 或 1 数字，用于表示用户是否关注该视频 |
| Intro       | VARCHAR  | 视频资源简介                            |
| releaseDate | DATETIME | 视频资源发布日期                        |
| url         | VARCHAR  | 视频资源相关网址链接                    |

## 项目前端界面功能设计

整个项目中，界面展示部分作为用户最直接接触以及感知的部分，对用户的第一使用体验以及软件综合感受起着决定性作用。在界面设计过程中应严格以用户使用体验为第一要义，同时保证软件使用过程中的功能完善以及呈现效果等方面。

### 综合展示模块界面设计

综合展示模块负责统计并展示不同类型资源合集相关情况以及进行随机的相关资源推荐，主要分为书库综合展示，图集综合展示以及影集综合展示部分。该模块是用户在进入软件后首先要体验到的部分，也是最高层面上管理整个多媒体资源集成管理器系统内文件的模块。

该部分流程主要为用户进入系统后点击进入指定类型文件综合管理模块内部，展示界面分别对随机推荐的相关类型文件进行展示，同时对该类型下所有合集内容进行展示，展示内容包括合集名称，合集封面以及合集基本简介等。

用户右键点击指定合集卡片，弹出扩展操作选项，主要分为打开书库详情界面，编辑书库元数据，删除指定书库，在文件夹内按路径打开指定书库。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230526224421.png)

在该过程中文件夹默认打开指定合集路径涉及到对系统进行直接操作，其主要操作流程见下图。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230526224452.png)

### 书库展示界面设计

在设计书库展示界面时，应考虑到用户的实际体验，一方面要兼顾图书信息的全面展示，另一方面应尽可能简化用户操作降低用户学习成本。综上，主要应综合保证以下内容：

1. 界面布局：应该采用简洁明了的布局方式，使得用户可以快速浏览和选择电子书，可以使用网格布局、列表布局等方式来展示电子书。
2. 电子书信息：应该展示电子书的基本信息，如书名、作者、出版社、出版时间、简介等，方便用户了解电子书的基本情况。
3. 封面展示：应该展示电子书的封面图片，以吸引用户的眼球，同时方便用户快速识别电子书。
4. 排序和筛选：应该提供排序和筛选功能，方便用户按照自己的需求进行电子书的选择和浏览。
5. 评分和评论：应该提供用户评分和评论的功能，方便用户了解其他用户的评价和意见，同时也可以为其他用户提供参考。
6. 搜索功能：应该提供搜索功能，方便用户快速查找自己需要的电子书，提高用户的使用效率。
7. 标签功能，每个资源身上可以打上一系列“标签”, 以表明这个资源的属性, 对其进行分类。“标签”具有层次性, 是资源类别的一个体现[5]。
   总的来说，一个好的电子书合集界面应该简洁明了、易于使用、能够满足用户的需求，并且提供优秀的用户体验。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230526224553.png)

在进行高级搜索过程中，主要流程是在搜索界面首先进行搜索类型的类型选择，确定是按照书名，作者，出版商还是其他内容进行搜索。确定好搜索类型后，进行搜索内容的输入，前端在接收到搜索内容后对搜索内容进行切分，随后将相关数据传输到后端进行模糊查询，前端向后端发送请求过程中需要调用 Node.js 下的 Axios 库进行网络通信，Axios 是一款易用、简洁且高效的 http 库，是一个可以用在浏览器和 Node.js 中的异步通信框架，其主要作用就是实现 Ajax 异步通信，由于 Vue 只关注视图层内容，使用 Axios 更为便捷。使用 Axios 控制网络通信过程具有以下特点：（1）从浏览器中创建 XMLHttpRequests，（2）从 node.js 创建 http 请求，（3）支持 Promise API（在 JS 中进行链式编程），（4）拦截请求和相应，（5）转换请求数据和响应数据，（6）取消请求，（7）自动转换 JSON 数据，（8）客户端支持防御 XSRF。整个高级搜索流程如下图所示

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230526224615.png)

### 图集展示界面

图集展示界面需要同时对用户的大量图片进行展示，以瀑布流形式进行整个内容的展示相对更加合理，在该过程中需要注意到：

1. 图片尺寸和比例：瀑布流展示图片的界面中，图片的尺寸和比例是非常重要的。应该确保每一张图片都能够清晰地展示，同时不影响用户体验。
2. 瀑布流布局：瀑布流布局的设计应该考虑到用户的浏览习惯，让用户能够轻松浏览大量图片，同时不会感到拥挤或混乱。布局应该简洁明了，突出重点。
3. 加载速度和响应速度：瀑布流展示图片需要大量的图片数据，因此加载速度和响应速度非常重要。应该采用高效的代码和缓存机制，确保界面能够快速加载和响应用户的操作。
4. 用户交互：瀑布流展示图片的界面中，用户交互是非常重要的。应该设计简单、直观的交互方式，让用户能够快速地浏览、筛选和返回上一页/页码等操作。
5. 颜色和字体：颜色和字体的设计应该考虑到整个界面的协调性和可读性。应该采用明亮、清晰的颜色和字体，确保用户能够轻松识别信息和进行操作。
6. 可访问性：瀑布流展示图片的界面应该考虑到可访问性，确保所有功能和信息都能够方便地访问和使用。应该采用易于理解和使用的导航和搜索功能，同时考虑到视力和听力有障碍的用户使用。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230526224721.png)

在实现瀑布流的过程中，步骤主要分为：

1. 初始化数据：首先需要从后端或缓存中获取瀑布流所需的图片数据，并将其存储在本地或缓存中。
2. 设置瀑布流容器：创建瀑布流容器，通常使用 HTML 元素，例如`<div>`或`<canvas>`。
3. 设置瀑布流布局：根据所需的瀑布流布局，例如流式布局或分块布局，使用 CSS 设置瀑布流容器的样式。
4. 加载图片：使用 JavaScript 异步加载图片，并将其添加到瀑布流容器中。可以使用 HTML5 的`<img>`标签或 Canvas 元素加载图片。
5. 设置瀑布流事件：设置事件监听器，例如点击事件或滚动事件，以便用户可以与瀑布流交互，对瀑布流布局大小进行调整。
6. 更新瀑布流：当图片数据更新或用户交互时，需要更新瀑布流的布局和样式。
7. 缓存图片：由于需要同时加载大量图片，提前对图片进行缓存可以大大减少系统加载实践，提高用户使用体验。
8. 优化性能：为了提高瀑布流的性能和用户体验，可以使用图片懒加载等设计，避免过多图片同时加载造成系统崩溃。

在进行主色调分析过程中，需要从后端进行图片的加载以及主色调分析，具体流程如下图所示。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230526224839.png)

### 影集展示界面

在设计影视资源展示界面的过程中，首先应该注意的是如何设计一个用户友好的交互界面，让用户可以轻松地浏览、搜索、播放视频。在交互设计中，需要考虑用户的使用习惯、心理需求等因素，以提高用户体验。综合用户日常使用视频网站的行为习惯与可能性，将影视资源的展示界面向主流视频媒体网站设计是一个相对正确可行的方向。

一方面，以封面图作为每个视频资源展示的核心内容，占据展示界面的主要位置，另一方面，完善的功能栏在下方作为辅助工具，帮助用户在使用过程中可以便捷的对指定视频资源进行高效的控制编辑等操作。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230526224913.png)

封面作为视频资源的重要展示因素，可以很大程度上说明视频的主要内容，部分视频网站采用用户上传封面的形式进行封面展示，这种方式能够准确的由用户控制封面展示内容但相对繁琐，本地系统一般会随机生成视频封面，十分便捷却容易出现封面混乱等问题，项目设计过程中支持用户自行上传或是随机生成封面，最大程度上满足用户核心需求，而随机生成封面的过程中涉及到对视频核心数据的获取与随机帧数的生成，大致流程如图所示。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230526224937.png)

除此以外，对于影视资源而言最重要的就是如何在应用内进行信息和流媒体内容的展示和播放，普通形式的播放器无论从使用便利性角度还是趣味性角度而言都相对薄弱，所以在设计播放器形式过程中项目引入拟物设计的形式，拟物设计可以让用户更好地理解和使用网页。它模拟了现实世界中的物品和操作方式，让用户更容易上手，从而提高用户满意度。同时拟物设计可以让网页看起来更加真实，用户可以更自然地操作和感知网页的内容和功能。这种设计方式能够提高用户的体验和忠诚度吗。另外拟物设计可以让用户感觉更受信任，因为它模拟了现实世界中的操作方式。这种设计方式可以增加用户的信任感。

综上所述，项目对播放器进行了拟物设计。以 Nintendo Switch（任天堂公司生产的掌上游戏机）为原型，进行视频播放器的设计。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230526225011.png)

## 项目后端功能设计

项目后端使用 SpringBoot 作为后端开发框架，使用 MyBatis 作为持久层开发框架，严格遵守 MVC 三层结构的设计过程。控制器层作为应用程序中用于处理用户输入和控制应用程序流程的部分，负责接收用户输入，调用模型层进行数据处理，并将处理结果传递给视图层进行显示。视图层作为应用程序中用于呈现用户界面的部分，负责将模型层中的数据呈现给用户。模型层则是应用程序中用于处理业务逻辑和数据处理的部分，负责处理数据的存储、检索、更新等操作。
在开发过程中，后端主要处理业务逻辑以及实际功能实现，并对外提供接口供前端调用。

这个过程中就包括，设计数据库结构和建立数据表，根据业务需求，设计并建立相应的数据表，用于存储多媒体资源的相关信息，例如视频、图片、电子书的名称、路径、大小、上传时间等。实现数据访问层，利用 Mybatis 框架实现数据访问层以进行对数据库的相关操作，包括定义数据访问接口和实现数据访问接口，用于对数据库进行增删改查等操作。实现业务逻辑层，在控制器层和数据访问层之间实现业务逻辑层，用于处理业务逻辑，例如主色调分析、分页处理等。实现控制器层，使用 Springboot 框架实现控制器层，处理前端的请求，调用业务逻辑层和数据访问层，返回处理结果给前端。编写测试用例：编写测试用例，对后端代码进行单元测试和集成测试，确保代码的正确性和可靠性。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20230527060848.png)

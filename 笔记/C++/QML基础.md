# QML基础

QML 是一种描述界面的语言，写在 .qml 文件中。.qml文件需要使用 QML 引擎才能加载出来。查看 [官方文档](https://doc.qt.io/qt-5/qmlreference.html) 获取更多详细内容。

一般情况下，本文档的语法以 EBNF 格式书写，用 pyside2 作为 QML 引擎。

## 加载方式

加载 QML 文件可以使用 *QQmlApplicationEngine*、*QQuickView* 等类型。基本的使用方法如下：

```python
from PySide2.QtCore import QUrl
from PySide2.QtGui import QGuiApplication
from PySide2.QtQml import QQmlApplicationEngine
from PySide2.QtQuick import QQuickView

app = QGuiApplication()

# QQmlApplicationEngine 加载方式
engine = QQmlApplicationEngine()
engine.load(QUrl.fromLocalFile("view.qml"))

# QQuickView 加载方式
view = QQuickView()
view.setSource(QUrl.fromLocalFile("view.qml"))
view.setResizeMode(QQuickView.SizeRootObjectToView)
view.show()

app.exec_()
```

用 QQuickView 方式加载时，会自动创建一个 Window，把 .qml 文件定义的组件包含到其中；

用 QQmlApplicationEngine 方式加载时，不会创建 Window，这就要求被加载的 .qml 文件根标签必须是 Window 类型，且 Window 的 visibla 属性设为 true 才会显示。

因此，使用 QQmlApplicationEngine 可以更方便地设置窗口的属性，比如标题、宽高等。

## 设置窗口图标

项目目录结构如下：

    project\
        images\
            icon.png
        main.qml
        main.py

main.qml 代码为

```qml
import QtQuick.Window 2.15

Window {
    // ......
}
```

在 main.py 中调用 QGuiApplication.setWindowIcon 方法设置图标：

```python
from PySide2.QtGui import QGuiApplication, QIcon
from PySide2.QtQml import QQmlApplicationEngine
from consts import ViewPaths

ICON_PATH:str = "images/icon.png"

if __name__ == '__main__':
    app: QGuiApplication = QGuiApplication()

    # 设置图标
    app.setWindowIcon(QIcon(ICON_PATH))

    engine: QQmlApplicationEngine = QQmlApplicationEngine()
    engine.load(ViewPaths.MAIN.value)
    app.exec_()
```

# 注释

单行：以 **//** 开头，放于行尾

多行：以 **/\*** 开头，**\*/** 结尾

```qml
Text {
    text: "Hello"    // 单行
    /*
        多
        行
     */
    font.pointSize: 24
}
```

# import语句

QML 文档开头至少包含一条 import 语句。import 语句有以下用法：

- 导入标记了版本号的内置命名空间
- 导入含类型定义的 QML 文档所在的相对路径，若路径相同则不需要 import 语句
- 导入 javascript 文件

举例：

- import QtQuick 2.0
- import "../privateComponents"
- import "somefile.js" as Script

使用 **as** 关键字重命名，避免命名冲突。

# 对象属性

## id 属性

每个对象都有 id 属性，且**必须以小写字母或下划线开头**。id 属性可以被作用域内的其他对象识别和引用。同一个作用域内，id 属性的值不能重复。

```qml
import QtQuick 2.0

Column {
    width: 200; height: 200

    TextInput { id: myTextInput; text: "Hello" }

    // 通过 id 引用对象
    Text { text: myTextInput.text }
}
```

## property 属性

property 属性可以把特定的值暴露给外部对象。

自定义 property 的声明语法：

```ebnf
["default"|"required"|"readonly"] "property" propertyType propertyName[":", value]

propertyName := lower_letter, {other_letter}
lower_letter := ?a-z?
other_letter := ?a-z0-9A-Z_?
```

声明自定义的 property 后，会隐式创建一个 signal，当所声明的 property 值改变时被发射。同时，与该 signal 连接的信号处理器(signal handler)会自动创建，信号处理器的名称为 **on\<PropertyName\>Changed**。

```qml
Rectangle {
    property color nextColor
    nextColor: "blue"
    onNextColorChanged: console.log("The next color will be: " + nextColor.toString())
}
```

> 注意
> 
> 内置的属性也存在对应的属性值修改信号和处理器
> ```qml
> Text {
>   text: "hello"
>   onTextChanged: {
>       console.log(text)
>   }
> }
> ```

### property 别名

可以对已有的 property 起别名，格式如下：

```ebnf
["default"] "property alias" name ":" alias_reference
```

注意，与自定义 property 不同的是，别名只有在组件完全初始化之后才能使用：

```qml
property alias widgetLabel: label

// 错误用法
widgetLabel.text: "Initial text"

// 错误用法
property alias widgetLabelText: widgetLabel.text

// 正确
Component.onCompleted: widgetLabel.text = "Alias completed Initialization"
```

## signal 属性

语法：

```ebnf
"signal" signalName["("[type parameterName{",",type parameterName}]")"]
```

示例：

```qml
import QtQuick 2.0

Item {
    signal clicked
    signal hovered()
    signal actionPerformed(string action, var actionResult)
}
```

signal 含有 connect 和 disconnect 方法，可以手动将信号与指定的函数相连。

```qml
import QtQuick 2.0

Item {
    id: root
    signal clicked

    Component.onCompleted: {
        // 连接
        root.clicked.connect(func1)
        root.clicked.connect(func2)

        // 发射信号，func1、func2 被调用
        root.clicked()
    }
    function func1(){}
    function func2(){}
}
```

## signal handler 属性

signal handler 是一种特别的函数属性。与它相连的信号被发射时，signal handler会被 QML 引擎调用。

**当添加一个 signal 后，相连的 signal handler 会自动创建**，名称为 on+SignalName。

```qml
// SquareButton.qml
import QtQuick 2.0

Rectangle {
    id: root
    anchors.fill: parent
    property int side: 500
    width: side; height: side

    signal activated(real xPosition, real yPosition)
    signal deactivated

    property alias showTxt:txt.text
    Text{
        id: txt
        text:"hello"
        font.pixelSize: 18
    }

    MouseArea {
        anchors.fill: parent
        onPressed: root.activated(mouse.x, mouse.y)
        onReleased: root.deactivated()
    }
}

// view.qml
// 两个文件在同一目录下，则不需导入路径
import QtQuick 2.0

SquareButton {
    onActivated: showTxt = "Activated at " + xPosition + "," + yPosition
    onDeactivated: showTxt = "Deactivated!"
}
```

## 函数属性

函数也可以作为对象的属性，添加函数的语法如下：

```ebnf
"function" functionName([parameterName{",", parameterName}]) "{" body "}"
```

示例：

```qml
import QtQuick 2.0
Rectangle {
    id: rect

    function calculateHeight() {
        return rect.width / 2;
    }
    width: 100
    height: calculateHeight()
}
```

## 固有的属性和信号处理器

固有属性(attached properties)和固有信号处理器(attached signal handlers)是一种能够让原本无法访问这些属性的对象也能访问的机制。

引用固有属性的语法：

```ebnf
AttachingType, ".", propertyName
AttachingType, ".", on<SignalName>
```

示例：

```qml
import QtQuick 2.0

ListView {
    width: 240; height: 320
    model: 3
    delegate: Rectangle {
        width: 100; height: 30
        // 引用固有属性
        color: ListView.isCurrentItem ? "red" : "yellow"
    }
}
```

**固有属性只能被特定的对象使用。**

## enumeration 属性

**enum** 关键字定义枚举值。

```qml
// MyText.qml
import QtQuick 2.0

Text {
    enum TextType {
        Normal,
        Heading
    }

    property int textType: MyText.TextType.Normal

    font.bold: textType == MyText.TextType.Heading
    font.pixelSize: textType == MyText.TextType.Heading ? 24 : 12
}
```

# 信号和处理器

QML 中提供了信号和处理器机制(signal and handler mechanism)，信号发射后，与该信号相连的处理器被调用。

某些情况下，需要在发射信号的对象之外访问该信号。为了能与任意对象的信号连接，QML 提供了 *Connections* 类型。用法如下：

```qml
import QtQuick 2.15
import QtQuick.Controls 2.15

Rectangle {
    id: rect
    width: 250; height: 250

    Button {
        id: button
        text: "Change color!"
    }

    // 访问 button 的信号
    Connections {
        target: button
        onClicked: {
            rect.color = Qt.rgba(Math.random(), Math.random(), Math.random(), 1);
        }
    }
}
```

# 属性绑定

对象属性的赋值分两种，一种是赋静态值，一种是属性绑定。属性绑定是指当前属性的值依赖于其他属性，当依赖项的值改变时，属性的值会自动更新。

> 注意
> 
> 属性赋值为静态值时，之前存在的属性绑定关系不会再生效

属性赋值时使用 JavaScript 表达式实现属性绑定：

```qml
import QtQuick 2.15

Rectangle {
    width: 200; height: 200

    Rectangle {
        width: 100
        // 绑定父对象高度
        height: parent.height
        color: "blue"
    }
}
```

JavaScript 代码中需要使用 Qt.binding 实现属性绑定：

```qml
import QtQuick 2.15

Rectangle {
    width: 200
    height: width * 2
    color: "blue"

    focus: true
    Keys.onSpacePressed: {
        // height = width * 3 没有绑定关系

        // 正确写法如下
        height = Qt.binding(function() { return width * 3 })
    }
    Keys.onUpPressed: width += 10
    Keys.onDownPressed: width -= 10
}
```

# QML 与 python 交互

在 python 代码中设置上下文属性后，该属性就可以在 QML 中访问。

通常的步骤如下：

1. 定义一个类，继承自 PySide2.QtCore.QObject 类
2. 用于交互的函数使用 PySide2.QtCore.Slot 修饰符；交互的属性使用 PySide2.QtCore.Property 构造，信号
3. 加载 QML 文件之前，设置上下文属性，传递定义的类的实例化对象
4. QML 中，直接使用上下文属性即可

简单的示例：

```python
# example.py
from PySide2.QtCore import QObject, Slot, QUrl, Property
from PySide2.QtGui import QGuiApplication, QColor
from PySide2.QtQuick import QQuickView


class Bridge(QObject):
    @Slot(str, result=None)
    def log(self, s):
        """用于交互的函数"""
        print(s)

    main_color: Property = Property(QColor, lambda self: "blue")
    """用于交互的属性"""

    outputSignal: Signal = Signal(str)


app = QGuiApplication()
view = QQuickView()

# 传递对象
py_bridge = Bridge()
view.rootContext().setContextProperty("bridge", py_bridge)

view.setSource(QUrl.fromLocalFile("view.qml"))
if view.status() != QQuickView.Error:
    view.show()
app.exec_()
```

```qml
// view.qml
import QtQuick 2.15

Rectangle {
    width: 300; height: 200;

    // 判断是否存在 bridge 对象
    property bool hasBridge: typeof bridge !== "undefined"

    Text {
        id: display
        anchors.centerIn: parent
        font.pointSize: 18
        text: hasBridge ? "press SPACE key" : "bridge is not found"

        // 获取 bridge 中的属性
        color: hasBridge ? bridge.main_color : "red"

        focus: true
        Keys.onSpacePressed: {
            if(hasBridge) {
                text = text == "hello" ? "hi" : "hello"
                // 调用 bridge 中的方法
                bridge.log(text)
            }
        }
    }

    Component.onCompleted: {
        // 连接 py 文件中的信号
        if(hasBridge)
            bridge.outputSignal.connect(msg => display.text = msg)
    }

}
```

# 基本数据类型

QML 语言支持的基本数据类型包括：

|    类型     | 说明 |
|    ---      | --- |
| bool        |Binary true/false value                                |
| double      |Number with a decimal point, stored in double precision|
| enumeration |Named enumeration value                                |
| int         |Whole number, e.g. 0, 10, or -20                       |
| list        |List of QML objects                                    |
| real        |Number with a decimal point                            |
| string      |Free form text string                                  |
| url         |Resource locator                                       |
| var         |Generic property type                                  |

QML 模块可以对基础类型进行扩展，比如 QtQuick 模块扩展了以下类型：

| 类型  | 说明 |
| ---   | --- |
| date  | Date value                                   |
| point | Value with x and y attributes                |
| rect  | Value with x, y, width and height attributes |
| size  | Value with width and height attributes       |

导入 QtQuick 模块才能使用上述数据类型。

# 控件样式

QtQuick.Controls 中提供的控件，可以设置一些自定义样式，参考 [官网](https://doc.qt.io/qt-5/qtquickcontrols2-customize.html)。默认样式可以在路径 $QTDIR/qml/QtQuick/Controls.2/控件.qml 找到。

# 控件重构

QtQuick.Controls 提供的控件都能在 QtQuick.Templates 中找到名字相同的隐藏模板(non-visual templates)类型。可以通过重写模板来构造控件。

如果直接重写控件，如下：

```qml
import QtQuick 2.12
import QtQuick.Controls 2.12

// 不推荐
Label {
    background: Rectangle {
        ...
    }
}
```

在 QML 中，上例通常会导致默认 background 和自定义 background 都被创建，只是自定义 background 覆盖了默认 background。

重写模板实现只创建自定义 background：

在 MLabel.qml 中写入：

```qml
import QtQuick 2.12
import QtQuick.Templates 2.12 as T

T.Label {
    id: control

    color: control.palette.windowText
    linkColor: control.palette.link

    padding: 6
    font.pointSize: 15

    property alias bgColor: bgRect.color
    background: Rectangle {
        id: bgRect
        visible: control.text
        border.color: control.color
        border.width: 2
    }
}
```

view.qml 中使用 MLabel
```qml
import QtQuick 2.15
import "mycontrols" // 导入对应的路径

Rectangle {
    width: 300; height: 200

    MLabel {
        anchors.centerIn: parent
        bgColor: "lightblue"
        text: "I'm the customized Label"
    }
}
```

# qmldir 与 identified modules

[官方说明](https://doc.qt.io/qt-5/qtqml-modules-qmldir.html)

qmldir 是一个纯文本文件，用于定义 QML 模块。把模块相关的 QML 文件、JavaScript 文件和插件放入单独的文件夹中，并在 qmldir 内声明。注意：没有 qmldir 文件也可以导入目录下的 qml 文件，此时导入的 qml 作为单独的组件存在。

小例子：

目录结构如下

```
project\
    mycomponents\
        MyRect_1_0.qml
        MyRect_1_1.qml
        qmldir
    view.qml
    example.py
```

qmldir 文件声明模块如下:

```txt
module MyComponents
# 模块名必须与路径名匹配

# 声明不同版本的 MyRect 对象类型
MyRect 1.0 MyRect_1_0.qml
MyRect 1.1 MyRect_1_1.qml
```

> 特别说明
> 
> qmldir 声明的**模块名必须与路径名匹配**，eg：relative.path.to.module

包含 qmldir 文件的模块为可识别模块(identified modules)，导入时可以指定版本号。基本的导入格式为 *import "path/to/module" [versioned]*。views.qml 写入下面的语句可以实现导入：

```qml
import QtQuick 2.15
import "mycomponents" 1.0

// 对应 MyRect_1_0.qml 组件
MyRect {}
```

可识别模块也可以像内置模块一样导入，格式为 *import path.to.module versioned*。这种导入方式需要在 QML 引擎中添加导入路径才能运行，路径为模块所在的父目录。

view.qml 修改如下：

```qml
import QtQuick.Window 2.15
import MyControls 1.0 // 像内置模块一样导入

Window {
    width: 300; height: 100
    visible: true

    // 对应 MyRect_1_0.qml 组件
    MLabel {}
}
```

example.py 文件内容如下：

```python
from PySide2.QtCore import QUrl
from PySide2.QtGui import QGuiApplication
from PySide2.QtQml import QQmlApplicationEngine
from os.path import dirname, abspath, join as path_join

app = QGuiApplication()
engine = QQmlApplicationEngine()

# 添加导入路径（模块的父级目录）
engine.addImportPath(dirname(abspath(__file__)))

engine.load(QUrl.fromLocalFile(
    path_join(dirname(abspath(__file__)),
              "view.qml")
))
app.exec_()
```

## 内部对象类型声明

声明模块内的对象类型，但不希望外部使用时，加上 **internal** 关键字。

语法格式：

```ebnf
"internal" TypeName File
```

例子：

```txt
internal MyPrivateType MyPrivateType.qml
```

## 插件声明

语法：

```ebnf
"plugin" Name [Path]
```

# qrc文件

与应用程序关联的资源可以定义在 **.qrc** 文件中，并以 xml 的形式列出。下面基于 pyside2 介绍 qrc 文件的使用方法。

[官方文档参考](https://doc.qt.io/qt-5/resources.html)

## 用法

在 **.qrc** 定义的资源，可以被 qml 和 py 文件使用。获取资源的格式：**qrc:///路径** 。

可以给资源文件起一个别名，在程序中使用别名来访问该资源文件。

**注意：.qrc 列出的路径是相对路径，资源文件必须放在与 .qrc 相同的路径或子目录中**

qml 中使用 qrc 实例演示：

1\. 创建 *example.qrc* 文件：
```qrc
<!DOCTYPE RCC>
<RCC version="1.0">
<qresource>
    <file>view.qml</file>
    <file alias="example_jpg">example.jpg</file>
</qresource>
</RCC>
```

2\. 创建 *view.qml* 文件，使用路径 **qrc:///example_jpg** 可以获取资源图片 example.jpg：

```qml
import QtQuick 2.0

Rectangle{
    anchors.fill: parent
    Image {
        source: "qrc:///example_jpg"
    }
}
```

3\. 使用 *pyside2-rcc* 工具生成 python 类并输出到 *rc_example.py* 文件，在命令行输入：

```cmd
pyside2-rcc example.qrc -o rc_example.py
```

4\. 在 py 文件中编写代码，导入 *rc_example*，显示 *view.qml* 界面：

```python
from PySide2.QtCore import QUrl
from PySide2.QtGui import QGuiApplication
from PySide2.QtQuick import QQuickView

# 导入资源
import rc_example

app = QGuiApplication()

view = QQuickView()
# 使用 qrc:///路径 获取资源
view.setSource(QUrl("qrc:///view.qml"))
view.show()

app.exec_()
```

完成 (∩_∩)

## prefix 属性

qresource 标签的 **prefix** 属性指定了所有文件的路径前缀，如：

```qrc
<qresource prefix="/myresources">
    <file alias="cut-img.png">images/cut.png</file>
</qresource>
```

此时程序中访问路径为 **qrc:///myresources/cut-img.png**

## lang 属性

在qresource 标签添加 lang 属性，可以为不同地区的用户选择合适的文件，比如翻译文件或图标等。示例：

```qrc
<!DOCTYPE RCC>
<RCC version="1.0">
<qresource>
    <file alias="example">example.jpg</file>
</qresource>
<qresource lang="zh">
    <file alias="example">example_zh.jpg</file>
</qresource>
</RCC>
```

上例中，如果中国地区的用户访问 **qrc:///example**，实际上得到的是 **example_zh.jpg**。

# 翻译文件

直接看例子。

创建 view.qml，需要翻译的文本使用 qsTr 函数：

```qml
import QtQuick 2.0

Text { text: qsTr("hello") }
```

打开 Qt命令行工具，输入命令生成 ts 文件：

```cmd
lupdate view.qml -ts view_zh.ts
```

> **补充**
> 
> 有多个 qml 文件需要翻译时，可以整合到一个 ts 文件中：
> 
> ```cmd
> lupdate view.qml view1.qml -ts app_zh.ts
> ```

打开 Linguist(Qt 语言家)，编辑 view_zh.ts 文件，将 hello 翻译为 你好，然后 另外发布为 view_zh.qm 文件。此时的目录结构如下：

```
project\
    view.qml
    view_zh.ts
    view_zh.qm
```

在 project 文件夹下新建 example.py 文件，加载 view_zh.qm：

```python
from PySide2.QtCore import QUrl, QTranslator, QLocale
from PySide2.QtGui import QGuiApplication
from os.path import dirname, abspath, join as path_join

from PySide2.QtQuick import QQuickView

PRO_DIR: str = dirname(abspath(__file__))
"""项目的路径"""

app = QGuiApplication()

# 加载翻译文件
tr = QTranslator()
if tr.load(QLocale(QLocale.Chinese), "view", "_", PRO_DIR):
    print(tr.filePath())  # project/view_zh.qm
    app.installTranslator(tr)

view = QQuickView()
view.setResizeMode(QQuickView.SizeRootObjectToView)
view.setSource(QUrl.fromLocalFile(path_join(PRO_DIR, "view.qml")))
view.show()

app.exec_()
```

运行后看到的文本是 你好，而不是 hello，翻译成功。

# 常用对象、属性、模块

## 对象

AnimatedImage  播放 GIF 等包含一系列帧的图像动画

TabView        选项页视图

ExclusiveGroup 互斥选项组

BusyIndicator  忙指示器

Calendar       日历

## 属性

transform   指定旋转、缩放、平移变化。

states      对象的各种状态

transitions 对象状态改变时的过渡动画

## 模块

QtGraphicalEffects 图形特效

QtQuick.Layouts    布局，会调整子对象的尺寸以适配界面

QtQuick.Dialogs    对话框

## 布局对象

Row、Column、Grid、Flow，不会调整子对象尺寸

QML 还提供了 anchor 来进行布局。

## 事件对象

MouseArea 鼠标事件、Keys 键盘事件

## 动画

PropertyAnimation 属性动画、NumberAnimation、ColorAnimation、RotationAnimation

ParallelAnimation 动画组，其内的动画同时运行；SequentialAnimation 动画组，其内的动画按顺序运行

Behavior 行为对象，当指定的属性值改变时，在 Behavior 内的动画被触发。eg：

```qml
import QtQuick 2.15

Rectangle {
    id: rect
    width: 100; height: 100
    color: "blue"

    Behavior on width {
        NumberAnimation { duration: 1000 }
    }

    MouseArea {
        anchors.fill: parent
        onClicked: rect.width += 50
    }
}
```

Animator 类型能直接作用于 Qt Quick 的场景图形(scene graph)系统，而 Animation 类型是基于对象和属性的。当 UI 线程阻塞时，Animator 仍然能实现动画效果。Animator 不能直接使用，要使用其子类。

## Loader

设置 source 或 sourceComponents 属性动态加载组件。

```qml
import QtQuick 2.0

 Item {
     width: 100; height: 100

     Component {
         id: redSquare

         Rectangle {
             color: "red"
             width: 10
             height: 10
         }
     }

     Loader { sourceComponent: redSquare }
     Loader { id: load; x: 20 }

     Component.onCompleted: {
         load.sourceComponent = Qt.binding(() => redSquare)
     }
 }
 ```

 ## Repeater

 重复器用于创建大量相似的元素成员。

 ```qml
 import QtQuick 2.15

Rectangle {
    width: 50; height: 50
    color: "blue"

    Grid {
        anchors.fill: parent
        spacing: 5
        Repeater {
            model: 10
            Rectangle {
                width: 10; height: 10
                color: "white"
            }
        }
    }
}
```
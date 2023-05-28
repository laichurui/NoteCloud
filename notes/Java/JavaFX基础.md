# 简介

JavaFX 是基于 Java 的一套图形界面工具包，用来开发桌面和手机端的 GUI 应用。JavaFX 的前身是 Sun Microsystem 公司的一个名为 F3 的项目，最初采用的语言名为 JavaFX Script。2011年由 Oracle 公司全部用 Java 重写并发布为 JavaFX2.0。同年11月，Oracle 宣布把 JavaFX 捐赠给开源社区，并由 OpenJDK 接管，成立 OpenJFX 项目。到 JavaSE 7.06 和 JavaFX 2.2，JavaFX 实时库开始成为 Oracle 的 Java SE 的一部分，并随同发布(lib\jfxrt.jar)。而从 Java 11 开始，JavaFX 从 Java SE 分离出来，成为一个独立的模块，使用时需要另行下载 JavaFX SDK。

本文档使用到以下环境：

- IDEA 2021.1.3
- Maven 3.6.3( IDEA 内置 )
- JDK 16.0.1
- Windows 10

# 参考网站

指南：http://tutorials.jenkov.com/javafx/index.html

FXML 指南：https://openjfx.cn/javadoc/16/javafx.fxml/javafx/fxml/doc-files/introduction_to_fxml.html

社区文档：https://fxdocs.github.io/docs/html5/

官网：https://openjfx.io/

中文官网：https://openjfx.cn/

JavaFX 中文资料：http://www.javafxchina.net/blog/docs/

Nashorn js 引擎：https://github.com/openjdk/nashorn

旧版文档：https://docs.oracle.com/javase/8/javase-clienttechnologies.htm

# 创建 JavaFX 项目

打开 IDEA，新建一个 Maven 项目。接着在 pom.xml 中添加 JavaFX 的依赖项和相关的运行插件，分别是 maven compiler plugin 和 javafx-controls 包，参考下面的配置代码：

```xml
<properties>
    <main.class>com.javafx.demo.HelloWorld</main.class>
</properties>

<build>
    <plugins>
        <!-- https://mvnrepository.com/artifact/org.apache.maven.plugins/maven-compiler-plugin -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.1</version>
            <configuration>
                <release>${maven.compiler.target}</release>
            </configuration>
        </plugin>
    </plugins>
</build>

<dependencies>
    <!-- https://mvnrepository.com/artifact/org.openjfx/javafx-controls -->
    <dependency>
        <groupId>org.openjfx</groupId>
        <artifactId>javafx-controls</artifactId>
        <version>16</version>
    </dependency>
</dependencies>
```

非模块项目可以再添加 javafx maven plugin 以方便运行项目：

```xml
<properties>
    <javafx.mainClass>HelloWorld/${main.class}</javafx.mainClass>
</properties>

<build>
    <!-- https://mvnrepository.com/artifact/org.openjfx/javafx-maven-plugin -->
    <!-- 模块化项目可以去掉 javafx maven plugin-->
    <!-- 方便运行 javafx 的插件 -->
    <plugins>
        <plugin>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-maven-plugin</artifactId>
            <version>0.0.6</version>
        </plugin>
    </plugins>
</build>
```

应用 maven 的修改，依赖包就下载到本地仓库了。

新建一个基于 JavaFX 的类：

```java
package com.javafx.demo;

import javafx.application.Application;
import javafx.stage.Stage;

public class HelloWorld extends Application {
    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("hello world");
        primaryStage.show();
    }
}
```

HelloWorld 类简单地显示一个窗口，模块项目直接运行 HelloWorld 类即可，非模块项目可以通过 maven 插件来运行项目：打开 IDEA 侧边栏的 maven 面板，找到 [project]->Plugins->javafx->javafx:run，双击即可运行。

## 调试（针对非模块项目）

要调试项目，还需要在 javafx maven plugin 中添加几个配置。修改 pom.xml，让 javafx-maven-plugin 可以调试项目：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-maven-plugin</artifactId>
            <version>0.0.6</version>
            <executions>
                <!-- 调试项目的配置 -->
                <!-- 执行 mvn clean javafx:run@debug -->
                <execution>
                    <id>debug</id>
                    <configuration>
                        <options>
                            <option>-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=*:8000</option>
                        </options>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

应用修改后，输入 maven 命令：

```txt
mvn clean javafx:run@debug
```

当控制台出现类似以下的信息时：

```txt
Listening for transport dt_socket at address: 8000 Attach debugger
```

鼠标点击 Attach debugger，就进入了调试状态。

> 执行 mvn javafx:run 依然是直接运行项目。

## 打包

接下来介绍打包 jar 的流程。这里用到两个插件：maven dependency plugin 和 maven jar plugin。打开 pom.xml，在 project->build->plugins 节点下新增：

```xml
<!-- https://mvnrepository.com/artifact/org.apache.maven.plugins/maven-dependency-plugin -->
<!-- 复制依赖包 -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-dependency-plugin</artifactId>
    <version>3.2.0</version>
    <executions>
        <execution>
            <id>copy-dependencies</id>
            <phase>package</phase>
            <goals>
                <goal>copy-dependencies</goal>
            </goals>
            <configuration>
                <outputDirectory>${project.build.directory}/lib</outputDirectory>
                <overWriteReleases>false</overWriteReleases>
                <overWriteSnapshots>false</overWriteSnapshots>
                <overWriteIfNewer>true</overWriteIfNewer>
            </configuration>
        </execution>
    </executions>
</plugin>
<!-- https://mvnrepository.com/artifact/org.apache.maven.plugins/maven-jar-plugin -->
<!-- 打包jar文件时，配置manifest文件 -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.2.0</version>
    <configuration>
        <classesDirectory>${project.build.directory}/classes/</classesDirectory>
        <archive>
            <manifest>
                <!-- 主函数的入口 -->
                <mainClass>${main.class}</mainClass>
                <useUniqueVersions>false</useUniqueVersions>
                <addClasspath>true</addClasspath>
                <classpathPrefix>lib/</classpathPrefix>
            </manifest>
            <manifestEntries>
                <Class-Path>.</Class-Path>
            </manifestEntries>
        </archive>
    </configuration>
</plugin>
```

打开 IDEA 侧边栏的 maven 面板，双击 [project]->Lifecycle->package，等待打包结束。之后在 target 目录下看到打包后的 jar 文件。打开命令行工具，进入 target 目录，执行以下命令：

```cmd
java -jar --module-path lib/ --add-modules javafx.controls HelloWorld-1.0-SNAPSHOT.jar
```

如果一切顺利，这时就能成功运行 jar 包了。我们也可以在 target 目录下新建一个 vbs 脚本来启动 jar 包，这样就不用每次都重复输入命令，vbs 的内容参考下面的示例：

```vbs
set shell = createobject("wscript.shell")
shell.run "cmd /c java -jar --module-path lib/ --add-modules javafx.controls HelloWorld-1.0-SNAPSHOT.jar", 0, FALSE
```

launch4j-maven-plugin 可以把 jar 再打包成 exe 文件：

```xml
<!-- https://mvnrepository.com/artifact/com.akathist.maven.plugins.launch4j/launch4j-maven-plugin -->
<!-- 把 jar 包打成 exe -->
<plugin>
    <groupId>com.akathist.maven.plugins.launch4j</groupId>
    <artifactId>launch4j-maven-plugin</artifactId>
    <version>2.1.1</version>
    <executions>
        <execution>
            <id>l4j-gui</id>
            <phase>package</phase>
            <goals>
                <goal>launch4j</goal>
            </goals>
            <configuration>
                <headerType>gui</headerType>
                <jar>${project.build.directory}/${project.artifactId}-${project.version}.jar</jar>
                <errTitle>App Err</errTitle>
                <classPath>
                    <mainClass>${main.class}</mainClass>
                </classPath>
                <jre>
                    <minVersion>16</minVersion>
                    <opts>
                        <opt>--module-path lib/</opt>
                        <opt>--add-modules javafx.controls</opt>
                    </opts>
                </jre>
            </configuration>
        </execution>
    </executions>
</plugin>
```

## 完整的 pom.xml 参考

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.javafx.demo</groupId>
    <artifactId>HelloWorld</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>16</maven.compiler.source>
        <maven.compiler.target>16</maven.compiler.target>
        <main.class>com.javafx.demo.HelloWorld</main.class>
        <javafx.mainClass>HelloWorld/${main.class}</javafx.mainClass>
    </properties>

    <build>
        <plugins>
            <!-- https://mvnrepository.com/artifact/org.apache.maven.plugins/maven-compiler-plugin -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <release>${maven.compiler.target}</release>
                </configuration>
            </plugin>
            <!-- https://mvnrepository.com/artifact/org.openjfx/javafx-maven-plugin -->
            <!-- 模块化项目可以去掉 javafx maven plugin-->
            <!-- 方便运行 javafx 的插件 -->
            <plugin>
                <groupId>org.openjfx</groupId>
                <artifactId>javafx-maven-plugin</artifactId>
                <version>0.0.6</version>
                <configuration>
                    <options>
                        <!-- 解决控制台输出乱码 -->
                        <option>-Dfile.encoding=UTF-8</option>
                    </options>
                </configuration>
                <executions>
                    <!-- 调试项目所需的配置 -->
                    <!-- 执行 mvn clean javafx:run@debug -->
                    <execution>
                        <id>debug</id>
                        <configuration>
                            <options>
                                <option>-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=*:8000</option>
                            </options>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
            <!-- https://mvnrepository.com/artifact/org.apache.maven.plugins/maven-dependency-plugin -->
            <!-- 打包阶段复制依赖包 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-dependency-plugin</artifactId>
                <version>3.2.0</version>
                <executions>
                    <execution>
                        <id>copy-dependencies</id>
                        <phase>package</phase>
                        <goals>
                            <goal>copy-dependencies</goal>
                        </goals>
                        <configuration>
                            <outputDirectory>${project.build.directory}/lib</outputDirectory>
                            <overWriteReleases>false</overWriteReleases>
                            <overWriteSnapshots>false</overWriteSnapshots>
                            <overWriteIfNewer>true</overWriteIfNewer>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
            <!-- https://mvnrepository.com/artifact/org.apache.maven.plugins/maven-jar-plugin -->
            <!-- 打包jar文件时，配置manifest文件 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.2.0</version>
                <configuration>
                    <classesDirectory>${project.build.directory}/classes/</classesDirectory>
                    <archive>
                        <manifest>
                            <!-- 主函数的入口 -->
                            <mainClass>${main.class}</mainClass>
                            <useUniqueVersions>false</useUniqueVersions>
                            <addClasspath>true</addClasspath>
                            <classpathPrefix>lib/</classpathPrefix>
                        </manifest>
                        <manifestEntries>
                            <Class-Path>.</Class-Path>
                        </manifestEntries>
                    </archive>
                </configuration>
            </plugin>
            <!-- https://mvnrepository.com/artifact/com.akathist.maven.plugins.launch4j/launch4j-maven-plugin -->
            <!-- 把 jar 包打成 exe -->
            <plugin>
                <groupId>com.akathist.maven.plugins.launch4j</groupId>
                <artifactId>launch4j-maven-plugin</artifactId>
                <version>2.1.1</version>
                <executions>
                    <execution>
                        <id>l4j-gui</id>
                        <phase>package</phase>
                        <goals>
                            <goal>launch4j</goal>
                        </goals>
                        <configuration>
                            <headerType>gui</headerType>
                            <jar>${project.build.directory}/${project.artifactId}-${project.version}.jar</jar>
                            <errTitle>App Err</errTitle>
                            <classPath>
                                <mainClass>${main.class}</mainClass>
                            </classPath>
                            <jre>
                                <minVersion>16</minVersion>
                                <opts>
                                    <opt>--module-path lib/</opt>
                                    <opt>--add-modules javafx.controls</opt>
                                </opts>
                            </jre>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

    <dependencies>
        <!-- https://mvnrepository.com/artifact/org.openjfx/javafx-controls -->
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-controls</artifactId>
            <version>16</version>
        </dependency>
    </dependencies>

</project>
```

# 概述

JavaFX 应用由一个或多个窗口组成，在 JavaFX 中一个窗口对应一个 Stage 类。Stage 仅能包含一个 Scene（场景）实例，但是可以通过代码改变 Scene 实例，从而实现同个窗口下切换不同场景。Scene 类是可视组件的容器，所有按钮、文本框、布局等组件都要直接或间接放置在 Scene 上。通常，窗口的基本组成如下：

```
------------------------
| Stage 舞台/窗口
|    |------------------
|    | Scene 场景
|    |    |-------------
|    |    | Pane 布局组件（可嵌套）
|    |    |    |--------
|    |    |    | controls 控件（可嵌套）
```

## Scene Graph/场景图

附加到场景的所有控件、布局等的总对象图称为场景图。

## Nodes/节点

场景图中的可视组件称为节点（Nodes），节点对象都继承自 javafx.scene.Node 类。有两种类型的节点：

- 分支节点，可包含其他节点
- 叶子节点，不能包含其他节点

## Controls/控件

JavaFX 有以下控件：

- Accordion
- Button
- CheckBox
- ChoiceBox
- ColorPicker
- ComboBox
- DatePicker
- Label
- ListView
- Menu
- MenuBar
- PasswordField
- ProgressBar
- RadioButton
- Slider
- Spinner
- SplitMenuButton
- SplitPane
- TableView
- TabPane
- TextArea
- TextField
- TitledPane
- ToggleButton
- ToolBar
- TreeTableView
- TreeView

## Layouts/布局

布局组件都继承自 javafx.scene.Parent。JavaFX 包含以下布局：

- AnchorPane
- BorderPane
- FlowPane
- Group
- Region
- Pane
- HBox
- VBox
- StackPane
- TilePane
- GridPane
- TextFlow

## Charts/图表

JavaFX 有一些内置的图表组件：

- AreaChart
- BarChart
- BubbleChart
- LineChart
- PieChart
- ScatterChart
- StackedAreaChart
- StackedBarChart

# Application

JavaFX 应用程序的入口类必须继承 javafx.application.Application 类并重写 start() 方法，然后在 main() 方法中调用 Application.launch() 启动程序。JavaFX 按以下顺序执行程序：

1. 启动 JavaFX runtime
2. 构造 Application 类的实例
3. 调用 init() 方法
4. 调用 start() 方法
5. 等待，出现下列情况之一才进入下一步:

- 调用 Platform.exit() 方法
- 所有窗口都关闭并且 Platform.isImplicitExit() 为 true

6. 调用 stop() 方法

# Stage

Stage 就是 JavaFX 的窗口，显示窗口有两种方式：

- show()
- showAndWait() 显示窗口，在调用处阻塞进程，直到窗口关闭

```java
    public void start(Stage primaryStage) {
        primaryStage.show();

        Stage stage = new Stage();
        stage.setTitle("no.2");
        stage.showAndWait(); // 显示并阻塞进程

        // stage 关闭后才会执行下面的语句
        primaryStage.setTitle("no.1");
    }
```

上面的程序运行后，看到两个窗口，一个没有标题，另一个标题是 no.2，把 no.2 窗口关闭后，才会执行下一条语句，此时看到剩下的窗口标题显示 no.1。

Stage.initModality() 方法设置是否以模态窗口显示

Stage.initOwner() 方法设置父窗口

Stage.setOn*() 方法监听窗口显示、隐藏、关闭等事件

# Node

javafx.scene.Node 是所有组件的父类，Node 包含在边界框中，一个 Node 有 3 个边界框：

- layoutBounds 节点在自身坐标空间的边界，不含效果、裁剪、变换
- boundsInLocal 节点在自身坐标空间的边界，含效果、裁剪，不含变换
- boundsInParent 在父节点坐标空间的边界，含效果、裁剪、变换

通过 Node.setUserData() 方法可以添加用户数据，把对象实例保存到节点中。

# FXML

FXML 一种是 XML 格式的文本，可以把场景图以类似 HTML 标签的形式进行描述。界面写在 .fxml 文件，事件处理写在 .java 文件，从而实现前后端分离。下面看一个小例子：

```xml
<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.scene.layout.StackPane?>
<?import javafx.scene.control.Label?>

<StackPane prefWidth="500" prefHeight="400">
    <Label text="hello world"/>
</StackPane>
```

上面的代码相当于创建了根元素为 StackPane 的组件树。

## 加载

编写好 .fxml 后，需要在 java 代码中加载才能使用。在 .fxml 文件的相同目录下新建一个 .java 文件，参考以下代码来加载 FXML 文件中的 StackPane 对象：

```java
    @Override
    public void start(Stage primaryStage) throws IOException {
        URL url = getClass().getResource("FXMLDemo.fxml");
        FXMLLoader loader = new FXMLLoader(url);
        primaryStage.setScene(new Scene(loader.load()));
        primaryStage.show();
    }
```

通常都是通过 FXMLLoader 类来加载 FXML 文件，加载后得到一个组件对象。

> 注意
> 要使用 FXMLLoader 类需要添加相关的依赖包，在 pom.xml 文件的 project->dependencies 标签下导入依赖项：
>
> ```xml
> <!-- https://mvnrepository.com/artifact/org.openjfx/javafx-fxml -->
> <dependency>
>     <groupId>org.openjfx</groupId>
>     <artifactId>javafx-fxml</artifactId>
>     <version>16</version>
> </dependency>
> ```

## 标签

FXML 的标签与 Java 类对应，标签名就是类名，使用时需要导入对应的包。比如：

```xml
<?import javafx.scene.layout.StackPane?>
<StackPane/>
```

> 注意
> FXML 中使用标签相当于调用了类的无参构造函数

根标签通常是布局组件，也可以使用 fx:root 作为根标签。使用了 fx:root 的 FXML 文件，需要在加载时调用 FXMLLoader.setRoot() 指定 root 节点。

通常，大写开头的标签是组件标签，小写开头的是属性标签。

## 属性

标签都包含一些属性，属性赋值可以是：

- 在标签内赋值
- 作为子标签赋值

```xml
<!-- 在标签内设置宽度、高度属性值 -->
<VBox prefHeight="400" prefWidth="600">
    <!-- 子标签中对 VBox 的属性赋值 -->
    <spacing>50</spacing>
    <alignment>CENTER</alignment>

    <Label text="hello"/>
    <Label>world</Label>
</VBox>
```

FXML 的**组件标签**中，其子标签的作用是对属性的赋值。如果子标签不是属性之一，就会被当做**默认属性**。比如上例中，Label 不是 VBox 的属性之一，因此被当成 VBox 的默认属性 children 的值，等价于：

```xml
<!-- 在标签内设置宽度、高度属性值 -->
<VBox prefHeight="400" prefWidth="600">
    <!-- 子标签中对 VBox 的属性赋值 -->
    <spacing>50</spacing>
    <alignment>CENTER</alignment>

    <children>
        <Label text="hello"/>
        <Label>world</Label>
    </children>
</VBox>
```

## 脚本

与 HTML 类似，FXML 也能嵌入脚本语言，实现交互操作。有哪些脚本语言能用呢？这取决于 Java 中的脚本引擎，执行下面的代码打印现有的引擎：

```java
ScriptEngineManager m = new ScriptEngineManager();
List<ScriptEngineFactory> l = m.getEngineFactories();
for (ScriptEngineFactory f : l) {
    System.out.println(f.getEngineName());
}
```

我的期望是能够在 FXML 中使用 javascript 作为脚本语言。但是，从 JDK 15 开始已经移除了 Nashorn JavaScript 引擎，Nashorn 现在是一个独立的模块。解决方法就是导入 nashorn-core 依赖项把 Nashorn 引擎添加到项目中：

```xml
<!-- https://mvnrepository.com/artifact/org.openjdk.nashorn/nashorn-core -->
<dependency>
    <groupId>org.openjdk.nashorn</groupId>
    <artifactId>nashorn-core</artifactId>
    <version>15.3</version>
</dependency>
```

导入后就可以解析 js 脚本了。另外，对于模块项目，还要在 module-info.java 中添加模块请求 requires org.openjdk.nashorn。

> 除了 Nashorn 外，还有其他基于 Java 开发的脚本引擎。GraalVM 的 js 引擎目前无法在多个 context 间共享数据，不适用与 JavaFX 项目，可能在之后的 21.3 版本会支持，现在还不能作为替代方案。
> 
> 参见 https://github.com/oracle/graal/issues/631

嵌入脚本代码，先在 xml 文档声明之后加入脚本语言声明：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?language javascript?>
```

然后，根标签添加 fx 命名空间，代码写在 fx:script 标签内：

```xml
<VBox xmlns:fx="http://javafx.com/fxml">
    <fx:script>
        function handler() {
            java.lang.System.out.println("hi");
            label1.text = "changed by js";
        }
    </fx:script>

    <Label fx:id="label1" text="get me by fx:id"/>
</VBox>
```

设置 source 属性导入外部 js 文件：

```xml
<fx:script source="example.js" charset="UTF-8"/>
```

## 样式

组件的样式有两种设置方式：

- style 属性
- 引入 css 文件，由 css 选择器定义样式

```xml
<?import java.net.URL?>
<VBox prefHeight="400" prefWidth="600"
      spacing="50" alignment="CENTER">
    <stylesheets>
        <URL value="@demo.css"/>
        <!-- <URL value="@../../../test/exam.css"/> -->
    </stylesheets>

    <Label text="hello">
        <style>
            -fx-padding: 3;
            -fx-border-color: black;
            -fx-border-width: 3;
        </style>
    </Label>

    <Label styleClass="target" text="world"/>
</VBox>
```

```css
/* demo.css */
.target {
    -fx-padding: 3;
    -fx-border-color: red;
    -fx-border-width: 3;
}
```

## 控制器

## 自定义标签

前面提到，标签与类是对应的，要自定义标签，就需要定义一个 Java 类，为方便起见，可以从 JavaFx 组件继承后再做修改。

# 常用 Pane 介绍

StackPane ->
栈布局，子控件堆叠排列，
eg: stackpane.getChildren().add

BorderPane ->
控件放置在 top, left, right, bottom, center 中，
eg: borderPane.setTop 等方法

GridPane ->
行列分隔的网格布局，
eg: gridpane.add(new Button(), 1, 0)

FlowPane ->
流式布局，
eg: flow.getChildren().add

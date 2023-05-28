Java基础

本文档使用以下开发环境：

- Java SE 16.0.1
- Eclipse 2020-12
- Intellij IDEA 2020.3.2
- Windows 10 20H

参考：
- [JDK 15 API](https://docs.oracle.com/en/java/javase/15/docs/api/index.html)

- [On Java 8](https://lingcoder.github.io/OnJava8/#/)

- Java 编程思想第四版

# 前言

Java 程序写在 .java 文件中，每个 .java 文件至少包含 1 个 public 类或接口，且 **public 修饰的 类名与文件名必须一样**。

语句以 **;** 作为结束符；区分大小写。

char 用单引号包围，String 用双引号包围。

在网页中运行的 Java 程序称为 applet。

所有代码都写在类中，包括 main 函数。main 函数是整个应用程序的入口，规范写法为：

```java
public class Example {
	public static void main(String[] args) {
		// do something
	}
}
```

## 命名规范

| 修饰		| 示例				|
| ---		| ---			   |
| 类	    | ClassName		    |
| 实例对象	| objectName		|
| 方法		| methodName		|
| 包		| com.example.test	|

## 安装教程（基于Windows）

1 到官网 (https://docs.oracle.com/en/java/javase/index.html) 下载最新版本安装包，运行安装程序

2 安装完成后，要检查一下环境变量。打开命令行，输入 <code>java -version</code>，如果打印出 java 版本号，那么安装成功。否则，需要自己添加环境变量：

| 环境变量   | 添加值                           |
| ---       | ---                              |
| JAVA_HOME | C:\Program Files\Java\jdk-15.0.1 |
| Path      | %JAVA_HOME%\bin                  |

# 入门

## 注释

单行注释使用 **/\/** ，块级注释使用 **/\*** 开头 **\*/** 结尾。

要生成文档注释，使用 **/\*\*** 开头 **\*/** 结尾。

```java
// 单行注释

/*
 * 这是
 * 块注释
 */

/**
 * 这是文档注释，会显示在函数提示框中
 * 
 * @param word 单词
 */
public void say(String word) {
	System.out.println(word);
}
```

## javadoc

[JDK 15 doc标签](https://docs.oracle.com/en/java/javase/15/docs/specs/javadoc/doc-comment-spec.html)

*文档注释* 通常写在类、方法、字段之前，支持 HTML 代码。在文档注释中也可以包含一些 javadoc 标记以实现特殊功能。

| 通用标记          | 实例          | 功能     |
| ---              | ---           | ---      |
| @since *text*    | @since 15.0.1 | 始于     |
| @author *name*   | @author LCR   | 作者     |
| @version *text*  | @version test | 版本描述 |

其他标记：

{@link module/package.class#member label} 链接到类或方法或属性

{@literal text} 不对 text 的内容进行解析

{@inheritDoc} 从父类或接口中继承(复制)文档注释

{@value package.class#field} 显示常量值

{@value} 不带参数，显示所标记的 static 字段值

### Eclipse 下生成帮助文档

Project -> Generate Javadoc...

选择需要生成 HTML 的包以及级别(public、private、protect)，运行后会生成 doc 文件夹，其下的 index.html 就是 javadoc 的索引页面。

## 8 种基本数据类型

| 类型    | 存储大小 | 表示范围 									|
| ---	  | ---	    | ---										  |
| int     | 4 bytes | [-2147483648, 2147483647] 				  |
| short   | 2 bytes | [-32768, 32767]			  				  |
| long	  | 8 bytes | [-9223372036854775808, 9223372036854775807] |
| byte	  | 1 bytes | [-128, 127]								  |
| ---  	  | ---	    | ---										  |
| float   | 4 bytes | 						 					  |
| double  | 8 bytes | 						  					  |
| ---  	  | ---	    | ---										  |
| char 	  |  	    | 											  |
| ---  	  | ---	    | ---										  |
| boolean |  	    | false, true								  |

long 型数值有一个后缀 L 或 l (如 10000000L)。

float 型数值有一个后缀 F 或 f (如 3.14F)。浮点数都遵循 IEEE 754 规范。

三个特殊的双精度浮点数常量：
1. 正无穷大 Double.POSITIVE_INFINITY
2. 负无穷大 Double.NEGATIVE_INFINITY
3. 非数字   Double.NaN

检测非数值的方式是：

```java
if (Double.isNaN(x))
```

**Java 中没有任何无符号形式的整数(int、long、short、byte)。**

## 继承、重写、抽象类

通过 extends 关键字可以定义继承关系

重载 指多个方法使用同一个名称，但参数声明部分不同

重写是在子类中创建一个与父类相同的方法

抽象类用 abstract 修饰，不能实例化，必须继承才能使用

## 访问修饰符

default 只能在同一个包内访问。不写修饰符时，相当于 default。

private 修饰的类、方法、属性只能被本类的对象所访问。

protected 修饰的类、方法、属性只能被本类、本包、不同包的子类所访问。注意，子类的子类如果在不同包下是无法访问的。

public 修饰的类、方法、属性、可以跨类和跨包访问。

## 可变参数

可变参数的作用是接收多个同类型参数，必须定义在参数列表的最后。在参数类型之后写入 **...** 即可声明为可变参数，可变参数当作数组处理。

```java
package com.project.example;

public class Example {
	public static void main(String[] args) {
		say("hello", "world");
	}

	public static void say(String... words) {
		for (String word : words)
			System.out.println(word);
	}
}
```

## serialVersionUID

要认识 serialVersionUID，需要先了解序列化和反序列化。序列化可以把一个类的实例化对象转化为二进制字节流，保存各个属性的信息；反序列化是把二进制字节流转化为对应类的实例化对象。

serialVersionUID 与序列化操作有关，通过判断**当前类**的 serialVersionUID 来验证**版本一致**。序列化操作时会把当前类的 serialVersionUID 写入到序列化文件中，当反序列化时系统会自动检测文件中的 serialVersionUID，判断它是否与当前类中的serialVersionUID 一致。

实现 Serializable 接口的类需要显示定义 serialVersionUID，Eclipse 中有两种添加方式：

* Add default serial version ID (1L)
* Add generated serial version ID

## 文件读取

Class.getResource()与Class.getResourceAsStream()方法

## 方法引用（::）

参考：https://docs.oracle.com/javase/tutorial/java/javaOO/methodreferences.html

把方法作为参数传递时，可以使用 lambda 表达式。而从 JDK 8 开始，有了方法引用的概念，使用方法名就能引用已存在的方法，在参数传递时可以起到作用。

```java
public class Test {
    public static void main(String[] args) {
        List<String> show = Arrays.asList("hello", "world");
        show.forEach(System.out::println);
    }
}
```

方法引用有四种方式：
- 引用静态方法 ClassName::staticMethodName
- 引用实例方法 object::methodName
- 引用构造函数 ClassName::new
- 引用特定类型的任意对象的实例方法 ClassName::methodName

第四种方式需要把类的任意对象作为第一个参数，参考下面的例子：

```java
public class Test {
    private final String name;

    public Test(String n) {
        this.name = n;
    }

    public void show() {
        System.out.println(name);
    }

    public static void main(String[] args) {
        Consumer<Test> fun = Test::show;
        fun.accept(new Test("hello world"));
    }
}
```

## 其他

? extends T：接收 T 以及 T 的子类

? super T：接收 T 以及 T 的父类

# 模块和包

从 Java 9 开始引入了模块系统，模块是包的容器，简单显示关系如下：

module -> package -> class/interface

模块中包含一个描述模块的 module-info.java 文件，其中包含 2 个关键字

exports 对外暴露的包路径，相当于 public

requires 需要依赖的其他模块名称

requires transitive 可读性

示例：

```txt
// 目录结构
Project \
    src \
	    com.project.example \
		    Example.java
		com.project.test \
		    Test.java
		module-info.java
```

```java
// module-info.java
module project {
	exports com.project.example;
}
```

```java
// Example.java
package com.project.example;

import com.project.test.Test;

public class Example {

	public static void main(String[] args) {
		new Test();
		System.out.println("This is Example class");
	}

}
```

```java
// Test.java
package com.project.test;

public class Test {
	public Test() {
		System.out.println("This is Test class");
	}
}
```

## 自动化模块（automatic module）

没有 module-info.java 文件的 jar 包称为自动化模块，其模块名用包名代替。如 foo-bar-SNAPSHOT.jar 模块名为 foo.bar。

> 下文来源：http://tutorials.jenkov.com/java/modules.html#automatic-modules
>
> What if you are modularizing your own code, but your code uses a third party library which is not yet modularized? While you can include the third party library on the classpath and thus include it in the unnamed module, your own named modules cannot use it, because **named modules cannot read classes from the unnamed module**.
> 
> The solution is called automatic modules. An automatic module is made from a JAR file with Java classes that are not modularized, meaning the JAR file has no module descriptor. This is the case with JAR files developed with Java 8 or earlier. When you place an ordinary JAR file on the module path (not the classpath) the Java VM will convert it to an automatic module at runtime.
> 
> An automatic module requires all named modules on the module path. In other words, it can read all packages exported by all named modules in the module path.
> 
> If your application contains multiple automatic modules, each automatic module can read the classes of all other automatic modules.
> 
> An automatic module can read classes in the unnamed module. This is different from explicitly named modules (real Java modules) which cannot read classes in the unnamed module.
> 
> An automatic module exports all its packages, so all named modules on the module path can use the classes of an automatic module. Named modules still have to explicitly require the automatic module though.
> 
> The rule about not allowing split packages also counts for automatic modules. If multiple JAR files contain (and thus exports) the same Java package, then only one of these JAR files can be used as an automatic module.
> 
> An automatic module is a named module. The name of an automatic module is derived from the name of the JAR file. If the name of the JAR file is com-jenkov-mymodule.jar the corresponding module name will be com.jenkov.mymodule. The - (dash) characters are not allowed in a module name, so they are replaced with the . character. The .jar suffix is removed.
> 
> If a JAR file contains versioning in its file name, e.g. com-jenkov-mymodule-2.9.1.jar then the versioning part is removed from the file name too, before the automatic module name is derived. The resulting automatic module name is thus still com.jenkov.mymodule .

# 注解

使用注解可以将元数据保存在 Java 源代码中。每当创建涉及重复工作的类或接口时，通常可以使用注解来自动化和简化流程。注解本身不会实现具体功能，只是添加一些数据，需要另外编写注解处理器来解析注解。所有注解都继承自 java.lang.annotation/Annotation 接口。

## 元注解

待续

## 定义注解

使用 @interface 定义注解：

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Test {
}
```

不包含任何元素的注解称为标记注解（marker annotation），例如上例中的 @Test 就是标记注解。注解通常会包含一些表示特定值的元素。注解的元素看起来就像接口的方法，但是可以为其指定默认值。

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface UseCase {
    int id();
    String description() default "no description";
}
```

## 使用注解

注解的作用范围由 @Target 指定，使用时需要写在被注解类型之前：

```java
public class Test {
    @UserCase(id = 1, description = "hi")
    public void hello() {}
}
```

## 注解处理器

处理器通过反射获取到指定类型携带的注解对象，常用 getDeclaredMethods()、getAnnotation() 等方法。针对前面定义的 @UserCase 注解，编写一个简单的处理器，功能是搜索指定类中的使用了 @UserCase 的方法：

```java
public class UseCaseTracker {
    public static void trackUseCases(Class<?> c) {
        for(Method m : c.getDeclaredMethods()) {
            UseCase uc = m.getAnnotation(UseCase.class);
            if(uc != null) {
                System.out.println("Found Use Case " +
                        uc.id() + "\n " + uc.description());
            }
        }
    }
}
```

## 注解元素

注解元素的类型是有限制的，可用类型如下：

- 所有基本类型（int、float、boolean等）
- String
- Class
- enum
- Annotation
- 以上类型的数组

注解元素的取值也有限制，对象类型的值不能使用 null。所以只能用一些特殊的值来表示某个元素不存在。

如果注解中只有一个元素，且名称为 value，则使用注解时value可以省略。

## 嵌套注解

所谓嵌套注解，就是在注解中声明一个元素，该元素的类型是另一个注解。简单的例子如下：

```java
@A(value = "hello", b = @B("world"))
public class Test {
}

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface A {
    String value() default "I'm A";

    B b() default @B;
}

@Target(ElementType.ANNOTATION_TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface B {
    String value() default "I'm B";
}
```

## 组合注解

原生 Java 没有这个概念，在 Spring Boot 框架中很常见，这里介绍一下。组合注解就是将几个注解的功能组合到一个注解中，比如 @SpringBootApplication 由三个注解组合而成：

```java
// 部分代码
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan()
public @interface SpringBootApplication {
}
```

原生 Java 中使用 getAnnotation() 方法获取注解，但并不能获取到组合注解。Spring Boot 提供了 AnnotationUtils.findAnnotation() 方法，可以方便地获取组合注解。当然也可以通过递归简单地实现组合注解的查找：

```java
@SpringBootApplication
public class Test {
    public static void main(String[] args) {
        Annotation a = findAnnotation(Test.class,
                AutoConfigurationPackage.class);
        System.out.println(a);
    }

    private static <A extends Annotation> A findAnnotation(
            AnnotatedElement element,
            Class<A> targetType) {
        // 直接查找注解
        A annotation = element.getAnnotation(targetType);
        if (annotation != null)
            return annotation;

        // 查找组合注解
        Annotation[] aList = element.getAnnotations();
        for (Annotation ann : aList) {
            // 过滤 Java 的元注解
            // 元注解不含有组合注解
            Class<? extends Annotation> annType = ann.annotationType();
            if (annType.getName().startsWith("java.lang.annotation."))
                continue;

            annotation = findAnnotation(annType, targetType);
            if (annotation != null)
                break;
        }
        return annotation;
    }
}
```

# properties 文件读取

文件内以 key=value 形式存储多个键值对，注意文件编码。使用 properties 资源文件可以方便实现国际化。

IDEA 中添加资源文件：

右键->New->Resource Bundle

在 Locales to Add 中配置需要的语言（zh_CN, en, en_US等）

读取的简单例子：

先新建 LocalStrings_en.properties 和 LocalStrings_zh.properties 文件。

使用 ResourceBundle.getBundle() 获取文件，getString() 读取值。

```java
package test;

import java.util.Locale;
import java.util.ResourceBundle;

public class App {
    static final String BundleName = "test.LocalStrings";

    public static void main(String[] args) {
        output("hello", Locale.CHINESE);
        output("hello",Locale.ENGLISH);
    }

    static void output(String key, Locale locale) {
        ResourceBundle res = ResourceBundle.getBundle(
                BundleName, locale);
        System.out.println(res.getString(key));
    }
}
```

# Swing GUI

简单的例子：

```java
package com.my.example;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.SwingUtilities;

public class Example {

	public Example() {
		JFrame primaryFrame = new JFrame("hello");
		primaryFrame.setVisible(true);
		primaryFrame.setSize(800, 500);
		primaryFrame.setLocationRelativeTo(null); // 窗口居中
		primaryFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

		primaryFrame.add(new JLabel("hello world"));
	}

	public static void main(String[] args) {
		// invokeLater 将任务分发到待执行事件队列中
		SwingUtilities.invokeLater(new Runnable() {
			@Override
			public void run() {
				new Example();
			}
		});
	}
}
```

**注意：**Swing 有自己的专用线程来接收 UI 事件并更新屏幕，如果从其他线程对 UI 组件进行操作，可能会产生冲突和死锁。调用 SwingUtilities.invokeLater 来提交要执行的任务。

## 自定义 UI 组件外观

swing 中，按钮由 *Button, *ButtonUI, *ButtonModel 组成，其中，\*Button 类和\*ButtonUI 类决定了按钮的外观，其它组件也类似。要修改组件的外观，有两种方式：

1. 继承组件（\*Button 类）后重写组件的 paint* 方法
2. 继承 \*UI，重写 paint* 方法，再使用 UIManager 设置 look and feel
   ```java
   UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
   ```

如果要设计一整套组件的外观，推荐使用第二种方法，重写各种 UI，实现自定义的 look and feel。下面以按钮为例，使用 look and feel 修改外观，实现圆角矩形按钮。

```java
// import ...
import laf.simple.SimpleLookAndFeel;

public class Main {

	public static void main(String[] args) {

		try {
			// 设置自定义外观
			UIManager.setLookAndFeel(new SimpleLookAndFeel());
		} catch (Exception e) {
			e.printStackTrace();
		}

		JFrame frame = new JFrame("hello");
		frame.setSize(800, 500);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setLocationRelativeTo(null);
		frame.setLayout(new FlowLayout());

		// 直接使用 JButton
		var b = new JButton("hello world");
		frame.add(b);

		frame.setVisible(true);
	}
}
```

在 laf.simple 包中，有三个文件：

- SimpleLookAndFeel.java 样式
- SimpleButtonUI.java 按钮的外观
- DefaultSimpleTheme.java 主题颜色

```java
package laf.simple;

import javax.swing.UIDefaults;
import javax.swing.plaf.metal.MetalLookAndFeel;

public class SimpleLookAndFeel extends MetalLookAndFeel {
	private static final long serialVersionUID = 1L;

	public SimpleLookAndFeel() {
		setCurrentTheme(new DefaultSimpleTheme());
	}

	@Override
	protected void initClassDefaults(UIDefaults table) {
		super.initClassDefaults(table);

		table.put("ButtonUI", "laf.simple.SimpleButtonUI");
	}
}
```

```java
package laf.simple;

// import ...

public class SimpleButtonUI extends MetalButtonUI {

	private static SimpleButtonUI simpleButtonUI;

	/**
	 * 必须定义此方法，UIManager通过反射技术调用此方法创建UI对像
	 */
	public static SimpleButtonUI createUI(JComponent c) {
		if (simpleButtonUI == null) {
			simpleButtonUI = new SimpleButtonUI();
		}
		return simpleButtonUI;
	}

	@Override
	public void installDefaults(AbstractButton b) {
		super.installDefaults(b);
		// 设置默认属性
		LookAndFeel.installProperty(b, "borderPainted", Boolean.FALSE);
	}

	@Override
	public void update(Graphics g, JComponent c) {
		var b = (AbstractButton) c;
		Dimension size = b.getSize();

		// 填充按钮的背景
		if (b.isOpaque()) {
			Color oldColor = g.getColor();

			// 清除原来的背景
			g.setColor(b.getParent() != null ? b.getParent().getBackground() : b.getBackground());
			g.fillRect(0, 0, size.width, size.height);

			// 填充按钮
			g.setColor(b.getModel().isRollover() ? Color.RED : b.getBackground());
			g.fillRoundRect(0, 0, size.width - 1, size.height - 1, 30, 30);
			// 绘制边框
			g.setColor(b.isEnabled() ? b.getForeground() : b.getBackground().darker());
			g.drawRoundRect(0, 0, size.width - 1, size.height - 1, 30, 30);

			g.setColor(oldColor);
		}
		paint(g, b);
	}

	@Override
	protected void paintButtonPressed(Graphics g, AbstractButton b) {
		if (b.isContentAreaFilled()) {
			Dimension size = b.getSize();
			Color oldColor = g.getColor();

			// 背景色填充
			g.setColor(Color.GRAY);
			g.fillRoundRect(0, 0, size.width - 1, size.height - 1, 30, 30);
			// 绘制边框
			g.setColor(b.getForeground());
			g.drawRoundRect(0, 0, size.width - 1, size.height - 1, 30, 30);

			g.setColor(oldColor);
		}
	}
}
```

```java
package laf.simple;

import javax.swing.plaf.ColorUIResource;
import javax.swing.plaf.metal.OceanTheme;

public class DefaultSimpleTheme extends OceanTheme {

	private static final ColorUIResource SECONDARY3 = new ColorUIResource(255, 255, 255);

	@Override
	protected ColorUIResource getSecondary3() {
		return SECONDARY3;
	}
}
```

## 并发

组件初始化、事件响应等操作都要通过 SwingUtilities.invokeLater() 提交到 Swing 事件分发线程，但是，长期任务如果提交上去，会使界面卡住。解决的方法是创建多线程。

### Executors 的使用

Executors.newSingleThreadExecutor() 创建 Executor 线程，它会自动将待处理的任务排队。

对于单线程的 Executor：
- execute() 方法把任务提交到线程中；
- shutdownNow() 方法停止所有任务。

```java
// import ...

public class Example {
    public static void main(String[] args) {
        Runnable initTask = () -> {
            JFrame frame = new JFrame("hello");
            // init frame...

            ExecutorService executor = Executors.newSingleThreadExecutor();
            Runnable longTask = () -> {
                // 处理耗时任务
            };

            // 快速多次点击按钮，发现任务会按顺序执行
			JButton b = new JButton("开始");
            b.addActionListener(e -> {
                if (!executor.isShutdown()) {
                    System.out.println("点击");
                    executor.execute(longTask);
                }
            });
            frame.add(b);

            JButton b2 = new JButton("中断");
            b2.addActionListener(e -> executor.shutdownNow());
            frame.add(b2);
        };
        SwingUtilities.invokeLater(initTask);
    }
}
```

# 常见错误

## The type javax.swing.JFrame is not accessible

module-info.java 中添加 requires java.desktop

```java
module project {
	exports com.project.example;
	requires java.desktop;
}
```

## 设置 JFrame 背景颜色

frame.getContentPane().setBackground(Color.WHITE);
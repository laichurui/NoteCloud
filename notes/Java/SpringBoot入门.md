环境配置：
- Spring Boot 2.4.5
- JDK 15
- IDEA 2020.3.2
- Windows 10

参考：
- [Spring Boot 指南](https://snailclimb.gitee.io/springboot-guide/#/)
- [官网](https://spring.io/projects/spring-boot/)

# 简介

Spring Boot 基于 Spring 框架设计，简化了 Spring 应用的搭建及开发过程，可以用于开发 Java Web 项目。Spring Boot项目需要部署到支持 Servlet 3.1+ 的 Web 容器中，其内部已经内嵌了 Web 容器（包括 Tomcat, Jetty 和 Undertow），不需要过多的配置即可直接运行项目，当然也可以另外指定 Web 容器。

# Hello World 项目

下面通过一个简单的项目来介绍 Spring Boot 的使用，包括项目的搭建、开发、发布过程。项目非常简单，也不会对知识点进行讲解，有经验的话直接跳过本章节。

## 项目搭建

打开 IDEA，新建项目 -> Spring Initializr

根据需要填入信息，一直选下一步，**依赖包要记得勾选 Web/Spring Web**。Java version可以在项目创建后到 pom.xml 中修改。

查看生成的 pom.xml 发现，有些依赖项没有指定版本，这是因为 Spring Boot 为其**支持的依赖关系**提供一个精选列表，这些依赖项的版本可以交给 Spring Boot 管理。当升级Spring Boot本身时，这些依赖项也会升级。

## 设置主页

创建项目后，打开默认生成的 DemoApplication.java 文件，给类再加上一个 @RestController 注解，添加 home() 方法并映射到根目录：

```java
@RestController
@SpringBootApplication
public class DemoApplication {

    @RequestMapping("/")
    String home() {
        return "hello world";
    }

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

src/main/static 目录用于放置公开的静态资源（html、js、css、图片 等），这个目录的 URL 被映射为网页的根目录。在该目录下新建 index.html 也可以作为主页。

## 替换默认 Web 服务器

参考：https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto-use-another-web-server

spring-boot-starter-web 默认的服务器是 Tomcat，如果想替换为其他内嵌服务器，需要分两步：

1. 排除默认服务器（Tomcat）
2. 添加其他服务器依赖

Spring Boot 内嵌的服务器有 Tomcat、Jetty 和 Undertow，如果想使用 Jetty，就修改 pom.xml 如下：

```xml
<properties>
    <!-- jetty 9.4 不支持 Servlet 4.0，手动指定版本 -->
    <servlet-api.version>3.1.0</servlet-api.version>
</properties>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <!-- 排除 Tomcat 依赖 -->
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<!-- 导入 Jetty -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency>
```

## 运行

设置主页后就可以直接运行 DemoApplication.java 文件了，默认使用 Tomcat 作为 Web 容器，端口号是 8080。启动后，在浏览器输入 http://localhost:8080 可以看到 hello world 的文字。

# 注解

Spring Boot 的优点是基本上不需要配置 XML 文件，取而代之的是各种注解。

## 启动类

Spring Boot 的启动类作为整个程序的入口，除了要有 main 函数，还需要添加一些注解来声明请求处理器所在的位置以及其他必须的配置信息。最便捷的方式是在启动类添加一个 [@SpringBootApplication](#@SpringBootApplication) 注解。

### @SpringBootApplication

这个注解相当于声明了 [@EnableAutoConfiguration](#@EnableAutoConfiguration)、[@ComponentScan](#@EnableAutoConfiguration)、[@SpringBootConfiguration](#@EnableAutoConfiguration) 三个注解。

### @EnableAutoConfiguration

https://blog.csdn.net/qq_19674905/article/details/79367921

启动自动配置功能，从 classpath 中搜寻所有的 META-INF/spring.factories 配置文件，并将其中 org.springframework.boot.autoconfigure.EnableutoConfiguration 对应的配置项通过反射实例化为对应的标注了 @Configuration 的 JavaConfig 形式的 IoC 容器配置类，然后汇总为一个并加载到IoC容器。

如果配置类与启动类没有在同个包内，可能扫描不到，需要额外添加路径。在 resources 目录下新建 META-INF/spring.factories，写入：

```text
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
package.ClassName
```

### @ComponentScan

可以和 @Configuration 类一起使用，自动扫描包路径下的 Web 组件，默认情况下是扫描 @Component、@Repository、@Service 或者 [@Controller](#@Controller) 注解的类。可以在 basePackageClasses 或 basePackages 中指定扫描的路径，如果 basePackages 不存在，就会扫描被注解的类所在的包。被扫描到的 Web 组件自动注册为 Spring Beans。

### @SpringBootConfiguration

由 [@Configuration](#@Configuration) 组成，声明这是一个 Spring Boot 应用程序的配置类。程序应该只包含一个 @SpringBootConfiguration。

### @Configuration

声明类中定义了一个或多个 [@Bean](@Bean) 方法，Spring 容器会加载这些 Bean，在 Service 层会从 Spring 容器内提取需要的 Bean 对象。

### @Bean

声明方法的返回值是一个 Bean 对象，由 Spring 容器管理其生命周期（创建、销毁等）。

## 控制器

控制器用来处理 Web 请求，返回响应信息。与 url 建立映射关系后就能被 Spring 使用。可以使用 [@RestController](#@RestController) 或 [@Controller](#@Controller) 注解来声明控制器。

### @RestController

携带这个注解的类会被当作 Web 的控制器，Spring 在收到 Web 请求时会根据 url 选择处理请求的控制器，参阅 [@RequestMapping](#@RequestMapping)。@RestController 包含了 [@ResponseBody](#@ResponseBody)，所以被注解的类的方法的返回值都绑定到响应正文中，返回值被转化为 JSON 或 XML 格式。

@RestController 由 [@Controller](#@Controller) 和 [@ResponseBody](#@ResponseBody) 两个注解组合而成。

### @Controller

声明被注解的类是一个控制器，该类在 classpath 扫描时会被检测到。@Controller 一般和 [@RequestMapping](#@RequestMapping) 搭配使用。

### @RequestMapping

把 web 请求映射到被注解的类。这个注解可以用在类和方法中，方法上推荐用 @GetMapping、@PostMapping、@PutMapping、@DeleteMapping 或 @PatchMapping。

### @ResponseBody

被注解的类型的返回值会绑定到响应正文中，并且返回值被自动转化为 JSON 或 XML 格式，默认使用 HttpMessageConverter 对数据进行转化，根据请求头的 accept 属性决定转化的格式。不加这个注解时，@RequestMapping 的方法返回值会解析为跳转路径。

如果想自定义消息转换器，就需要把自定义的转换器的实例化对象添加到 Spring 的转化器列表中。

第一种方式，使用注解。在 @Configuration 类的 @Bean 方法返回一个 HttpMessageConverters（或其子类） 对象：

```java
@Configuration(proxyBeanMethods = false)
public class MyConfiguration {
    @Bean
    public HttpMessageConverters customConverters() {
        HttpMessageConverter<?> additional = ...
        HttpMessageConverter<?> another = ...
        return new HttpMessageConverters(additional, another);
    }
}
```

任何出现在上下文的 HttpMessageConverter bean 都会添加到转换器列表里，可以覆盖列表里的默认转化器。

第二种，继承 WebMvcConfigurerAdapter 类或者实现 WebMvcConfigurer 接口，重写对应的方法。
- extendMessageConverters() 添加或覆盖消息转化器列表
- configureMessageConverters() 配置消息转化器列表，默认的转化器都失效

```java
@Configuration(proxyBeanMethods = false)
public class Test implements WebMvcConfigurer {

    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        // converters.add(...);
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        // converters.add(...);
    }
}
```

参考：https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-spring-mvc-message-converters

### @RequestBody

作用于方法的参数，把参数绑定到请求正文。前端发送 post 请求时，通常会把 json 数据放在请求正文，此时，后端可以使用 @RequestBosy 注解来解析请求正文。Spring Boot 会根据请求的 ContentType 调用HttpMessageConverter 类来解析请求正文。@Valid 可以对参数进行验证。

前端：

```html
<script>
    function greet() {
        fetch("/greet",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([
                    {"msg": "hi, server"},
                    {"msg": "hello, server"},
                ])
            })
            .then(res => res.text())
            .then(resText => alert(resText));
        return true;
    }
</script>
```

后端：

```java
class Message {
    private String msg;
    public String getMsg() {return msg;}
    public void setMsg(String msg) {this.msg = msg;}
}

@RestController
public class DemoApplication {
    @PostMapping("/greet")
    public ResponseEntity<String> greet(@RequestBody Message[] m) {
        for (Message msg : m)
            System.out.println(msg.getMsg());
        return new ResponseEntity<>(
                "hello, client",
                HttpStatus.OK);
    }
}
```

# 基础入门

## 配置类

Spring Boot 推荐把配置信息写在 Java 类中，并使用 [@Configuration](#@Configuration) 标注。继续使用 XML 也没问题。如果使用 XML 配置，可以在 [@Configuration](#@Configuration) 类添加 @ImportResource 导入 XML 文件。

启动类通常会开启自动配置，如果想禁用特定的配置，可以参考以下代码：
```Java
@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
public class MyApplication {
}
```

## 依赖注入

[@ComponentScan](#@ComponentScan) 会把 Web 组件注册为 Spring Beans，如果想在 Bean 中使用其他的 Bean 对象，就要通过依赖注入的方式来实现。依赖注入从已注册的 Bean 列表中找到需要的对象，与参数连接。推荐在构造器中使用依赖注入：

```java
@Service
public class MyAccountService implements AccountService {
    private final RiskAssessor riskAssessor;

    @Autowired
    public MyAccountService(RiskAssessor riskAssessor) {
        this.riskAssessor = riskAssessor;
    }
}
```

上例中，riskAssessor 参数自动装配，从注册的 Spring Beans 中找到最符合的 Bean 定义。只有一个构造函数时，@Autowired 可以省略。

当有多个同类型的 Bean 存在时，@Qualifier 注解能够限定自动装配的 Bean 名称，如：

```java
@Service
public class MyAccountService implements AccountService {
    private final RiskAssessor riskAssessor;

    @Autowired
    public MyAccountService(@Qualifier("riskAssessor") RiskAssessor riskAssessor) {
        this.riskAssessor = riskAssessor;
    }
}
```

# 项目组成

一个完整的项目通常需要几个部分：

- 启动类
- 配置类(Configuration)  
    Spring 容器会加载配置类中定义的 Bean，这些 Bean 通常对应数据库的表实体。业务层通过依赖注入可以提取这些 Bean。
- 控制器(Controller)  
    与前端打交道，调用业务层处理 http 请求，把处理结果发给前端
- 业务层(Service)  
    处理请求，如果需要进行数据库操作，则调用持久层来处理。
- 持久层(persistence)  
    负责数据库的增删改查操作

## 启动类

启动类会创建 ApplicationContext 实例，并加载所有 bean。

调用 SpringApplication.run() 按照默认配置启动应用程序：

```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

如果想修改默认设置，您可以改为创建本地实例并对其进行自定义。例如，要关闭横幅，您可以编写：

```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(MyApplication.class);
        application.setBannerMode(Banner.Mode.OFF);
        application.run(args);
    }
}
```

SpringApplication 类实例时需要指定一个配置源，如上例中的 MyApplication.class。另外，也可以在 application.properties、Java 属性文件、YAML 文件、环境变量和命令行参数等进行配置，详情查看 https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config。

### 延迟初始化

启用延迟初始化后，bean 将在需要时创建，而不是在应用程序启动期间创建。因此，启用延迟初始化可以减少应用程序启动所需的时间，而缺点是它会延迟发现应用程序的问题。

如果您想在使用延迟初始化的同时禁用某些 bean 的延迟初始化，您可以使用@Lazy(false)注解将它们的延迟属性显式设置为 false 。
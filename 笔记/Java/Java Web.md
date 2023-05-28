# Java Web

参考书籍：Tomcat与Java Web开发技术详解（第2版） 孙卫琴著

配置环境：
- IntelliJ IDEA 2020.3.2
- Maven 3.6.3（IDEA内置）
- JDK 15
- Tomcat 10.0.4
- Chrome 89.0.4389.90 64位

# Web 核心概念

进行网页开发前，需要了解一些基础概念。

## URL

https://developer.mozilla.org/zh-CN/docs/Learn/Common_questions/What_is_a_URL

URL（Uniform Resource Locator）代表统一资源定位符，即资源在 Web 上的地址，格式为（“[]”表示可省略）：

Protocol://[userinfo@]Domain_Name_or_IP[:Port]/path/to/myfile[?Parameters][#Anchor]

各字段说明：

Protocol：通常是 http 或 https，还有 mailto、ftp 等协议

userinfo：格式 username:password

Domain_Name_or_IP：域名，也可以直接使用 ip 地址

Port：端口，如果使用标准端口则可以省略（http协议是80端口，https是443端口）

Parameters：额外参数，用 & 分隔，如 ?a=1&b=2&ok

Anchor：锚点，使页面滚动到 html 上的标识符（标签的id）

### 绝对 URL 和相对 URL

URL 的必需部分取决于使用 URL 的上下文。在浏览器的地址栏没有任何上下文，因此需要提供完整的 URL。在 html 页面中，可以使用相对的 URL。

如果以 / 开头，则从 **服务器的顶部根目录** 获取资源；
不以 / 开头，则从 **当前资源的子目录** 查找

相对 URL 示例：

当前的文档为 https://my.com/docs

/java/api 对应 https://my.com/java/api

java/api 对应 https://my.com/docs/java/api

## http

HTTP/1.1规范：https://tools.ietf.org/html/rfc2616

HTTP/2规范：https://tools.ietf.org/html/rfc7540

http协议建立在TCP/IP基础上，规定了在客户端和服务端之间传输的数据内容及格式要求。http 请求和 http 响应本质上就是一段字符串，这段字符串需要根据 http 协议来构造或者解析。

直接使用 TCP 就可以实现 http 简单服务：

```java
import java.io.IOException;
import java.io.InputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class MyServer {
    public static void main(String[] args) throws IOException, InterruptedException {
        ServerSocket server = new ServerSocket(8080);
        Socket client = server.accept();
        Thread.sleep(500);

        //接收 http 请求
        InputStream input = client.getInputStream();
        byte[] request = new byte[input.available()];
        int readed = 0;
        int size = input.available();
        while (readed < size) {
            readed += input.read(request, readed, size - readed);
        }
        System.out.println(new String(request));

        //发送 http 响应到客户端
        byte[] response = """
                HTTP/1.1 200 OK\r
                Content-Type:text/html\r
                \r
                <html>\r
                <body>\r
                <h1>hello</h1>\r
                </body>\r
                </html>""".getBytes();
        client.getOutputStream().write(response);

        client.close();
        server.close();
    }
}
```

客户端：

```java
import java.io.IOException;
import java.net.Socket;

public class MyClient {
    public static void main(String[] args) throws IOException, InterruptedException {
        Socket socket = new Socket("localhost", 8080);

        //发送 http 请求
        byte[] request = """
                GET index.htm HTTP/1.1\r
                Accept: */*\r
                Accept-Language: zh-cn\r
                Accept-Encoding: gzip, deflate\r
                User-Agent: HTTPClient\r
                Host: localhost:8080\r
                Connection: Keep-Alive\r
                \r""".getBytes();
        socket.getOutputStream().write(request);

        Thread.sleep(2000);

        //接收 http 响应
        byte[] response=socket.getInputStream().readAllBytes();
        System.out.println(new String(response));

        socket.close();
    }
}
```

## MIME

MIME协议规范：https://tools.ietf.org/html/rfc2045

https://www.iana.org/assignments/media-types/media-types.xhtml

HTTP 请求和响应的部分可以是任何数据，为了统一接受方和发送方的数据格式，HTTP 采用 MIME 协议来规范正文数据格式。

MIME（Multipurpose Internet Mail Extension）是指多用途网络邮件扩展协议，规定了请求正文和响应正文的数据格式。在 HTTP 请求头和响应头中，由 Content-type 指定 MIME 类型。

# 入门项目

需要先安装 IDEA、JDK、Tomcat。

## 新建

IDEA 新建项目，选择 Java Enterprise，Project template选Web Application，其他的根据需要修改。

## 配置Tomcat

Run->Edit Configurations...

点"+"号->Tomcat Server->Local

右侧 Deployment 添加 war，Application context设为 "/"

## 修改编译路径

web项目具有固定的目录结构，.class文件要放到指定目录中。

File -> Project Structure -> 选择Modules

右侧选中项目，选 Paths

Output path改为：...\WEB-INF\classes

Test output path可以不管

## 添加依赖包路径[可选]

项目用到第三方包时，发布时要把这些包放到 lib 目录。

1 在 WEB-INF 目录下新建 lib 目录

2 File->Project Structure->Modules

右侧选中项目，打开 Dependencies 选项卡

点击"+"号->Jars or Directories->选择 lib 目录->Jar Directory

> 注意  
> Tomcat服务器会提供servlet-api.jar包，不需要放在lib目录  
> 编译项目时加入依赖，发布时不用管

pom.xml 中，添加以下代码，在编译时把依赖包复制到 lib 目录

```maven
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-dependency-plugin</artifactId>
    <version>3.1.2</version>
    <executions>
        <execution>
            <id>copy</id>
            <phase>package</phase>
            <goals>
                <goal>copy-dependencies</goal>
            </goals>
            <configuration>
                <outputDirectory>src/main/webapp/WEB-INF/lib</outputDirectory>
                <includeScope>compile</includeScope>
            </configuration>
        </execution>
    </executions>
</plugin>
```

## 补充

经过上面的步骤，相信可以在 IDEA 中成功创建项目，默认情况下，会自动生成 index.jsp 及相关的文件，项目可以直接运行了。

开发过程应根据以下目录结构放置文件：

```
java \
    源文件
resources \
    .properties文件
    其他java资源文件
webapp \
    WEB-INF \
        web.xml
        classes \
            ...
        lib \
            ...
    前端文件（jsp,html,css,js等）
    图片等前端资源文件
```

## 发布

发布Java Web非常简单，把项目文件复制到 "Tomcat安装路径/webapps" 下就可以了，选择下面一种格式进行发布：

- 项目编译成一个 .war 文件
- IDEA 编译后的整个项目文件夹（eg：/target/project-1.0）

发布后，启动Tomcat服务器，访问 http://localhost:8080 网页，网址根据自己的配置进行修改。

# Servlet

Servlet 处理 get、post 等 http 请求，但本身不会接收和解析 http 请求，因此需要配置在 Servlet 容器中，由容器完成 http 的监听和请求分发操作。我们选择 Tomcat 作为 Servlet 的容器。

Tomcat 是一个轻量级服务器，支持 Servlet，接收 HTTP 请求后包装成 ServletRequest 分发到 Servlet 中。

进行 Servlet 项目开发前，要配置以下环境：
- 安装 Tomcat
- 项目中引入 servlet-api.jar 包（从 Tomcat安装路径/lib 目录下复制，或者使用 maven 并在 pom.xml 中引入依赖）

## 配置映射路径

编写自定义的 Servlet 类，首先需要继承自 HttpServlet 或 GenericServlet，然后，需要配置访问 Servlet 的 URL 路径，客户端发送请求到配置的路径就能获取对应的 Servelt 服务。配置的方式有以下两种：

第一种：

打开 WEB-INF/web.xml，在 web-app 标签下添加子标签 servlet 和 servlet-mapping

```xml
<web-app>
    <servlet>
        <servlet-name>hello</servlet-name>
        <servlet-class>my.servlet.HelloServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>hello</servlet-name>
        <url-pattern>/hello</url-pattern>
    </servlet-mapping>
</web-app>
```

第二种：

使用 WebServlet 注解

```java
@WebServlet(name = "hello", value = "/hello")
public class HelloServlet extends HttpServlet {
}
```

映射路径有优先级

## 生命周期

init() -> services() -> destroy()

一、初始化阶段

init() 在整个 Java Web 运行过程中只执行一次。Tomcat 会在 Servlet 初次被访问时调用 init()，并且**把实例化对象保存到内存中**，之后客户端请求该 Servlet 时不会重复初始化操作。

如果使用注解或者在 web.xml 中设置 load-on-startup，那么该 Servlet 会在 Tomcat 服务器启动 Java Web 时实例化。

二、运行时阶段

services() 会多次调用，当客户端请求时，Tomcat 从内存中找到被请求的 Servlet 对象，调用其 services() 方法。

多个客户端请求时，Tomcat 会启动多线程，但一个 Servlet 只有一个实例化对象，因此，**多个客户端使用同一个 Servlet 对象**，要注意 services() 方法中的变量同步问题。

三、销毁阶段

destroy() 只执行一次。关闭 Tomcat 服务器前，调用 destroy() 释放 Servlet 的资源。

http://localhost:8080/manager 进入 Tomcat 管理页面。

## ServletRequest 接口

ServletRequest 接口提供了一系列用于读取客户端的请求数据的方法。

get*() 方法读取各种请求信息。

setAttribute() 在请求范围内保存一个属性。

## ServletResponse 接口

响应客户端请求。

set*()、getWriter()、sendError()

```java
response.setContentType("text/html");
PrintWriter respOutput = response.getWriter();
out.println("<html><body>hello</body></html>");
out.close();
```

## ServletConfig 接口

在 web.xml 中配置 init-param 标签，使用 ServletConfig 就可以获取 Servlet 的初始化参数。

## ServletContext 接口

Tomcat 启动 Web 应用时，会创建一个 ServletContext 对象，且每个 Web 应用都仅有唯一的 ServletContext 对象。**利用这个全局的对象，实现不同 Servlet 间数据的共享**。调用 getServletContext() 获取该对象。

web.xml 中可以配置初始参数：

```xml
<web-app>
    <context-param>
        <param-name>key</param-name>
        <param-value>value</param-value>
    </context-param>
</web-app>
```

常用方法：setAttribute()、getAttribute()

## ServletContextListener 监听器

ServletContext 和 Web 应用有同样的生命周期，监听 ServletContext 可以处理 Web 应用的启动或终止事件。

使用注解标记监听器：

```java
@WebListener
public class Test implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
    }
}
```

也可以在 web.xml 中添加 listener 元素：

```xml
<listener>
    <listener-class>...</listener-class>
</listener>
```

## 页面缓存

许多浏览器为了能快速向用户展示所请求的页面，会把网页存放在客户端的缓存中，如果多次访问同一个网页，得到的可能是过期的页面。对于随时更新的动态页、包含敏感数据的网页，服务器往往不希望网页被缓存。可以设置 HTTP 响应头来禁止客户端缓存。

HTTP 1.0 -> Pragma: no-cache

HTTP 1.1 -> Cache-Control: nocache

HTTP 1.0、1.1 -> Expires: 0

## 下载文件

服务端先设置 http 响应头

```http
Content-Length: *
Content-Disposition: "attachment;filename="file.txt"
```

然后在响应正文中写入文件数据。

示例：

```java
public class DownloadServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String fileName = req.getPathInfo();
        InputStream in = getServletContext().getResourceAsStream(fileName);
        ...
        // 设置响应头
        resp.setContentLength(in.available());
        resp.setHeader("Content-Disposition",
                "attachment;filename=\"" + fileName + "\"");

        // 发送文件内容
        OutputStream out = resp.getOutputStream();
        int readSize;
        byte[] buffer = new byte[512];
        while ((readSize = in.read(buffer)) != -1)
            out.write(buffer, 0, readSize);

        in.close();
        out.close();
    }
}
```

## 上传文件

前端可以用 html 或 js 上传文件。

html示例：

```html
<form method="post" enctype="multipart/form-data" action="/upload">
    <input type="file" name="file" accept=".*">
    <button type="submit">上传</button>
</form>
```

js示例：

```javascript
/**
 * @param {File} file 要上传的文件
 */
function uploadFile(file) {
    let formData = new FormData();
    formData.append("file", file);

    let req = new XMLHttpRequest();
    req.open("post", "/upload");
    req.onreadystatechange = () => {
        if (req.readyState === 4 && req.status === 200)
                ...
    };
    req.upload.onprogress = event => {
        if (event.lengthComputable)
            ... // event.loaded
    };
    req.send(formData);
}
```

服务端使用 commons-fileupload/commons-fileupload 1.4 包接收上传的文件：

```java
public class UploadServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        DiskFileItemFactory factory = new DiskFileItemFactory(
                bufferSize,
                new File(tempFilePath)
        );
        ServletFileUpload upload = new ServletFileUpload(factory);
        upload.setHeaderEncoding("utf-8");

        try {
            RequestContext ctx = new UploadRequestContext(req);
            List<FileItem> items = upload.parseRequest(ctx);
            for (FileItem i : items) {
                if (!i.isFormField()) {
                    File file = new File(filePath +
                        File.separatorChar +
                        item.getName());
                    item.write(file);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## 转发和包含

Servlet 组件间的协作有两种方式：

- 请求转发：A_Servlet 接收请求，做一些预处理操作，然后转发给 B_Servlet，由 B_Servlet 生成响应结果（A_Servlet的响应结果会被忽略）
- 包含：A_Servlet 把 B_Servlet 生成的响应结果包含到自身的响应结果中

通过 getServletContext().getRequestDispatcher() 获取 RequestDispatcher 对象，然后调用：
- RequestDispatcher.forward() 请求转发
- RequestDispatcher.include() 包含

# 过滤器

过滤器是在 Java Servlet 2.3 规范中定义的，它为 Web 组件（Servlet、JSP或HTML文件）提供如下过滤功能：
- 在 Web 组件被调用之前检查 ServletRequest 对象，修改请求头和请求正文的内容，或者对请求进行预处理操作
- 在 Web 组件被调用之后检查 ServletResponse 对象，修改响应头和响应正文

示例：

```java
import jakarta.servlet.Filter;
public class Test implements Filter {
    @Override
    public void doFilter(ServletRequest req,
                         ServletResponse resp,
                         FilterChain chain)
            throws IOException, ServletException {
        // 请求的预处理

        chain.doFilter(req, resp);

        // 修改响应
    }
}
```

在 web.xml 中加入过滤器声明：

```xml
<filter>
    <filter-name>name</filter-name>
    <filter-class>my.Filter</filter-class>
    <init-param>...</init-param>
</filter>
<filter-mapping>
    <filter-name>name</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

# 安全域

安全域是 Web 服务器用来保护资源的一种机制，可以限制访问资源的角色。在 web.xml 中加入 <security-constraint>、<login-config>、<security-role> 标签，即可为资源添加安全域。

在 Tomcat 中通过修改 <CATALINA_HOME>/conf/tomcat-users.xml 来添加角色和用户。当然，也有其他方式来读取用户信息。

- 内存域是从 XML 文件中读取用户信息，默认是从 <CATALINA_HOME>/conf/tomcat-users.xml 读取。需要在 Web应用/META-INF/context.xml 加入 <Realm> 元素：
   ```xml
  <Realm className="org.apache.catalina.realm.MemoryRealm"/>
  ```
- JDBC域通过JDBC驱动程序访问数据库来获取用户信息。
- DataSource域通过JNDI DataSource访问数据库来获取用户信息。

# 常见问题

## idea配置Tomcat，控制台乱码

出现 **淇℃伅** 乱码，
打开 {安装路径}\Tomcat 10.0\conf\logging.properties 文件，
找到 java.util.logging.ConsoleHandler.encoding = UTF-8，
把 UTF-8 改为 GBK

出现其他乱码，idea中，打开 Run->Edit Configurations...，
在 vm option 添加 -Dfile.encoding=UTF-8

## 请求乱码

http 请求头如果含中文字符，需要进行编码

```java
fileName = URLEncoder.encode("中文.txt",
                StandardCharsets.UTF_8);
resp.setHeader("Content-Disposition",
        "attachment;filename=\"" + fileName + "\"");
```
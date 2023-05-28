# 多屏鼠标切换工具

项目名：my.tools / SwitchDevices

功能：多屏模式下，输入快捷键，鼠标移动到下一个显示屏的中间。

开发环境：
- JDK 15
- IDEA Ultimate 2020.3
- Windows 10

依赖包：
- com.github.tulskiy/jkeymaster

软件适用范围：已安装 JDK 15 的 win10 系统

## 快捷键监听

借助 com.1stleg/jnativehook 或 com.github.tulskiy/jkeymaster 包可以实现系统级快捷键监听。项目选用的是 jkeymaster 包。用法很简单，获取 Provider 对象后调用 register() 方法即可。在程序退出前记得调用 reset()、stop() 方法。简单的小例子：

```java
import com.tulskiy.keymaster.common.Provider;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // 注册热键处理函数
        Provider p = Provider.getCurrentProvider(false);
        p.register(
                KeyStroke.getKeyStroke("alt Z"),
                hotKey -> System.out.println("hello")
        );

        // 读取任意内容
        Scanner s = new Scanner(System.in);
        s.next();
        s.close();

        // 清除热键
        p.reset();
        p.stop();
    }
}
```

## 鼠标定位

Robot 类可以控制系统的鼠标和键盘输入。多屏模式要先获取鼠标所在的显示设备
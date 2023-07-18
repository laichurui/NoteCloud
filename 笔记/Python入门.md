Python入门

本文档简要介绍 Python3 语法，以 Pycharm 作为编译器。

# 整数的原码、反码、补码

原码、反码、补码是机器存储一个具体数字的编码方式，下面使用*8位二进制数*说明这些概念。

在计算机中，带符号整数可以分为正数和负数，以二进制方式存储为 **符号位 + 有效数字**。

原码就是数字的二进制本身，最高位作为符号位，如：

[X]<sub>原</sub> = 0xxx xxxx 或 1xxx xxxx

补码是根据模运算中的补数概念来的。以时钟（模为12，表示范围是0时刻到11时刻）为例，假设现在为0时刻，转动时针，前进1小时后到 1时刻，后退11小时也会到 1时刻，在模12的系统中，1与11互称为**补数**。可以发现，补数之和就是模的长度，且+1与-11得到同样的运算结果。因此，**在模运算中，减去一个数可以变为加上该数的补数，补码的概念就是让减法变为加法，在计算机运算时将加减法统一起来**。补码与补数类似，*8位二进制数*的模为2<sup>8</sup>（去掉符号位），和为 2<sup>8</sup> 的数互为补码。因此，*n位二进制数*的补码的计算式为：

[X]<sub>补</sub> + X = 2<sup>n</sup>

# 编码风格

一行不超过79个字符，尽量把注释放到单独的一行。

| 取名规范      |   示例                     |
| ---          |    ---                     |
| 类名          |   CapWords                |
| 包名          |   lower_with_underscores  |
| 函数方法      |   lower_with_underscores  |
| 全局常量      |   CAPS_WITH_UNDER         |
| 保护变量      |   _protected_var          |
| 私有变量      |   __private_var           |
| 公有变量      |   public_var              |

# 注释和类型提示

```python
# 用 # 号开头的单行注释

'''
三个引号包围
多行注释
'''

# 函数的类型提示
def func(param: int) -> None:
    pass

# 变量的类型提示
param: str = "hello"
param = "hello"  # type:str
```

# 基础语法

## lambda 匿名函数

lambda 表达式用于创建匿名函数，语法格式为：

```ebnf
lambda_expr ::= "lambda" [parameter_list] ":" expression
```

该匿名对象的行为类似于用以下方式定义的函数:

```python
def <lambda>(parameter_list):
    return expression
```

例子：

```python
from typing import Callable


def func(callback: Callable[[], None]) -> None:
    """测试用的函数
    :param callback: 回调函数
    """
    if True:
        callback()  # 调用回调函数


# 使用 lambda 匿名函数
func(lambda: print("This is lambda function"))
```

正负无穷：float("inf")、float("-inf")

## 断言 assert

```ebnf
assert_stmt ::=  "assert" expression ["," expression]
```

assert 语句用于在__debug__下判断表达式是否为真，表达式值为 False 时抛出异常。*非调试状态下 assert 语句没有意义。*

assert expression 等价于：

```python
if __debug__:
    if not expression: raise AssertionError
```

assert expression1, expression2 等价于：

```python
if __debug__:
    if not expression1: raise AssertionError(expression2)
```

## __debug__

内置常量，如果 Python 启动时没有 -O 选项，其值为 True。

# 数据类型

## 集合

集合(set)类型具有以下几种要素：

1. 元素不重复，而且是无序的，*重复的元素会自动去重*
2. 不支持索引
3. 使用 {} 或者 set() 创建

集合有一些特别的运算，并集(|)、交集(&)、差集(-)、对称差集(^)

```python
from os import linesep

# 注意：集合会自动去重
t: set = {1, 2, 3}
s: set = {3, 4, 5}

print(t | s,  # 并集 {1, 2, 3, 4, 5}
      t & s,  # 交集 {3}
      t - s,  # 差集 {1, 2}
      t ^ s,  # 对称差集(并集减交集) {1, 2, 4, 5}
      sep=linesep)
```

# 常见问题

## 获取局域网 ip 地址

使用 socket 连接某个网址，解析返回的 socket 数据包，取出其中的 ip 地址。

```python
from socket import socket, AF_INET, SOCK_DGRAM

def _get_localhost_ip():
    """获取主机ip地址

    :return: ip字符串
    """
    try:
        s: socket = socket(AF_INET, SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip: str = s.getsockname()[0]
    finally:
        s.close()
    return ip
```

## 换行符

不同操作系统的换行符是不同的，Windows 通常是 "\r\n"，Linux 通常是 "\n"。

从 os 模块导入 linesep 变量即可适应不同系统。

## 操作系统识别

platform.system() 函数可用于识别操作系统

```python
from platform import system, platform
from os import linesep

print(system(),  # 结果为：Windows
      platform(),  # 结果为：Windows-8.1-6.3.9600-SP0
      sep=linesep)
```

## 输出重定向

sys.stdin、sys.stdout、sys.stderr 分别对应标准输入、输出、错误输出，默认都是输出到控制台，可以重定向到文件中：

```python
import sys

sys.stdout = open("out.txt", "w+")
print("hello world")  # 输出到 out.txt
sys.stdout.close()
```

## 日志

使用 logging 模块记录日志信息，默认输出到 stderr，可以重定向到文件中。

```python
import logging

logging.debug('Debug')
logging.info('Info')
logging.warning('Warning')
logging.error('Error')
logging.critical('Critical')
```

控制台输出结果为：

```cmd
WARNING:root:Warning
ERROR:root:Error
CRITICAL:root:Critical
```

默认情况下，debug 和 info 的信息会被压制
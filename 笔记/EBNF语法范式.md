# 简介

EBNF 全称 Extended Backus–Naur Form ( 扩展的巴科斯范式 )，是基于 BNF (巴科斯范式) 的一种扩展。用来描述计算机语言语法的符号集。

EBNF 参考：

[本地](../static/EBNF.pdf)

[网络](https://www.cl.cam.ac.uk/~mgk25/iso-14977.pdf)

# 语法

基本语法形式如下：

LeftHandSide = RightHandSide

左式也被叫做 非终端符号(non-terminal symbol)，而右式则描述了其的组成。

|符号     |说明     |
|---      |---     |
|=        |定义     |
|,        |连接符   |
|;        |结束符   |
|\|       |或       |
|[...]    |可选     |
|{...}    |重复任意次|
|(...)    |分组     |
|"..."    |原始字符串|
|'...'    |原始字符串|
|(\*...\*)|注释     |
|?...?    |特殊序列  |
|-        |除外     |

优先级顺序:

\* repetition-symbol

\- except-symbol

, concatenate-symbol

| definition-separator-symbol

= defining-symbol

; terminator-symbol

# 示例

下例示范了怎么表达重复：

```ebnf
aa = "A";
bb = 3 * aa, "B";
cc = 3 * [aa], "C";
dd = {aa}, "D";
ee = aa, {aa}, "E";
ff = 3 * aa, 3 * [aa], "F";
gg = {3 * aa}, "D";
```

这些规则定义的终端字符串如下:

```ebnf
aa: A
bb: AAAB
cc: C AC AAC AAAC
dd: D AD AAD AAAD AAAAD etc.
ee: AE AAE AAAE AAAAE AAAAAE etc.
ff: AAAF AAAAF AAAAAF AAAAAAF
gg: D AAAD AAAAAAD etc.
```

3 * [aa] 等价于 [aa],[aa],[aa]
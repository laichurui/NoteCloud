# 笔记云

弹窗消息提醒参考来源：https://learnku.com/f2e/t/29779

拖拽排序列表参考来源：https://www.youtube.com/watch?v=9HUlUnM3UG8

第三方库：
- marked.js 解析 md 文件
- highlight.js 对代码部分进行着色

添加笔记的方法：
1. 在笔记目录中新建 .md 文件
2. 运行 GenerateNavJson，生成 笔记.json 文件

推荐使用 chrome 浏览器。Firefox 浏览器需要打开 has 选择器支持，具体操作：地址栏输入 about:config，搜索 layout.css.has-selector.enabled 并设置为 true。

## 笔记格式

笔记都是 markdown 文件，参考 [markdown简易入门](?article=笔记/markdown简易入门.md) 学习如何编辑md文件。

在笔记加载完后，网页会把h1-h6标签提取出来，作为章节标题放入目录栏中。用户只要点击目录栏的章节索引就能跳转到对应章节。如果**需要使用标题，但又不希望被提取成章节索引**，此时设置class属性为**notitle**即可:

    <h1 class=notitle>hello</h1>

## 笔记.json说明

网页根据“笔记.json”的内容生成笔记导航。笔记目录中的文件发生增删时，需要更新“笔记.json”文件。运行 GenerateNavJson（linux的可执行程序） 更新文件，或者执行下面的程序：

```c++
#include <iostream>
#include <filesystem>
#include <string>
#include <fstream>
// nlohmann json(https://github.com/nlohmann/json)
#include "json.hpp"

using namespace std;
using namespace std::filesystem;

void generateJson(const string &path, nlohmann::json &root) {
    directory_entry entry(path);
    if (entry.is_directory()) {
        nlohmann::json fileJsonArr = nlohmann::json::array();
        directory_iterator files(path);
        for (auto &it: files) {
            generateJson(it.path(), fileJsonArr);
        }
        nlohmann::json fileJsonObj = nlohmann::json::object();
        fileJsonObj[entry.path().filename()] = fileJsonArr;
        root.push_back(fileJsonObj);

    } else {
        root.push_back(entry.path());
    }
}

int main() {
    nlohmann::json root;
    // 路径为当前目录的"笔记"文件夹
    generateJson("笔记", root);

    ofstream outFile("笔记.json", ios::out);
    outFile << root.dump() << endl;
    outFile.close();
    return 0;
}
```
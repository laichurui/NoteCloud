本文档的参考来源：
- 李建忠的c++设计模式视频
- https://github.com/JakubVojvoda/design-patterns-cpp
- https://refactoringguru.cn/design-patterns/catalog

开发环境：
- windows 10
- visual studio 2022

# 创建型模式

这类模式提供创建对象的机制， 能够提升已有代码的灵活性和可复用性。

## 工厂方法

动机：在软件系统中，经常面临着创建对象的工作；由于需求的变化，需要创建的对象的具体类型经常变化。

模式定义：定义一个用于创建对象的接口，让子类决定实例化哪一个类。Factory Method使得一个类的实例化延迟（目的：解耦，手段：虚函数）到子类。

其实就是调用工厂类中的成员函数来创建对象，需求改变时只需要更改接口的实现。

```c++
#include <iostream>
#include <string>

 /*
  * Product
  * products implement the same interface so that the classes can refer
  * to the interface not the concrete product
  */
class Product
{
public:
    virtual ~Product() {}

    virtual std::string getName() = 0;
};

/*
 * Concrete Product
 * define product to be created
 */
class ConcreteProductA : public Product
{
public:
    ~ConcreteProductA() {}

    std::string getName() { return "type A"; }
};

/*
 * Concrete Product
 * define product to be created
 */
class ConcreteProductB : public Product
{
public:
    ~ConcreteProductB() {}

    std::string getName() { return "type B"; }
};

/*
 * Creator
 * contains the implementation for all of the methods
 * to manipulate products except for the factory method
 */
class Creator
{
public:
    virtual ~Creator() {}

    virtual Product* createProductA() = 0;
    virtual Product* createProductB() = 0;

    virtual void removeProduct(Product* product) = 0;
};

/*
 * Concrete Creator
 * implements factory method that is responsible for creating
 * one or more concrete products ie. it is class that has
 * the knowledge of how to create the products
 */
class ConcreteCreator : public Creator
{
public:
    ~ConcreteCreator() {}

    Product* createProductA()
    {
        return new ConcreteProductA();
    }

    Product* createProductB()
    {
        return new ConcreteProductB();
    }

    void removeProduct(Product* product)
    {
        delete product;
    }
};


int main()
{
    Creator* creator = new ConcreteCreator();

    Product* p1 = creator->createProductA();
    std::cout << "Product: " << p1->getName() << std::endl;
    creator->removeProduct(p1);

    Product* p2 = creator->createProductB();
    std::cout << "Product: " << p2->getName() << std::endl;
    creator->removeProduct(p2);

    delete creator;
    return 0;
}
```


## 抽象工厂

动机：在软件系统中，经常面临着“一系列相互依赖的对象”的创建工作；同时，由于需求的变化，往往存在更多系列对象的创建工作。

模式定义：提供一个接口，让该接口负责创建一系列“相关或者相互依赖的对象”，无需指定它们具体的类。

```c++
#include <iostream>

/*
 * 接口 A
 */
class ProductA
{
public:
	virtual ~ProductA() {}

	virtual const char* getName() = 0;
};

/*
 * 实际的产品 AX 和 AY
 */
class ConcreteProductAX : public ProductA
{
public:
	~ConcreteProductAX() {}

	const char* getName() { return "A-X"; }
};

class ConcreteProductAY : public ProductA
{
public:
	~ConcreteProductAY() {}

	const char* getName() { return "A-Y"; }
};

/*
 * 接口B
 */
class ProductB
{
public:
	virtual ~ProductB() {}

	virtual const char* getName() = 0;
};

class ConcreteProductBX : public ProductB
{
public:
	~ConcreteProductBX() {}

	const char* getName() { return "B-X"; }
};

class ConcreteProductBY : public ProductB
{
public:
	~ConcreteProductBY() {}

	const char* getName() { return "B-Y"; }
};

/*
 * 提供接口来创建产品家族
 */
class AbstractFactory
{
public:
	virtual ~AbstractFactory() {}

	virtual ProductA* createProductA() = 0;
	virtual ProductB* createProductB() = 0;
};

/*
 * 实际的工厂类，创建产品家族
 */
class ConcreteFactoryX : public AbstractFactory
{
public:
	~ConcreteFactoryX() {}

	ProductA* createProductA()
	{
		return new ConcreteProductAX();
	}
	ProductB* createProductB()
	{
		return new ConcreteProductBX();
	}
};

class ConcreteFactoryY : public AbstractFactory
{
public:
	~ConcreteFactoryY() {}

	ProductA* createProductA()
	{
		return new ConcreteProductAY();
	}
	ProductB* createProductB()
	{
		return new ConcreteProductBY();
	}
};


int main()
{
	// 指针指向不同的工厂类
	AbstractFactory* factoryX = new ConcreteFactoryX();
	AbstractFactory* factoryY = new ConcreteFactoryY();

	ProductA* p1 = factoryX->createProductA();
	std::cout << "Product: " << p1->getName() << std::endl;

	ProductA* p2 = factoryY->createProductA();
	std::cout << "Product: " << p2->getName() << std::endl;

	delete p1;
	delete p2;

	delete factoryX;
	delete factoryY;

	return 0;
}
```

## 原型模式

动机：在软件系统中，经常面临着“某些结构复杂的对象”的创建工作；由于需求的变化，这些对象经常面临着剧烈的变化，但是它们却拥有比较一致的接口。

模式定义：使用原型实例指定创建对象的种类，然后通过拷贝这些原型来创建新的对象。

当直接创建对象的代价比较大时，则采用这种模式。例如，一个对象需要在一个高代价的数据库操作之后被创建。我们可以缓存该对象，在下一个请求时返回它的克隆，在需要的时候更新数据库，以此来减少数据库调用。

```c++
#include <iostream>
#include <string>

/*
 * 声明克隆的接口
 */
class Prototype
{
public:
	virtual ~Prototype() {}

	virtual Prototype* clone() = 0;
	virtual std::string type() = 0;
};

// 实现克隆操作
class ConcretePrototypeA : public Prototype
{
public:
	~ConcretePrototypeA() {}

	Prototype* clone()
	{
		return new ConcretePrototypeA();
	}
	std::string type() { return "type A"; }
};

class ConcretePrototypeB : public Prototype
{
public:
	~ConcretePrototypeB() {}

	Prototype* clone()
	{
		return new ConcretePrototypeB();
	}
	std::string type() { return "type B"; }
};

class Client
{
public:
	static void init()
	{
		types[0] = new ConcretePrototypeA();
		types[1] = new ConcretePrototypeB();
	}

	static void remove()
	{
		delete types[0];
		delete types[1];
	}

	// 原型模式核心
	// 克隆原型来创建新对象
	static Prototype* make(const int index)
	{
		if (index >= n_types)
		{
			return nullptr;
		}
		return types[index]->clone();
	}

private:
	static Prototype* types[2];
	static int n_types;
};

Prototype* Client::types[2];
int Client::n_types = 2;

int main()
{
	ConcretePrototypeA a;
	Client::init();

	Prototype* prototype1 = Client::make(0);
	std::cout << "Prototype: " << prototype1->type() << std::endl;
	delete prototype1;

	Prototype* prototype2 = Client::make(1);
	std::cout << "Prototype: " << prototype2->type() << std::endl;
	delete prototype2;

	Client::remove();

	return 0;
}
```

## 构建器

动机：在软件系统中，有时候面临着“一个复杂对象”的创建工作，其通常由各个部分的子对象用一定的算法构成；由于需求的变化，这个复杂对象的各个部分经常面临着剧烈的变化，但是将它们组合在一起的算法却相对稳定。

模式定义：将一个复杂对象的构建与其表示相分离，使得同样的构建过程(稳定)可以创建不同的表示(变化)。

```c++
#include <iostream>
#include <string>

class HouseBase
{
public:
	virtual ~HouseBase() {}
	virtual std::string info() = 0;

	// 对象由多个部分组成
	std::string part1;
	std::string part2;
};

class HouseBuilder
{
protected:
	HouseBase* pHouse;

public:
	HouseBuilder(HouseBase* h) : pHouse(h) {}
	virtual ~HouseBuilder() {}

	HouseBase* getHouse() const { return pHouse; }

	// 不同方法分别构造不同部分
	virtual void buildPart1() = 0;
	virtual void buildPart2() = 0;
};

class StoneHouse : public HouseBase
{
public:
	virtual std::string info()
	{
		return "石房【" + part1 + ", " + part2 + "】";
	}
};

class StoneHouseBuilder : public HouseBuilder
{
public:
	StoneHouseBuilder() : HouseBuilder(new StoneHouse) {}

	virtual void buildPart1()
	{
		pHouse->part1 = "石砖";
	}
	virtual void buildPart2()
	{
		pHouse->part2 = "木顶";
	}
};

class HouseDirector
{
	HouseBuilder* pHouseBuilder;

public:
	HouseDirector(HouseBuilder* h) : pHouseBuilder(h) {}

	HouseBase* buildHouse()
	{
		// 通过固定的步骤建造对象
		pHouseBuilder->buildPart1();
		pHouseBuilder->buildPart2();

		return pHouseBuilder->getHouse();
	}
};


int main()
{
	HouseBuilder* builder = new StoneHouseBuilder;
	HouseDirector* director = new HouseDirector(builder);

	HouseBase* house = director->buildHouse();
	std::cout << house->info() << std::endl;

	delete house;
	delete director;
	delete builder;
	return 0;
}
```

## 单例模式

动机：在软件系统中，经常有这样一些特殊的类，必须保证它们在系统中只存在一个实例，才能确保它们的逻辑正确性以及良好的效率。

模式定义：保证一个类仅有一个实例，并提供一个该实例的全局访问点。

```c++
#include <mutex>
#include <atomic>

class Singleton
{
	Singleton(); // 私有构造，无法直接实例化
	Singleton(const Singleton& other);

	static std::mutex _mutex;
	static Singleton* m_instance;

public:
	// 线程非安全版本
	static Singleton* getInstance()
	{
		if (m_instance == nullptr)
		{
			m_instance = new Singleton();
		}
		return m_instance;
	}

	// 线程安全版本，但锁的代价过高
	static Singleton* getInstance()
	{
		std::lock_guard<std::mutex> lck(_mutex); // 加锁

		if (m_instance == nullptr) {
			m_instance = new Singleton();
		}
		return m_instance;
	}

	// 双检查锁，但由于内存读写 reorder 不安全（视频20:00左右讲到）
	// 简单地说，代码编译到汇编层级时执行顺序可能与预想不同
	// 创建实例时，可能先返回地址，再填充对象
	// Java 或 C# 可以用 volatile 关键字解决 reorder 问题
	static Singleton* getInstance()
	{
		if (m_instance == nullptr)
		{
			std::lock_guard<std::mutex> lck(_mutex); // 加锁

			if (m_instance == nullptr)
			{
				m_instance = new Singleton();
			}
		}
		return m_instance;
	}
};

// C++ 11版本之后的跨平台实现 (volatile)
// 建议使用这种方法
class SingletonLatest
{
	static std::atomic<SingletonLatest*> m_instance;
	static std::mutex m_mutex;

public:
	static SingletonLatest* getInstance()
	{
		SingletonLatest* tmp = m_instance.load(std::memory_order_relaxed);
		std::atomic_thread_fence(std::memory_order_acquire); //获取内存fence
		// 双检查锁
		if (tmp == nullptr) 
		{
			std::lock_guard<std::mutex> lck(m_mutex);
			tmp = m_instance.load(std::memory_order_relaxed);
			if (tmp == nullptr) {
				tmp = new SingletonLatest; // 不会出现 reorder
				std::atomic_thread_fence(std::memory_order_release); //释放内存fence
				m_instance.store(tmp, std::memory_order_relaxed);
			}
		}
		return tmp;
	}
};

int main() 
{
	Singleton* s = Singleton::getInstance();
	delete s;

	// 多线程建议用这种方式
	SingletonLatest* sl = SingletonLatest::getInstance();
	delete sl;

	return 0;
}
```

# 行为模式

这类模式负责对象间的高效沟通和职责委派。

## 模板方法

动机：在软件构建过程中，对于某一项任务，它常常有稳定的整体操作结构，但各个子步骤却有很多改变的需求，或者由于固有的原因（比如框架与应用之间的关系）而无法和任务的整体结构同时实现。

模式定义：定义一个操作中的算法的骨架 (稳定)，而将一些步骤延迟(变化)到子类中。Template Method使得子类可以不改变(复用)一个算法的结构即可重定义(override 重写)该算法的某些特定步骤。

```c++
class Library
{
public:
    // 有固定的执行顺序
    // 基类定义稳定的骨架，需要变化的操作交由子类实现
    void run() {
        Step1();
        if (Step2()) { //支持变化 ==> 虚函数的多态调用
            Step3();
        }
        for (int i = 0; i < 4; i++) {
            Step4(); //支持变化 ==> 虚函数的多态调用
        }
        Step5();
    }
    // 基类都应该定义虚析构
    virtual ~Library() { }

protected:
    void Step1() { }//稳定
    void Step3() { }//稳定
    void Step5() { }//稳定

    // 由子类实现具体的操作
    virtual bool Step2() = 0;//变化
    virtual void Step4() = 0; //变化
};

class Application : public Library {
protected:
    virtual bool Step2() {
        //... 子类重写实现
        return true;
    }

    virtual void Step4() {
        //... 子类重写实现
    }
};

int main() {
	// 父类指针可以指向子类
	Library* lib = new Application();
	lib->run();

	delete lib;
	return 0;
}
```

## 策略模式

动机：在软件构建过程中，某些对象使用的算法可能多种多样，经常改变，如果将这些算法都编码到对象中，将会使对象变得异常复杂；而且有时候支持不使用的算法也是一个性能负担。

比如很多 if else 语句，

```c++
if(A) {}
else if(B) {}
else if(C) {}
else if(D) {}
```

以后需求增加又要加多一些判断条件，修改原来的代码，不好。

模式定义：定义一系列算法，把它们一个个封装起来，并且使它们可互相替换（变化）。该模式使得算法可独立于使用它的客户程序(稳定)而变化（扩展，子类化）。

```c++
/**
 * Strategy 策略接口声明公共的操作
 *
 * Context 使用本接口来调用定义在具体策略类中的算法
 */
class Strategy
{
public:
    virtual ~Strategy() = default;
    virtual std::string doAlgorithm(std::string_view data) const = 0;
};

class Context
{
    /**
     * @var Strategy Context 类管理一个 Strategy 对象的引用，利用虚函数的动态绑定
	 * 来访问具体策略类的算法实现。
     */
private:
    std::unique_ptr<Strategy> strategy_;
    /**
     * Context 通常在构造函数接受 strategy 对象，同时也提供对应的 setter 函数。
     */
public:
    explicit Context(std::unique_ptr<Strategy> &&strategy = {}) : strategy_(std::move(strategy))
    {
    }
    /**
     * 通常，Context 允许在运行时替换 strategy 对象。
     */
    void set_strategy(std::unique_ptr<Strategy> &&strategy)
    {
        strategy_ = std::move(strategy);
    }
    /**
     * Context 把一些工作交给 strategy 对象完成，而不是实现不同版本的算法。
	 * 替换 strategy 对象来应用不同策略的算法。
     */
    void doSomeBusinessLogic() const
    {
        if (strategy_) {
            std::cout << "Context: Sorting data using the strategy (not sure how it'll do it)\n";
            std::string result = strategy_->doAlgorithm("aecbd");
            std::cout << result << "\n";
        } else {
            std::cout << "Context: Strategy isn't set\n";
        }
    }
};

/**
 * 具体策略类的实现。
 */
class ConcreteStrategyA : public Strategy
{
public:
    std::string doAlgorithm(std::string_view data) const override
    {
        std::string result(data);
        std::sort(std::begin(result), std::end(result));

        return result;
    }
};
class ConcreteStrategyB : public Strategy
{
    std::string doAlgorithm(std::string_view data) const override
    {
        std::string result(data);
        std::sort(std::begin(result), std::end(result), std::greater<>());

        return result;
    }
};

void clientCode()
{
	// 选择策略A
    Context context(std::make_unique<ConcreteStrategyA>());
    std::cout << "Client: Strategy is set to normal sorting.\n";
    context.doSomeBusinessLogic();
    std::cout << "\n";
    std::cout << "Client: Strategy is set to reverse sorting.\n";
	// 选择策略B
    context.set_strategy(std::make_unique<ConcreteStrategyB>());
    context.doSomeBusinessLogic();
}

int main()
{
    clientCode();
    return 0;
}
```

## 观察者模式

动机：在软件构建过程中，我们需要为某些对象建立一种“通知依赖关系” ——一个对象（目标对象）的状态发生改变，所有的依赖对象（观察者对象）都将得到通知。如果这样的依赖关系过于紧密，将使软件不能很好地抵御变化。

模式定义：定义对象间的一种一对多（变化）的依赖关系，以便当一个对象(Subject)的状态发生改变时，所有依赖于它的对象都得到通知并自动更新。

```c++
#include <iostream>
#include <vector>

class Subject;

class Observer
{
public:
	Observer(int s) : observer_state(s) {}

	int getState() { return observer_state; }

	// 更新属性
	void update(Subject* subject)
	{
		observer_state = subject->getState();
		std::cout << "Observer state updated." << std::endl;
	}

private:
	int observer_state;
};

/*
 * 存储多个 Observer 指针，当属性变化时通知他们
 */
class Subject
{
public:
	void attach(Observer* observer)
	{
		observers.push_back(observer); // 添加观察者
	}

	void detach(const int index)
	{
		observers.erase(observers.begin() + index); // 去除观察者
	}

	void notify()
	{
		for (unsigned int i = 0; i < observers.size(); i++)
		{
			observers.at(i)->update(this);
		}
	}

	int getState() { return subject_state; }

	void setState(const int s) { subject_state = s; }

private:
	std::vector<Observer*> observers;
	int subject_state;
};


int main()
{
	Observer observer1(1);
	Observer observer2(2);

	std::cout << "Observer 1 state: " << observer1.getState() << std::endl;
	std::cout << "Observer 2 state: " << observer2.getState() << std::endl;

	Subject* subject = new Subject();
	subject->attach(&observer1);
	subject->attach(&observer2);

	subject->setState(10);
	subject->notify();    // 两个观察者的属性也会改变

	std::cout << "Observer 1 state: " << observer1.getState() << std::endl;
	std::cout << "Observer 2 state: " << observer2.getState() << std::endl;

	delete subject;
	return 0;
}
```

## 中介者

动机：在软件构建过程中，经常会出现多个对象互相关联交互的情况，对象之间常常会维持一种复杂的引用关系，如果遇到一些需求的更改，这种直接的引用关系将面临不断的变化。

模式定义：**用一个中介对象来封装一系列的对象交互，中介者使各对象不需要显式地相互引用**，从而使其耦合松散，而且可以独立地改变它们之间的交互。

把对象之间的交互变成：

对象->中介类->其它对象

这种形式可以减少对象间的耦合。

```c++
#include <iostream>
#include <vector>
#include <string>

class Mediator;

class Colleague
{
public:
    Colleague(Mediator* const m, const unsigned int i) :
        mediator(m), id(i) {}

    virtual ~Colleague() {}

    unsigned int getID()
    {
        return id;
    }

    // 借由 mediator 发送消息给其他对象
    virtual void send(std::string) = 0;
    // 接受 mediator 的消息
    virtual void receive(std::string) = 0;

protected:
    Mediator* mediator;
    unsigned int id;
};

class ConcreteColleague : public Colleague
{
public:
    ConcreteColleague(Mediator* const m, const unsigned int i) :
        Colleague(m, i) {}

    ~ConcreteColleague() {}

    void send(std::string msg);

    void receive(std::string msg)
    {
        std::cout << "Message '" << msg << "' received by Colleague " << id << std::endl;
    }
};

class Mediator
{
public:
    virtual ~Mediator() {}

    virtual void add(Colleague* const c) = 0;
    virtual void distribute(Colleague* const sender, std::string msg) = 0;

protected:
    Mediator() {}
};

class ConcreteMediator : public Mediator
{
public:
    ~ConcreteMediator()
    {
        for (unsigned int i = 0; i < colleagues.size(); i++)
        {
            delete colleagues[i];
        }
        colleagues.clear();
    }

    void add(Colleague* const c)
    {
        colleagues.push_back(c);
    }

    void distribute(Colleague* const sender, std::string msg)
    {
        for (unsigned int i = 0; i < colleagues.size(); i++)
        {
            if (colleagues.at(i)->getID() != sender->getID())
            {
                colleagues.at(i)->receive(msg);
            }
        }
    }

private:
    std::vector<Colleague*> colleagues;
};

void ConcreteColleague::send(std::string msg)
{
    std::cout << "Message '" << msg << "' sent by Colleague " << id << std::endl;
    mediator->distribute(this, msg);
}


int main()
{
    Mediator* mediator = new ConcreteMediator();

    Colleague* c1 = new ConcreteColleague(mediator, 1);
    Colleague* c2 = new ConcreteColleague(mediator, 2);
    Colleague* c3 = new ConcreteColleague(mediator, 3);
    mediator->add(c1);
    mediator->add(c2);
    mediator->add(c3);

    c1->send("Hi!");
    c3->send("Hello!");

    delete mediator;
    return 0;
}
```

## 状态模式

动机：在软件构建过程中，某些对象的状态如果改变，其行为也会随之而发生变化，比如文档处于只读状态，其支持的行为和读写状态支持的行为就可能完全不同。

模式定义：允许一个对象在其内部状态改变时改变它的行为。从而使对象看起来似乎修改了其行为。

```c++
#include <iostream>
#include <vector>

class NetworkState
{
public:
	NetworkState* pNext;

	virtual void handle() = 0;
	virtual ~NetworkState() {}
};

class OpenState : public NetworkState
{
	static NetworkState* m_instance;

public:
	static NetworkState* getInstance()
	{
		if (m_instance == nullptr)
		{
			m_instance = new OpenState;
			atexit(destroy);
		}
		return m_instance;
	}

	static void destroy()
	{
		if (m_instance)
			delete m_instance;
	}

	virtual void handle();
};
NetworkState* OpenState::m_instance;

class CloseState : public NetworkState
{
	static NetworkState* m_instance;

public:
	static NetworkState* getInstance()
	{
		if (m_instance == nullptr)
		{
			m_instance = new CloseState();
			atexit(destroy);
		}
		return m_instance;
	}

	static void destroy()
	{
		if (m_instance)
			delete m_instance;
	}

	virtual void handle()
	{
		std::cout << "关闭网络连接" << std::endl;
		pNext = OpenState::getInstance();
	}
};
NetworkState* CloseState::m_instance;

void OpenState::handle()
{
	std::cout << "打开网络连接" << std::endl;
	pNext = CloseState::getInstance();
}

class NetworkProcessor
{
	NetworkState* pState;

public:
	NetworkProcessor(NetworkState* state) : pState(state) {}

	void handle()
	{
		pState->handle();
		pState = pState->pNext; // 自动切换状态
	}
};

int main()
{
	NetworkProcessor n(OpenState::getInstance());
	n.handle();
	n.handle(); // 状态切换后处理函数也会变化
	n.handle();

	return 0;
}
```

## 备忘录

动机：在软件构建过程中，某些对象的状态在转换过程中，可能由于某种需要，要求程序能够回溯到对象之前处于某个点时的状态。如果使用一些公有接口来让其他对象得到对象的状态，便会暴露对象的细节实现。

模式定义：在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态。这样以后就可以将该对象恢复到原先保存的状态。

Java、C#等已经由序列化支持，效率更高。

```c++
#include <iostream>
#include <vector>

 /*
  * Memento
  * stores internal state of the Originator object and protects
  * against access by objects other than the originator
  */
class Memento
{
private:
    // accessible only to Originator
    friend class Originator;

    Memento(const int s) : state(s) {}

    void setState(const int s)
    {
        state = s;
    }

    int getState()
    {
        return state;
    }
    // ...

private:
    int state;
    // ...
};

/*
 * Originator
 * creates a memento containing a snapshot of its current internal
 * state and uses the memento to restore its internal state
 */
class Originator
{
public:
    // implemented only for printing purpose
    void setState(const int s)
    {
        std::cout << "Set state to " << s << "." << std::endl;
        state = s;
    }

    // implemented only for printing purpose
    int getState()
    {
        return state;
    }

    void setMemento(Memento* const m)
    {
        state = m->getState();
    }

    Memento* createMemento()
    {
        return new Memento(state);
    }

private:
    int state;
    // ...
};

/*
 * CareTaker
 * is responsible for the memento's safe keeping
 */
class CareTaker
{
public:
    CareTaker(Originator* const o) : originator(o) {}

    ~CareTaker()
    {
        for (unsigned int i = 0; i < history.size(); i++)
        {
            delete history.at(i);
        }
        history.clear();
    }

    void save()
    {
        std::cout << "Save state." << std::endl;
        history.push_back(originator->createMemento());
    }

    void undo()
    {
        if (history.empty())
        {
            std::cout << "Unable to undo state." << std::endl;
            return;
        }

        Memento* m = history.back();
        originator->setMemento(m);
        std::cout << "Undo state." << std::endl;

        history.pop_back();
        delete m;
    }
    // ...

private:
    Originator* originator;
    std::vector<Memento*> history;
    // ...
};


int main()
{
    Originator* originator = new Originator();
    CareTaker* caretaker = new CareTaker(originator);

    originator->setState(1);
    caretaker->save();

    originator->setState(2);
    caretaker->save();

    originator->setState(3);
    caretaker->undo();

    std::cout << "Actual state is " << originator->getState() << "." << std::endl;

    delete originator;
    delete caretaker;

    return 0;
}
```

## 迭代器

动机：在软件构建过程中，集合对象内部结构常常变化各异。但对于这些集合对象，我们希望在不暴露其内部结构的同时，可以让外部客户代码透明地访问其中包含的元素；同时这种“透明遍历”也为“同一种算法在多种集合对象上进行操作”提供了可能。

模式定义：提供一种方法顺序访问一个聚合对象中各个元素, 而又无须暴露该对象的内部表示。

STL 是使用模板实现地迭代器，更好一点。通过类来实现的迭代器模式由于使用虚函数，在循环过程中会多次访问虚函数表，性能上就不好。

```c++
#include <iostream>
#include <stdexcept>

class Iterator;
class ConcreteAggregate;

/*
 * Aggregate
 * defines an interface for aggregates and it decouples your
 * client from the implementation of your collection of objects
 */
class Aggregate
{
public:
    virtual ~Aggregate() {}

    virtual Iterator* createIterator() = 0;
    // ...
};

/*
 * Concrete Aggregate
 * has a collection of objects and implements the method
 * that returns an Iterator for its collection
 *
 */
class ConcreteAggregate : public Aggregate
{
public:
    ConcreteAggregate(const unsigned int size)
    {
        list = new int[size]();
        count = size;
    }

    ~ConcreteAggregate()
    {
        delete[] list;
    }

    Iterator* createIterator();

    unsigned int size() const
    {
        return count;
    }

    int at(unsigned int index)
    {
        return list[index];
    }
    // ...

private:
    int* list;
    unsigned int count;
    // ...
};

/*
 * Iterator
 * provides the interface that all iterators must implement and
 * a set of methods for traversing over elements
 */
class Iterator
{
public:
    virtual ~Iterator() { /* ... */ }

    virtual void first() = 0;
    virtual void next() = 0;
    virtual bool isDone() const = 0;
    virtual int currentItem() const = 0;
    // ...
};

/*
 * Concrete Iterator
 * implements the interface and is responsible for managing
 * the current position of the iterator
 */
class ConcreteIterator : public Iterator
{
public:
    ConcreteIterator(ConcreteAggregate* l) :
        list(l), index(0) {}

    ~ConcreteIterator() {}

    void first()
    {
        index = 0;
    }

    void next()
    {
        index++;
    }

    bool isDone() const
    {
        return (index >= list->size());
    }

    int currentItem() const
    {
        if (isDone())
        {
            return -1;
        }
        return list->at(index);
    }
    // ...

private:
    ConcreteAggregate* list;
    unsigned int index;
    // ...
};

Iterator* ConcreteAggregate::createIterator()
{
    return new ConcreteIterator(this);
}


int main()
{
    unsigned int size = 5;
    ConcreteAggregate list = ConcreteAggregate(size);

    Iterator* it = list.createIterator();
    for (; !it->isDone(); it->next())
    {
        std::cout << "Item value: " << it->currentItem() << std::endl;
    }

    delete it;
    return 0;
}
```

## 职责链

动机：在软件构建过程中，一个请求可能被多个对象处理，但是每个请求在运行时只能有一个接受者，如果显式指定，将必不可少地带来请求发送者与接受者的紧耦合。

模式定义：避免请求发送者与接收者耦合在一起，让多个对象都有可能接收请求，将这些对象连接成一条链，并且沿着这条链传递请求，直到有对象处理它为止。

顾名思义，责任链模式为请求创建了一个接收者对象的链。在这种模式中，通常每个接收者都包含对另一个接收者的引用。如果一个对象不能处理该请求，那么它会把相同的请求传给下一个接收者，依此类推。

```c++
#include <iostream>

class Handler
{
public:
	virtual ~Handler() {}

	virtual void setHandler(Handler* s)
	{
		successor = s;
	}

	virtual void handleRequest()
	{
		// 默认是直接由接替者处理
		if (successor != 0)
		{
			successor->handleRequest();
		}
	}

private:
	Handler* successor; // 接替者
};

class ConcreteHandler1 : public Handler
{
public:
	~ConcreteHandler1() {}

	bool canHandle()
	{
		return false;
	}

	virtual void handleRequest()
	{
		// 重写请求处理函数
		// 当前类无法处理时再交给父类
		if (canHandle())
		{
			std::cout << "Handled by Concrete Handler 1" << std::endl;
		}
		else
		{
			std::cout << "Cannot be handled by Handler 1" << std::endl;
			Handler::handleRequest(); // 交由父类（即接替者）处理
		}
	}
};

class ConcreteHandler2 : public Handler
{
public:
	~ConcreteHandler2() {}

	bool canHandle()
	{
		return true;
	}

	virtual void handleRequest()
	{
		if (canHandle())
		{
			std::cout << "Handled by Handler 2" << std::endl;
		}
		else
		{
			std::cout << "Cannot be handled by Handler 2" << std::endl;
			Handler::handleRequest();
		}
	}
};


int main()
{
	ConcreteHandler1 handler1;
	ConcreteHandler2 handler2;

	handler1.setHandler(&handler2);
	handler1.handleRequest();

	return 0;
}
```

## 命令模式

动机：在软件构建过程中，“行为请求者”与“行为实现者”通常呈现一种“紧耦合”。但在某些场合——比如需要对行为进行“记录、撤销、重做、事务”等处理，这种无法抵御变化的紧耦合是不合适的。

模式定义：将一个请求封装成一个对象，从而使您可以用不同的请求对客户进行参数化。对请求排队或记录请求日志，以及支持可撤销的操作。

请求以命令的形式包裹在对象中，并传给调用对象。调用对象寻找可以处理该命令的合适的对象，并把该命令传给相应的对象，该对象执行命令。

C++ 的函数对象与命令模式类似，而且性能更高，命令模式用得少。

```c++
#include <iostream>

 /*
  * Receiver
  * knows how to perform the operations associated
  * with carrying out a request
  */
class Receiver
{
public:
    void action()
    {
        std::cout << "Receiver: execute action" << std::endl;
    }
};

/*
 * Command
 * declares an interface for all commands
 */
class Command
{
public:
    virtual ~Command() {}
    virtual void execute() = 0;

protected:
    Command() {}
};

/*
 * Concrete Command
 * implements execute by invoking the corresponding
 * operation(s) on Receiver
 */
class ConcreteCommand : public Command
{
public:
    ConcreteCommand(Receiver* r) : receiver(r) {}

    ~ConcreteCommand()
    {
        if (receiver)
        {
            delete receiver;
        }
    }

    void execute()
    {
        receiver->action();
    }

private:
    Receiver* receiver;
};

/*
 * Invoker
 * asks the command to carry out the request
 */
class Invoker
{
public:
    void set(Command* c)
    {
        command = c;
    }

    void confirm()
    {
        if (command)
        {
            command->execute();
        }
    }

private:
    Command* command;
};


int main()
{
    ConcreteCommand command(new Receiver());

    Invoker invoker;
    invoker.set(&command);
    invoker.confirm();

    return 0;
}
```

## 访问器

动机：在软件构建过程中，由于需求的改变，某些类层次结构中常常需要增加新的行为（方法），如果直接在基类中做这样的更改，将会给子类带来很繁重的变更负担，甚至破坏原有设计。

模式定义：表示一个作用于某对象结构中的各元素的操作。使得可以在不改变各元素的类的前提下扩展作用于这些元素的新操作。

```c++
#include <iostream>

class Element;
class ConcreteElementA;
class ConcreteElementB;

/*
 * Visitor
 * declares a Visit operation for each class of ConcreteElement
 * in the object structure
 */
class Visitor
{
public:
    virtual ~Visitor() {}

    virtual void visitElementA(ConcreteElementA* const element) = 0;
    virtual void visitElementB(ConcreteElementB* const element) = 0;
};

/*
 * Concrete Visitors
 * implement each operation declared by Visitor, which implement
 * a fragment of the algorithm defined for the corresponding class
 * of object in the structure
 */
class ConcreteVisitor1 : public Visitor
{
public:
    ~ConcreteVisitor1() {}

    void visitElementA(ConcreteElementA* const)
    {
        std::cout << "Concrete Visitor 1: Element A visited." << std::endl;
    }

    void visitElementB(ConcreteElementB* const)
    {
        std::cout << "Concrete Visitor 1: Element B visited." << std::endl;
    }
};

class ConcreteVisitor2 : public Visitor
{
public:
    ~ConcreteVisitor2() {}

    void visitElementA(ConcreteElementA* const)
    {
        std::cout << "Concrete Visitor 2: Element A visited." << std::endl;
    }

    void visitElementB(ConcreteElementB* const)
    {
        std::cout << "Concrete Visitor 2: Element B visited." << std::endl;
    }
};

/*
 * Element
 * defines an accept operation that takes a visitor as an argument
 */
class Element
{
public:
    virtual ~Element() {}

    // 传入不同的 visitor 会有不同的处理
    virtual void accept(Visitor& visitor) = 0;
};

/*
 * Concrete Elements
 * implement an accept operation that takes a visitor as an argument
 */
class ConcreteElementA : public Element
{
public:
    ~ConcreteElementA() {}

    void accept(Visitor& visitor)
    {
        visitor.visitElementA(this);
    }
};

class ConcreteElementB : public Element
{
public:
    ~ConcreteElementB() {}

    void accept(Visitor& visitor)
    {
        visitor.visitElementB(this);
    }
};


int main()
{
    ConcreteElementA elementA;
    ConcreteElementB elementB;

    ConcreteVisitor1 visitor1;
    ConcreteVisitor2 visitor2;

    // 访问者模式的重点就在于 Element 的类比较稳定
    // 如果要增加对 elementA 的操作，不是在 ConcreteElementA 类增加成员函数，
    // 而是新增一个 Visitor 类并重写 visitElementA 方法
    elementA.accept(visitor1);
    elementA.accept(visitor2);
    // elementA.accept(visitor3)

    elementB.accept(visitor1);
    elementB.accept(visitor2);

    return 0;
}
```

## 解析器

动机：在软件构建过程中，如果某一特定领域的问题比较复杂，类似的结构不断重复出现，如果使用普通的编程方式来实现将面临非常频繁的变化。

模式定义：给定一个语言，定义它的文法表示，并定义一个解释器，这个解释器使用该标识来解释语言中的句子。

```c++
#include <iostream>
#include <map>

/*
 * Context
 * contains information that's global to the interpreter
 */
class Context
{
public:
	void set(const std::string& var, const bool value)
	{
		vars.insert(std::pair<std::string, bool>(var, value));
	}

	bool get(const std::string& exp)
	{
		return vars[exp];
	}

private:
	std::map<std::string, bool> vars;
};

/*
 * Abstract Expression
 * declares an abstract Interpret operation that is common to all nodes
 * in the abstract syntax tree
 */
class AbstractExpression
{
public:
	virtual ~AbstractExpression() {}

	virtual bool interpret(Context* const)
	{
		return false;
	}
};

/*
 * Terminal Expression
 * implements an Interpret operation associated with terminal symbols
 * in the grammar (an instance is required for every terminal symbol
 * in a sentence)
 */
class TerminalExpression : public AbstractExpression
{
public:
	TerminalExpression(const std::string& val) : value(val) {}

	~TerminalExpression() {}

	bool interpret(Context* const context)
	{
		return context->get(value);
	}

private:
	std::string value;
};

/*
 * Nonterminal Expression
 * implements an Interpret operation for nonterminal symbols
 * in the grammar (one such class is required for every rule in the grammar)
 */
class NonterminalExpression : public AbstractExpression
{
public:
	NonterminalExpression(AbstractExpression* left, AbstractExpression* right) :
		lop(left), rop(right) {}

	~NonterminalExpression()
	{
		delete lop;
		delete rop;
	}

	bool interpret(Context* const context)
	{
		return lop->interpret(context) && rop->interpret(context);
	}

private:
	AbstractExpression* lop;
	AbstractExpression* rop;
};


int main()
{
	// An example of very simple expression tree
	// that corresponds to expression (A AND B)
	AbstractExpression* A = new TerminalExpression("A");
	AbstractExpression* B = new TerminalExpression("B");
	AbstractExpression* exp = new NonterminalExpression(A, B);

	Context context;
	context.set("A", true);
	context.set("B", false);

	std::cout << context.get("A") << " AND " << context.get("B");
	std::cout << " = " << exp->interpret(&context) << std::endl;

	delete exp;
	return 0;
}
```

# 结构型模式

## 适配器

动机：在软件系统中，由于应用环境的变化，常常需要将“一些现存的对象”放在新的环境中应用，但是新环境要求的接口是这些现存对象所不满足的。

模式定义：将一个类的接口转换成客户希望的另外一个接口。适配器模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。

```c++
#include <iostream>

class Target
{
public:
	virtual ~Target() {}

	virtual void request() = 0;
};

class Adaptee
{
public:
	void specificRequest()
	{
		std::cout << "specific request" << std::endl;
	}
};

class Adapter : public Target
{
public:
	Adapter() : adaptee() {}

	~Adapter()
	{
		delete adaptee;
	}

	// 核心部分
	void request()
	{
		adaptee->specificRequest();
	}

private:
	Adaptee* adaptee;
};


int main()
{
	Target* t = new Adapter();
	t->request();
	delete t;

	return 0;
}
```

## 桥模式

动机：由于某些类型的固有的实现逻辑，使得它们具有两个变化的维度，乃至多个纬度的变化。比如，笔记本有品牌、类型等多个维度，将品牌、类型分别做一个类，在笔记本类中再进行组合。

模式定义：将抽象部分(业务功能)与实现部分(平台实现)分离，使它们都可以独立地变化。防止定义过多的子类。

核心就是将变化的维度分开来，然后在想要具体的某一个类时组装起来。

```c++
// 参考 https://www.cnblogs.com/OfflineBoy/p/15311115.html

#include <iostream>

//品牌
class Brand
{
public:
	virtual void info() = 0;
};

class AppleBrand : public Brand
{
public:
	virtual void info()
	{
		std::cout << "苹果牌";
	}
};

class AsusBrand : public Brand
{
public:
	virtual void info()
	{
		std::cout << "华硕牌";
	}
};

// 抽象的电脑类，子类扩展为类型维度（笔记本或台式机），再组合品牌维度
class Computer
{
protected:
	virtual void info() = 0;

	Brand* brand;

public:
	Computer(Brand* b) : brand(b) {}

	virtual ~Computer()
	{
		delete brand;
	}

	void detail()
	{
		brand->info();
		info();
		std::cout << std::endl;
	}
};

class Desktop : public Computer
{
public:
	Desktop(Brand* brand) : Computer(brand) {}

protected:
	virtual void info()
	{
		std::cout << "台式机";
	}
};

class Laptop : public Computer
{
public:
	Laptop(Brand* brand) : Computer(brand) {}

protected:
	virtual void info()
	{
		std::cout << "笔记本";
	}
};

int main()
{
	// Desktop + AppleBrand
	Desktop appleDesktop(new AppleBrand);
	appleDesktop.detail();

	// Laptop + AsusBrand
	Laptop asusLaptop(new AsusBrand);
	asusLaptop.detail();

	return 0;
}
```

## 组合模式

动机：软件在某些情况下，客户代码过多地依赖与对象容器复杂的内部实现结构，对象容器内部实现结构的变化将引起客户代码的频繁变化，带来了代码的维护性、扩展性等弊端。

模式定义：将对象组合成树形结构以表示"部分-整体"的层次结构。组合模式使得用户**对单个对象和组合对象的使用具有一致性**。

```c++
#include <iostream>
#include <vector>

 /*
  * Component
  * defines an interface for all objects in the composition
  * both the composite and the leaf nodes
  */
class Component
{
public:
	virtual ~Component() {}

	virtual Component* getChild(int)
	{
		return 0;
	}

	virtual void add(Component*) { /* ... */ }
	virtual void remove(int) { /* ... */ }

	virtual void operation() = 0;
};

/*
 * Composite 组合对象
 * defines behavior of the components having children
 * and store child components
 */
class Composite : public Component
{
public:
	~Composite()
	{
		for (unsigned int i = 0; i < children.size(); i++)
		{
			delete children[i];
		}
	}

	Component* getChild(const unsigned int index)
	{
		return children[index];
	}

	void add(Component* component)
	{
		children.push_back(component);
	}

	void remove(const unsigned int index)
	{
		Component* child = children[index];
		children.erase(children.begin() + index);
		delete child;
	}

	void operation()
	{
		for (unsigned int i = 0; i < children.size(); i++)
		{
			children[i]->operation();
		}
	}

private:
	std::vector<Component*> children;
};

/*
 * 单个对象和组合对象都继承Component，有一致的接口
 */
class Leaf : public Component
{
public:
	Leaf(const int i) : id(i) {}

	~Leaf() {}

	void operation()
	{
		std::cout << "Leaf " << id << " operation" << std::endl;
	}

private:
	int id;
};


int main()
{
	Composite composite;

	for (unsigned int i = 0; i < 5; i++)
	{
		composite.add(new Leaf(i));
	}

	composite.remove(0);
	composite.operation();

	return 0;
}
```

## 装饰模式

动机：在某些情况下我们可能会“过度地使用继承来扩展对象的功能”，由于继承为类型引入的静态特质，使得这种扩展方式缺乏灵活性；并且随着子类的增多（扩展功能的增多），各种子类的组合（扩展功能的组合）会导致更多子类的膨胀。

模式定义：动态（组合）地给一个对象增加一些额外的职责。就增加功能而言，Decorator模式比生成子类（继承）更为灵活（消除重复代码 & 减少子类个数）。

```c++
#include <iostream>

class Component
{
public:
	virtual ~Component() {}

	virtual void operation()
	{
		std::cout << "Component operation" << std::endl;
	}
};

/*
 * 装饰基类，通过 Component 的指针来调用其接口
 */
class Decorator : public Component
{
public:
	~Decorator() {}

	Decorator(Component* c) : component(c) {}

	virtual void operation()
	{
		component->operation();
	}

private:
	Component* component;
};

/*
 * 实际的装饰类，在原本的操作上添加额外的职责（操作）
 */
class ConcreteDecoratorA : public Decorator
{
public:
	ConcreteDecoratorA(Component* c) : Decorator(c) {}

	void operation()
	{
		Decorator::operation();
		std::cout << "Decorator A" << std::endl; // 额外的操作
	}
};

class ConcreteDecoratorB : public Decorator
{
public:
	ConcreteDecoratorB(Component* c) : Decorator(c) {}

	void operation()
	{
		Decorator::operation();
		std::cout << "Decorator B" << std::endl; // 额外的操作
	}
};


int main()
{
	Component* cc = new Component();
	ConcreteDecoratorB* db = new ConcreteDecoratorB(cc);
	ConcreteDecoratorA* da = new ConcreteDecoratorA(db);

	da->operation();

	delete da;
	delete db;
	delete cc;

	return 0;
}
```

## 门面模式/外观模式

动机：外部客户程序和子系统有过多的耦合，会面临很多变化的挑战。需要简化交互接口。

模式定义：为子系统中的一组接口提供一个一致（稳定）的界面，定义一个高层接口，这个接口使得这一子系统更加容易使用（复用）。

```c++
#include <iostream>

 /*
  * Subsystems
  * implement more complex subsystem functionality
  * and have no knowledge of the facade
  */
class SubsystemA
{
public:
    void suboperation()
    {
        std::cout << "Subsystem A method" << std::endl;
    }
};

class SubsystemB
{
public:
    void suboperation()
    {
        std::cout << "Subsystem B method" << std::endl;
    }
};

class SubsystemC
{
public:
    void suboperation()
    {
        std::cout << "Subsystem C method" << std::endl;
    }
};

/*
 * 客户不直接使用子系统，而是通过这个类的接口来调用
 */
class Facade
{
public:
    Facade() : subsystemA(), subsystemB(), subsystemC() {}
    ~Facade()
    {
        delete subsystemA;
        delete subsystemB;
        delete subsystemC;
    }

    // 定义接口使得对子系统的调用更方便
    void operation1()
    {
        subsystemA->suboperation();
        subsystemB->suboperation();
    }

    void operation2()
    {
        subsystemC->suboperation();
    }

private:
    SubsystemA* subsystemA;
    SubsystemB* subsystemB;
    SubsystemC* subsystemC;
};


int main()
{
    Facade* facade = new Facade();

    facade->operation1();
    facade->operation2();
    delete facade;

    return 0;
}
```

## 享元模式（Flyweight Pattern）

动机：在软件系统采用纯粹对象方案的问题在于大量细粒度的对象会很快充斥在系统中，从而带来很高的运行时代价——主要指内存需求方面的代价。

模式定义：运用共享技术有效地支持大量细粒度的对象。

```c++
#include <iostream>
#include <map>

class Flyweight
{
public:
	virtual ~Flyweight() {}
	virtual void operation() = 0;
};

class ConcreteFlyweight : public Flyweight
{
public:
	ConcreteFlyweight(const int all_state) : state(all_state) {}

	~ConcreteFlyweight() {}

	void operation()
	{
		std::cout << "Concrete Flyweight with state " << state << std::endl;
	}

private:
	int state;
};

/*
 * FlyweightFactory
 * creates and manages flyweight objects and ensures
 * that flyweights are shared properly
 */
class FlyweightFactory
{
public:
	~FlyweightFactory()
	{
		for (auto it = flies.begin(); it != flies.end(); it++)
		{
			delete it->second;
		}
		flies.clear();
	}

	// 调用这个方法来创建对象
	// 把对象保存起来，每次都先查找是否已经创建过
	Flyweight* getFlyweight(const int key)
	{
		if (flies.find(key) != flies.end())
		{
			return flies[key];
		}
		Flyweight* fly = new ConcreteFlyweight(key);
		flies.insert(std::pair<int, Flyweight*>(key, fly));
		return fly;
	}

private:
	// 保存创建过的对象
	std::map<int, Flyweight*> flies;
};


int main()
{
	FlyweightFactory* factory = new FlyweightFactory;
	factory->getFlyweight(1)->operation();
	factory->getFlyweight(2)->operation();
	delete factory;
	return 0;
}
```

## 代理模式

动机：在面向对象系统中，有些对象由于某些原因（比如对象创建的开销很大，或者某些操作需要安全控制，或者需要进程外的访问等），直接访问会给使用者或者系统结构带来很多麻烦。增加一层间接层是常见的解决方式。

模式定义：为其他对象提供一种代理以控制（隔离，使用接口）对这个对象的访问。

主要解决：在直接访问对象时带来的问题，比如说：要访问的对象在远程的机器上。

```c++
#include <iostream>

class Subject
{
public:
	virtual ~Subject() { /* ... */ }

	virtual void request() = 0;
};

class RealSubject : public Subject
{
public:
	void request()
	{
		std::cout << "Real Subject request" << std::endl;
	}
};

class Proxy : public Subject
{
public:
	Proxy()
	{
		// 代理模式帮助我们创建对象
		// 代理类提供方法来访问这个对象
		subject = new RealSubject();
	}

	~Proxy()
	{
		delete subject;
	}

	void request()
	{
		subject->request();
	}

private:
	// 直接创建或访问对象比较麻烦时，代理类才有用
	RealSubject* subject;
};


int main()
{
	Proxy* proxy = new Proxy();
	proxy->request();

	delete proxy;
	return 0;
}
```
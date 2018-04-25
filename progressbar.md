## ExtendScript开发--PhotoShop中使用progress bar

代码基于**PhotoShop CC 2017**

目前我查到的ExtendScript中关于进度条的方案有下面几种：

1. `app.doProgress()`系列方法
2. 直接使用Script UI中的Progressbar

### app.doProgress

1. 要配合`app.refresh()`方法使用，否则进度条一直卡主无法动态更新。可以参考[这里](http://nullice.com/archives/1790)
	
	```
	app.doProgress("已经完成 0/10 了哟！","task()")

	function task(){
    	for( var i=1;i<10; i++)
    	{
        	updateProgress(i, 10);
        	changeProgressText("已经完成 " + i + " / 10 了哟！")
        	app.refresh();//刷新界面，这会让脚步运行速度大大降低，尽量减少频率
    	}
	}
	```
2. app.doProgress与action manager的代码有兼容问题，亲测确实会影响一些代码的运行。代码比较复杂时无法使用

### Progressbar

1. 建议使用`palette`类型的window构建防止progressbar的窗口
	
	因为`dialog`类型的windw在执行了`window.show();`方法后，程序会卡住，后面的代码没办法执行。我想到的唯一能让程序在`show()`之后执行的办法是，在window中添加一些点击事件，以此来触发某些代码执行。但对于进度条来说，体验并不好。
	
	`palette`类型window的好处就是`show`之后的代码仍能执行，官方虽说ps不支持`palette`类型的window，但仍有办法在ps中执行。其实打断点仔细查看`palette`window，ps中并不是不支持，而是显示后立马就消失。有两种办法让`palette`window一直显示：
	- 使用BridgeTalk向ps发送创建`palette`window的消息，具体可参考[这里](http://www.davidebarranca.com/2012/11/scriptui-bridgetalk-persistent-window-examples/)
	- 直接创建`palette`window，后面执行比较耗时间的代码，只要代码不结束，window会一直存在

	因为使用`BridgeTalk`的方式必须将创建progressbar等后续逻辑都转为字符串类型的消息，用起来很麻烦。我们选择第二种，比较简单的方式

2. 如何让progressbar动态刷新

	针对**PhotoShop CC 2017**，我查了很多动态刷新progressbar的资料，经过尝试，总是摆脱不了`app.refresh()`，否则progressbar会卡住。但这句代码很耗时间，感觉每执行一次至少1秒，所以不建议插入太多更新点。
	
	还有一点需要注意，关闭进度条时，只进行`window.close()`是不够的，虽然窗口关闭了，但切换到其他应用再切回ps时，进度条窗口就又出现了，我们需要将`window=null;`才可以。
	
	`progressbar.jsx`文件对应进度条的实现，该部分代码参考了adobe社区中牛人**DBarranca**，[地址](https://forums.adobe.com/thread/1307400)
	
	使用代码如下：
	
	```
	//title	//message	//maxvalue	//hasCancelButton	var progressbar = new createProgressWindow("我是进度条", "不要着急，快结束了", 10,  false);	for (var i = 1; i <= 10; i++) {    	progressbar.updateProgress(i);//该句代码中执行了app.refresh();	}
	```
	


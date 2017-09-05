抱歉本机没有关系型数据库环境，再者个人对关系型数据库数量度不高，因此本次demo仍然使用mongodb

第一个API
http://localhost:3000/start-level?level=2?uid=1000
两个参数
level是关卡等级
uid是角色id

第二个API
http://localhost:3000/move?sessionId=4e9cdde7d4d461fe43bd4d7b9e9af7ef&row0=0&col0=1&row1=0&col1=2

提交中包含了node_modules，因此在mac环境下应该不需要再npm install

mongodb版本3.0.0

node版本v4.7.1

根目录下执行node app.js启动服务器

可以传递启动端口，启动多个服务，这样就可以通过nginx做负载均衡


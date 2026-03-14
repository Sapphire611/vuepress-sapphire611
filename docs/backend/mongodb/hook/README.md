---
title: Mongodb hook
date: 2023-08-29
categories:
  - Backend
tags:
  - mongodb
sidebar: 'auto'
publish: true
---

:::tip
ORM: Mongoose

Reference: https://mongoosejs.com/docs/middleware.html

代码可以复制到本地，安装依赖后直接运行～
:::

## 1. 前言

> MongoDB 的 Hook 监听是一种在数据库操作前后执行自定义逻辑的功能,
> 例如在插入数据前对数据进行加工, 在删除数据后对数据进行清理等等

> 其中 preHook 代表在操作前执行, postHook 代表在操作后执行

:::tip
👀 适用场景

1. 安全性控制：您可以使用 MongoDB Hook 来实现安全性控制，例如在查询或更新操作前验证用户的权限。
2. 数据转换和格式化：您可以在 MongoDB Hook 中编写代码，将数据进行格式化或转换，以满足应用程序的需求。
3. 审计日志：通过使用 MongoDB Hook，您可以记录数据库操作的相关信息、类型、执行时间和结果等。
4. 扩展索引：您可以使用 MongoDB Hook 创建自定义索引，以满足特定的查询需求。
5. 数据填充和修正：在插入或更新操作后，可以添加额外的逻辑，例如填充默认值、执行校验等。
   :::

---

### 示例 1 简单使用

```js
const mongoose = require('mongoose');

// 连接MongoDB数据库
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 定义User模型
const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

// 定义prehook
UserSchema.pre('save', function (next) {
  // 在保存文档之前执行一些操作，例如生成唯一的ID或添加时间戳等
  console.log('Pre-save hook called');
  next();
});

// 定义posthook
UserSchema.post('save', function (doc) {
  // 在保存文档之后执行一些操作，例如发送邮件或记录日志等
  console.log('Post-save hook called');
  // 这里不需要next()
});

const User = mongoose.model('User', UserSchema);

// 创建一个新User并保存
const newUser = new User({
  name: 'John Doe',
  age: 30,
});

newUser.save();
```

输出:

```js
Pre-save hook called
Post-save hook called
```

---

:::tip
👀 在上面的代码中，我们定义了一个 User 模型，并在其上定义了两个钩子：一个 prehook 和一个 posthook。
prehook 将在保存文档之前调用，而 posthook 将在保存文档之后调用。
我们可以在 prehook 中执行一些前置逻辑，在 posthook 中执行一些后置逻辑，
创建新的实例并保存到数据库中时，会同时触发钩子函数。
:::

### 示例 2 检查 Booking 的开始结束时间

> 假设有一个预订，创建预订的时候需要保证数据满足: beginAt < endAt （会议开始时间必须小于会议结束时间）

```js
const mongoose = require('mongoose');

// 连接MongoDB数据库
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 定义User模型
const BookingSchema = new mongoose.Schema({
  name: String,
  beginAt: Number,
  endAt: Number,
});

// 定义prehook
BookingSchema.pre('save', function (next) {
  // console.log(this)
  // 如果beginAt大于endAt，则报错
  if (this.beginAt > this.endAt) {
    next(new Error('beginAt must be less than endAt'));
    // 或者：throw Error('beginAt must be less than endAt')
  } else {
    next();
  }
});

const Booking = mongoose.model('Booking', BookingSchema);

// 创建一个新Booking并保存
const booking = new Booking({
  name: 'booking',
  beginAt: 321,
  endAt: 123,
});

booking.save();
```

> 👀 以上代码可以运行，预期结果是抛出 beginAt must be less than endAt 的错误

### \* Post middleware 对应执行顺序

- 挂钩方法后，中间件将执行，在其所有 pre 中间件都已完成后，文档已创建，会继续执行 post 中间件的 hook

> post middleware are executed after the hooked method and all of its pre middleware have completed.

:::tip
下面代码中，执行顺序为： init >> validate >> save

- init 文档刚被初始化
- validate 校验数据是否符合 schema 定义
- save 文档被保存至数据库中
  :::

```js
schema.post('init', function (doc) {
  console.log('%s has been initialized from the db', doc._id);
});
schema.post('validate', function (doc) {
  console.log('%s has been validated (but not saved yet)', doc._id);
});
schema.post('save', function (doc) {
  console.log('%s has been saved', doc._id);
});
```

---

## 2. Hook Tips

### 2.1 Hook Early Return

> 如果使用 next()，则 next()调用不会停止中间件函数中剩余的代码执行。
> 使用早期返回模式可以在调用 next()时防止中间件函数中剩余的代码继续执行。

```js
const schema = new Schema({});
schema.pre('save', function (next) {
  if (foo()) {
    console.log('calling next!');
    return next();
  }
  // 如果正常使用next(),该注释之后的代码也会继续执行
  // do something ...
});
```

### 2.2 This 关键字

> 可以通过 this 关键字来访问 Query 和 Update 的内容

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mySchema = new Schema({
  name: String,
  age: Number,
});

mySchema.pre('findOneAndUpdate', function (next) {
  // Accessing the query content:
  const query = this.getQuery();
  console.log('Query:', query);

  // Accessing the update content:
  const update = this.getUpdate();
  console.log('Update:', update);

  // Continue the hook chain:
  next();

  // this.setUpdate()?
});

const MyModel = mongoose.model('MyModel', mySchema);

// Assuming you have a document with name "John" and age 30 in the collection
MyModel.findOneAndUpdate({ name: 'John' }, { age: 31 }, (err, doc) => {
  // Document updated here
});
```

:::tip
👀 我们创建了一个 Mongoose 模型 MyModel，并为其定义了一个 findOneAndUpdate 的 pre hook。在 pre hook 的回调函数中，我们使用 this.getQuery() 和 this.getUpdate() 方法来访问查询条件和更新内容。

需要注意的是，hook 中的 this 关键字指向当前的 Mongoose Query 对象。因此，在 pre hook 中可以使用 this.getQuery() 和 this.getUpdate() 来访问查询条件和更新内容。
:::

---

## 3. 🪝 远程 Trigger 和 本地 hook 的区别

> MongoDB 中的钩子（Hooks）是在数据库操作期间触发的回调函数。它们可以用于在特定事件发生时执行自定义逻辑，例如在插入、更新或删除文档之前或之后执行某些操作。

钩子可以在本地或远程使用，具体取决于应用程序的架构和需求。

无论是本地还是远程，钩子函数都与数据库操作在同一进程中执行。

- 在本地钩子的情况下，钩子函数被定义在应用程序的代码中，直接与 MongoDB 数据库进行交互。这意味着钩子函数的执行发生在应用程序的同一进程中，不涉及网络通信。

- 在远程钩子的情况下，钩子函数被定义在 MongoDB 服务器上，它们是作为数据库触发器（triggers）的一部分运行的。当特定事件发生时，服务器会触发相应的钩子函数，执行预定义的逻辑。远程钩子通常与 MongoDB Realm 或其他类似的服务器端框架一起使用。

### 4.1 MongoDB Atlas

> ongoDB Atlas 是 MongoDB 公司提供的云数据库服务。
> 它是基于云平台的全托管数据库服务，用于部署、管理和扩展 MongoDB 数据库。
> 👀 注册后，一个账号可以创建一个免费的云数据库，但会过期，正常使用得加钱 💰

https://www.mongodb.com/cloud/atlas/register

### 4.2 Trigger 配置界面

> Operation Type : Insert,Update,Delete,Replace
> This trigger will only execute on these operations.
> Trigger 的配置需要在页面上完成

### 4.3 Trigger ☁️ 云函数配置模版

```js
exports = function (changeEvent) {
  /*
    A Database Trigger will always call a function with a changeEvent.
    Documentation on ChangeEvents: https://docs.mongodb.com/manual/reference/change-events/

    Access the _id of the changed document:
    const docId = changeEvent.documentKey._id;

    Access the latest version of the changed document
    (with Full Document enabled for Insert, Update, and Replace operations):
    const fullDocument = changeEvent.fullDocument;

    const updateDescription = changeEvent.updateDescription;

    See which fields were changed (if any):
    if (updateDescription) {
      const updatedFields = updateDescription.updatedFields; // A document containing updated fields
    }

    See which fields were removed (if any):
    if (updateDescription) {
      const removedFields = updateDescription.removedFields; // An array of removed fields
    }

    Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.

    Access a mongodb service:
    const collection = context.services.get(<SERVICE_NAME>).db("db_name").collection("coll_name");
    const doc = collection.findOne({ name: "mongodb" });

    Note: In Atlas Triggers, the service name is defaulted to the cluster name.

    Call other named functions if they are defined in your application:
    const result = context.functions.execute("function_name", arg1, arg2);

    Access the default http client and execute a GET request:
    const response = context.http.get({ url: <URL> })

    Learn more about http client here: https://www.mongodb.com/docs/atlas/app-services/functions/context/#std-label-context-http
  */
};
```

---

## 4. Trigger 和 hook 的实现原理

> MongoDB 的本地钩子和云端触发器在实现原理上有一些区别。

### 4.1 本地 hook 的实现原理

> 本地钩子是通过在应用程序代码中定义的回调函数实现的,实现原理主要涉及以下步骤：

- 在应用程序中注册钩子函数，指定在特定事件发生前或后要执行的逻辑。
- 当数据库操作发生时，应用程序将调用相应的钩子函数，执行预定义的逻辑。
- 钩子函数的执行是在应用程序的进程内部进行的，不涉及网络通信。

### 4.2 云端触发器的实现原理

> 云端触发器是通过 MongoDB Realm 或其他类似的服务器端框架来实现的。触发器在 MongoDB 服务器上定义和执行，它们与特定集合相关联，并在满足触发条件时执行钩子逻辑。云端触发器的实现原理主要涉及以下步骤：

- 在 MongoDB Realm 或其他服务器端框架中定义触发器，并指定触发器要监听的集合和触发条件。
- 当满足触发条件时，服务器会触发相应的触发器。
- 触发器内部包含了预定义的钩子逻辑，根据定义的逻辑执行一系列操作。
- 云端触发器的执行发生在服务器端，可以涉及与数据库的交互和其他网络通信。

::: warning
👀 本地钩子是在应用程序代码中定义和执行的，而云端触发器是在服务器端定义和执行的。

- 本地钩子直接与数据库操作在应用程序进程内部交互
- 而云端触发器通过服务器端框架与 MongoDB 服务器进行交互。
  :::

---

## 5. Hook 实战应用

### ⚠️ 友（免）情（责）提示

::: warning
👀 在 Mongoose 中，在 hook（钩子）中加入业务逻辑代码不是绝对的危险，但是需要小心使用，因为不当使用可能会导致一些问题和不良影响。
Hooks 是在数据库操作（例如保存文档、更新文档、删除文档等）前后触发的函数，允许您在进行数据库操作之前或之后执行一些自定义逻辑。当合理使用时，hooks 可以帮助您在不修改数据库操作的情况下，增加或修改数据、执行验证、处理复杂的业务逻辑等。
:::

::: danger
以下是在 hooks 中加入业务逻辑时应考虑的一些潜在风险：

1. 性能问题：如果 hook 中的业务逻辑很复杂或需要大量计算，可能会导致数据库操作变慢，从而影响整体性能。
2. 死循环：在 hook 中执行数据库操作（例如保存文档）可能导致无限循环，从而引发栈溢出或其他问题。
3. 异常处理：如果在 hook 中没有适当处理异常，可能会导致未捕获的错误，使应用程序崩溃或出现未知行为。
4. 钩子嵌套：当使用多个钩子时，可能会发生嵌套调用的情况，这可能导致难以预测的结果
   :::

---

### 实战 1 删除文档的同时，删除已上传的附件

> 1. Apk 是 mongoose 定义的 schema
> 2. 文件提前会上传到 config.uploads.path 对应的文件下
> 3. 单元测试中（process.env.NODE_ENV === 'test'），不会执行对应内容

```js
// 删除room时，如果img有内容，需要删除对应的文件
apkSchema.pre('deleteOne', async function (next) {
  if (process.env.NODE_ENV !== 'test') {
    const original = await Apk.findOne({ _id: this._conditions._id });
    if (original.fileName) {
      const url = config.uploads.path + original.fileName;
      const fileStat = await fs.promises.stat(url);
      if (!!fileStat) {
        await fs.promises.unlink(url);
      }
    }
  }
  next();
});
```

> 👀 以上代码，实现了删除 APK 时，会顺带删除已上传的附件 📎

### 实战 2 更新 Booking，同步发送 mqtt 通知

::: tip
👀 此处将 mqtt 通知写入 hook，因为预订有任何数据改动，都需要及时通知信息屏刷新预订情况
如果不写入 hook 中，会在项目的各处重复插入此段代码，降低代码的可读性和扩展性
:::

```js
// 预订、更新的错误抛出不能在这里，mqtt通知可以
bookingSchema.pre('updateOne', async function (next) {
  if (process.env.NODE_ENV !== 'test') {
    const booking = await Booking.findOne({ _id: this._conditions._id });
    const devices = await Device.find({ room: booking.room }); // 获取会议室下的所有设备
    // 发送mqtt消息，通知设备刷新会议
    devices.forEach((device) => {
      mqttService.publishRefreshBooking(device.code);
    });
  }
  next();
});
```

### 实战 3 创建预订时，检查数据是否符合预期

> ⬇️ bookingErrors 是 自定义的 ServiceError，包含 code 和 message

```js
{
  code: 20007;
  data: null;
  msg: '会议时间冲突';
}
```

```js
// 创建对象时，自动寻找租户
bookingSchema.pre('save', async function (next) {
  if (!this.tenant) {
    const tenant = await Tenant.findOne({});
    this.tenant = tenant._id;
  }

  let now = moment().unix();
  if (!this.beginAt) this.beginAt = now;
  if (!this.planBeginAt) this.planBeginAt = this.beginAt;
  if (!this.planEndAt) this.planEndAt = this.endAt;
  if (this.beginAt < now) bookingErrors.beginAtLessThanNow().throw();

  // 与 全局配置相关 的判断
  const config = await Config.findOne();
  if (this.beginAt > this.endAt) bookingErrors.beginAtGreaterThanEndAt().throw(); // 开始时间大于结束时间
  if (config.maxBookingDay && this.endAt - this.beginAt > config.maxBookingDay * 24 * 60 * 60)
    bookingErrors.bookingDayGreaterThanMaxBookingDay().fill({ X: config.maxBookingDay }).throw(); // 会议时长大于最大预约时长

  // 判断是否存在对应的会议室和创建人
  const room = await Room.findOne({ _id: this.room });
  const creator = await User.findOne({ _id: this.creator });

  if (!room) bookingErrors.roomNotFound().throw();
  if (room.state === 'disable') bookingErrors.roomDisabled().throw();
  if (!creator) bookingErrors.userNotFound().throw();

  const validBookings = await Booking.find({
    room: this.room,
    endAt: { $gte: this.beginAt - config.preTime * 60 },
    beginAt: { $lte: this.endAt + config.preTime * 60 },
    state: { $in: ['success', 'start'] },
  });

  if (validBookings.length) bookingErrors.bookingConflict().throw();

  if (process.env.NODE_ENV !== 'test') {
    const devices = await Device.find({ room: this.room }); // 获取会议室下的所有设备
    // 发送mqtt消息，通知设备刷新会议
    devices.forEach((device) => {
      mqttService.publishRefreshBooking(device.code);
    });
  }

  next();
});
```

::: details 上述代码，通过调用 save hook，实现了以下需求：

1. 填充租户 id
2. 不能创建当前时间之前的会议
3. 开始时间不能超过结束时间
4. 预订时长不能超过全局配置中设置的最大预订时间
5. 判断会议室是否存在
6. 判断创建者是否存在
7. 判断是否有会议时间冲突
8. 同步发送 mqtt 通知
   :::

::: tip
✅ 尽量不要在 hook 中重复触发数据库操作，而是在 hook 中做一些简单的验证或数据修改。对于复杂的业务逻辑，最好将其放在其他模块或服务中，并从 hook 中调用这些模块。
同时，编写完善的测试也是非常重要的，以确保在添加 hook 逻辑时不会引入潜在的问题。
测试可以帮助您验证钩子的行为是否符合预期，并且在进行更改时可以提供更大的信心。
:::

总之，使用 hooks 来加入业务逻辑是一种常见的做法，但需要谨慎使用，以避免潜在的问题。
遵循最佳实践，并进行充分的测试是确保安全性和稳定性的关键。

## 6. 总结

MongoDB Hook 是 MongoDB 数据库提供的一种扩展功能，它可以在数据库操作前后执行额外的代码或操作。
通过使用 MongoDB Hook，您可以为数据库操作添加自定义逻辑，提高应用程序的灵活性和可扩展性。
MongoDB Hook 可以应用于 CRUD 操作的全过程，如查询、插入、更新和删除等。

MongoDB Atlas 是 MongoDB 公司提供的云数据库服务。它是基于云平台的全托管数据库服务
MongoDB Atlas 简化了在云中管理 MongoDB 数据库的过程，为您的数据存储和管理需求提供可扩展且安全的解决方案

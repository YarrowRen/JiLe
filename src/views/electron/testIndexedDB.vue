<template>
  <div class="scroll-y">
    <div class="mb-2">IndexDbDemo.vue</div>
    <el-button @click="addData()">增加数据</el-button>

    <el-button @click="updateData()">编辑数据</el-button>

    <el-button @click="deleteData()">删除数据</el-button>

    <el-button @click="readAll()">遍历数据</el-button>

    <el-button @click="readData()">查找数据</el-button>
  </div>
</template>

<script>
//参考自：http://www.ruanyifeng.com/blog/2018/07/indexeddb.html

import { reactive, toRefs } from 'vue'

let db

export default {
  name: 'Test2',
  data() {
    return {
      name: 'Ywrby',
      personData: '测试'
    }
  },

  created() {
    this.initDB()
  },
  methods: {
    initDB() {
      //使用 IndexedDB 的第一步是打开数据库，使用indexedDB.open()方法
      let request = window.indexedDB.open('test2-DB')
      //indexedDB.open()方法返回一个 IDBRequest 对象。
      //这个对象通过三种事件error、success、upgradeneeded，处理打开数据库的操作结果
      request.onerror = function (event) {
        console.log('数据库开启失败！')
      }

      request.onsuccess = function (event) {
        //成功开启数据库后，可以通过操作请求对象获取数据库对象
        db = request.result
        console.log('数据库开启成功！')
      }

      request.onupgradeneeded = function (event) {
        //如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件upgradeneeded
        //这时通过事件对象的target.result属性，拿到数据库实例
        db = event.target.result
        console.log('数据库升级成功！')
        let objectStore //每个数据库包含若干个对象仓库（object store）。它类似于关系型数据库的表格。
        //先判断一下，这张表格是否存在，如果不存在再新建
        if (!db.objectStoreNames.contains('person')) {
          //新建对象仓库
          objectStore = db.createObjectStore('person', { keyPath: 'id' })
          //新建对象仓库以后，下一步可以新建索引
          //IDBObject.createIndex()的三个参数分别为索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）。
          objectStore.createIndex('name', 'name', { unique: false })
          objectStore.createIndex('phone', 'phone', { unique: false })
          console.log('对象仓库创建成功！')
        }
      }
    },
    addData() {
      var request = db
        .transaction(['person'], 'readwrite')
        .objectStore('person')
        .add({ id: 1, name: '张三', age: 24, phone: '1832330XXXX' })

      request.onsuccess = function (event) {
        console.log('数据写入成功')
      }

      request.onerror = function (event) {
        console.log('数据写入失败')
      }
    },
    readData() {
      //读取数据也是通过事务完成。
      //objectStore.get()方法用于读取数据，参数是主键的值。
      var transaction = db.transaction(['person'])
      var objectStore = transaction.objectStore('person')
      var request = objectStore.get(1)

      request.onerror = function (event) {
        console.log('事务失败')
      }

      request.onsuccess = function (event) {
        if (request.result) {
          this.personData = request.result
          console.log('Name: ' + request.result.name)
          console.log('Age: ' + request.result.age)
          console.log('Phone: ' + request.result.phone)
        } else {
          this.personData = '未获得数据记录'
          console.log('未获得数据记录')
        }
      }
    },
    readAll() {
      var objectStore = db.transaction('person').objectStore('person')
      //遍历数据表格的所有记录，要使用指针对象 IDBCursor
      //新建指针对象的openCursor()方法是一个异步操作，所以要监听success事件
      objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result
        this.personData = cursor
        if (cursor) {
          console.log('Id: ' + cursor.key)
          console.log('Name: ' + cursor.value.name)
          console.log('Age: ' + cursor.value.age)
          console.log('Phone: ' + cursor.value.phone)
          cursor.continue()
        } else {
          console.log('没有更多数据了！')
        }
      }
    },
    updateData() {
      //更新数据要使用IDBObject.put()方法
      var request = db
        .transaction(['person'], 'readwrite')
        .objectStore('person')
        .put({ id: 1, name: '李四', age: 35, phone: '1370331XXXX' })

      request.onsuccess = function (event) {
        console.log('数据更新成功')
      }

      request.onerror = function (event) {
        console.log('数据更新失败')
      }
    },
    deleteData() {
      //IDBObjectStore.delete()方法用于删除记录
      var request = db.transaction(['person'], 'readwrite').objectStore('person').delete(1)

      request.onsuccess = function (event) {
        console.log('数据删除成功')
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>

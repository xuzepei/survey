<template>
    <div class="main_container">
        <div class="title-div" v-pre>1. 插值用法 {{}}</div>
        <hr>
        <h1>{{ msg }}</h1>

        <div class="title-div" v-pre>2. v-if 和 v-show</div>
        <hr>
        <p v-if="isShow">这是通过 v-if 显示的内容</p>
        <p v-show="isShow">这是通过 v-show 显示的内容</p>

        <div class="title-div" v-pre>3. v-bind 和 :</div>
        <hr>
        <img :src="adsImagePath" :width="width" height="100">
        <!-- <img src="@/assets/test.png" width="100" height="100"> -->

        <button :disabled="isBtnDisabled">Button</button>

        <div v-bind="objectOfAttrs">v-bind动态设置id和class</div>

        <p :class="isDynamicClass">这是个动态class</p>
        <p :class="className">通过指定className来设置css样式</p>
        <p :style="{ color: dynamicColor }">这是个动态style</p>
        <p :style="myDynamicStyle">这是另一个动态style</p>

        <div class="title-div" v-pre>4. v-for</div>
        <hr>
        <ul>
            <li v-for="item in items" :key="item.id">{{ item.name }}</li>
        </ul>
        <div :class="rowOrColumnClass">
            <span :class="rowOrColumnItemClass" v-for="(value, index) in items2" :key="index">{{ value }}</span>
        </div>
        <div class="v-for-buttons">
            <button @click="clickedReverseBtn">Reverse</button>
            <button @click="clickedSliceBtn">Slice</button>
            <button @click="clickedChangeBtn">{{ isChanged ? "a to i" : "i to a" }}</button>
            <button @click="clickedChangeRowOrColumnBtn">{{ rowOrColumnBtnName }}</button>
        </div>

        <div class="title-div" v-pre>5. v-on 和 @</div>
        <hr>
        <button @click="changeMsg">改变消息</button>
        <button @click="handleClick">点击我</button>

        <p>事件对象</p>
        <a @click="clickedToGo" href="http://www.baidu.com">阻止百度</a>
        <br>
        <a @click="clickedToGo2(2, $event)" href="http://www.baidu.com">阻止去百度</a>

        <div class="title-div" v-pre>6. 计算属性computed</div>
        <hr>
        <div>
            <p>原始消息: {{ msg }}</p>
            <p>反转消息: {{ reversedMessage }}</p>
            <p>问候语: {{ greeting }}</p>
        </div>

        <div class="title-div" v-pre>7. 监听器watch</div>
        <hr>
        <div>
            <p>你的问题: {{ question }}</p>
            <p>答案: {{ answer }}</p>
        </div>

        <div class="title-div" v-pre>8. v-text和v-html</div>
        <hr>
        <div>
            <p>Using text interpolation: {{ rawHtml }}</p>
            <p v-text="rawHtml"></p>
            <p v-html="rawHtml"></p>
        </div>
        <div class="title-div" v-pre>9. 事件修饰符</div>
        <hr>
        <div>
            <div @click="fatherClick">父节点
                <ul>
                    <li><button @click.stop="stopClick">.stop阻止事件冒泡,就不会触发fatherClick</button></li>
                    <li><a href="http://www.baidu.com" @click.prevent="stopClick">.prevent阻止默认行为</a></li>
                    <li><button @click.once="onceClick" @click.stop="">.once程序运行期间, 只触发一次事件处理函数</button></li>
                    <li>输入回车或ESC: <input type="text" @keydown.enter="enterFun" @keydown.esc="escFun" /></li>
                </ul>
            </div>
        </div>
        <div class="title-div" v-pre>10. v-model数据的双向绑定</div>
        <hr>
        <div>
            <span>用户名: </span>
            <input type="text" v-model="username" />
        </div>
        <div>
            <span>密码: </span>
            <input type="password" v-model="password" />
        </div>
        <div>
            <span>爱好: </span>
            <input type="checkbox" v-model="hobbies" value="workout" @change="handleCheckboxChange" />健身
            <input type="checkbox" v-model="hobbies" value="reading" @change="handleCheckboxChange" />看书
            <input type="checkbox" v-model="hobbies" value="game" @change="handleCheckboxChange" />游戏
        </div>
        <div>
            <span>性别: </span>
            <input type="radio" v-model="gender" value="male" @change="handleRadioChange"/>男
            <input type="radio" v-model="gender" value="female" @change="handleRadioChange"/>女
        </div>
        <div>
            <span>点赞数量: </span>
            <input type="text" v-model.number="praize" />{{ praize }}
        </div>
        <div>
            <span>评论: </span>
            <input type="text" v-model.trim="comment" />
        </div>

        <div>
            <span>回车后或失去焦点后处理输入:</span>
            <input type="text" placeholder="handle input text" v-model="comment" @keyup.enter="handleEnter"
                @blur="handleEnter" />
        </div>

        <div class="title-div" v-pre>11. 计算属性用法</div>
        <hr>
        <div>
            <span>全选：</span>
            <input type="checkbox" v-model="selectAll" />
            <ul>
                <li v-for="(val, index) in selectionArray" :key="index">
                    <input type="checkbox" v-model="val.selected" />
                    <span>{{ val.name }}</span>
                </li>
            </ul>
        </div>

        <div class="title-div" v-pre>12. v-if和v-else</div>
        <div v-if="isShow">如果isShow==true则显示这条</div>
        <div v-else>否则显示这条</div>
        <hr>

        <div class="title-div" v-pre>13. v-once</div>
        <div v-once>使用了v-once, 当msg变量改变时, 这里也不会变:{{ msg }}</div>
        <hr>
        <div class="title-div" v-pre>14. v-pre</div>
        <div v-pre>使用了v-pre, 原样输出不解析vue: {{ msg }}</div>
        <hr>
        <div class="title-div" v-pre>15. Attribute绑定</div>
        <div :title="msg">鼠标停留在我这里看看</div>
        <div :class="{ beRed: isRed }" @click="toggleRed">动态class, 点击后变红色。</div>
        <div :style="{ color: dynamicColor }" @click="toggleColor">动态style,点击后改变颜色</div>
        <hr>
        <div class="title-div" v-pre>16. 条件与循环</div>
        <button @click="show = !show">{{ show ? "Hide List" : "Show List" }}</button>
        <button @click="pushNumber">Push Number</button>
        <button @click="popNumber">Pop Number</button>
        <button @click="reverseList">Reverse List</button>
        <ul v-if="show && list.length">
            <li v-for="(value, index) in list" :key="index">{{ value }}</li>
        </ul>
        <div v-else-if="show === false">The list is hidden.</div>
        <div v-else-if="list.length == 0">The list is empty.</div>
        <hr>
        <div class="title-div" v-pre>17. &lt;template&gt; 上的v-if</div>
        <button @click="toggleShowTemplate"> {{ showTemplate ? "Hide" : "Show" }} the template below</button>
        <template v-if="showTemplate">
            <h3>Title</h3>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
        </template>
        <hr>
        <div class="title-div" v-pre>18. 表单绑定</div>
        <h3>Text Input</h3>
        <input v-model="text" placeholder="Edit me">
        <div>{{ text }}</div>
        <h3>Checkbox</h3>
        <input type="checkbox" v-model="checked">
        <label>Checked: {{ checked }}</label>
        <h3>Multi Checkbox</h3>
        <input type="checkbox" value="Jack" v-model="checkedNames">
        <label>Jack</label>
        <input type="checkbox" value="Lily" v-model="checkedNames">
        <label>Lily</label>
        <input type="checkbox" value="Lucy" v-model="checkedNames">
        <label>Lucy</label>
        <div>Checked names: {{ checkedNames }}</div>
        <h3>Radio</h3>
        <input type="radio" value="One" v-model="picked">
        <label>One</label>
        <input type="radio" value="Two" v-model="picked">
        <label>Two</label>
        <div>Picked: {{ picked }}</div>
        <h3>Select</h3>
        <select v-model="selected">
            <option disabled value="">Please select one</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
        </select>
        <div>Selected: {{ selected }}</div>
        <h3>Multi Select</h3>
        <select v-model="multiSelected" multiple style="width: 200px;">
            <option>A</option>
            <option>B</option>
            <option>C</option>
        </select>
        <div>Selected: {{ multiSelected }}</div>
        <hr>

        <div class="title-div" v-pre>20. v-for与对象</div>
        <ul>
            <li v-for="(value, key, index) in myObject" :key="index">
                {{ index }}. {{ handleKeyInVFor(key) }}: {{ value }}
            </li>
        </ul>
        <hr>


        <div class="title-div" v-pre>21. 列表渲染</div>
        <form @submit.prevent="addTodo">
            <input v-model="newTodo" required placeholder="New todo">
            <button>Add Todo</button>
        </form>
        <ul>
            <li v-for="todo in filteredTodos" :key="todo.id">
                <input type="checkbox" v-model="todo.done">
                <del v-if="todo.done">{{ todo.id }}. {{ todo.text }}</del>
                <span v-else>{{ todo.id }}. {{ todo.text }}</span>
                <button @click="removeTodo(todo)">X</button>
            </li>
        </ul>
        <button @click="clickedHideCompletedButton">{{ this.hideCompleted ? "Show all" : "Hide completed" }}</button>
        <hr>
        <div class="title-div" v-pre>22. 生命周期和模板引用</div>
        <p ref="pElementRef">hello</p>
        <div class="title-div" v-pre>23. 侦听器</div>
        <p>Todo id: {{ todoId }}</p>
        <button @click="todoId++" :disabled="!todoData">Fetch next todo</button>
        <p v-if="!todoData">Loading...</p>
        <pre v-else>{{ todoData }}</pre>
        <hr>
        <div class="title-div" v-pre>24. 子组件可以通过 props 从父组件接受动态数据</div>
        <div>{{ msgInProps || 'No props passed yet' }}</div>
        <div class="title-div" v-pre>25. 子组件可以通过 Emits 可以向父组件触发事件</div>
        <button @click="handleEmit">Emit event</button>
    </div>
</template>

<style>
.main_container {
    margin: 20px;
}

div {
    text-align: left;
}

.title-div {
    margin-top: 20px;
    font-family: Arial, sans-serif;
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    color: black;
}

/* ul {
    list-style-type: none;
    padding: 0px; 
} */

li {
    line-height: 2;
}

.green_class {
    color: green;
}

.v-for-row {
    display: flex;
    flex-direction: row;
}

.v-for-row-item {
    font-size: 32px;
    font-weight: bold;
    margin-left: 10px;
    /* 修改这里 */
    background-color: pink;
}

.v-for-column {
    display: flex;
    flex-direction: column;
}

.v-for-column-item {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 10px;
    /* 修改这里 */
    background-color: blue;
}


.v-for-buttons button {
    margin-right: 10px;
    margin-top: 10px;
}

#container {
    color: red;
}

.beRed {
    color: red;
}
</style>

<script>
import testImagePath from '@/assets/images/logo.png';

let todoIndex = 0;

export default {
    mounted() {
        console.log('MyHelloWorld has been mounted!');
        this.$refs.pElementRef.textContent = 'mounted! 666'
        this.fetchData()

    },
    created() {
        console.log('MyHelloWorld has been created!');

        // 带参数触发
        this.$emit('response', 'Hello from child')
    },
    props: {
        msgInProps: String
    },
    emits: ['response'],
    data() {
        return {
            msg: "Hello, Vue!",
            name: "Vue",
            isShow: true,
            adsImagePath: testImagePath, // '@/assets/ads.jpg',这样不行, 需要用import引入
            width: 50,
            items: [
                { id: 1, name: "item1" },
                { id: 2, name: "item2" },
                { id: 3, name: "item3" }],
            items2: ["c", "o", "d", "e", "i", "s", "w", "o", "r", "l", "d"],
            question: '',
            answer: 'I cannot give you an answer until you ask a question!',
            rawHtml: '<span style="color:red">This will replace the existing content.</span>',
            isBtnDisabled: true,
            objectOfAttrs: {
                id: 'container',
                class: 'wrapper'
            },
            isDynamicClass: {
                green_class: true //这里green_class是class为green_class的css, true表示这个css将生效
            },
            className: "beRed",
            rowOrColumnClass: "v-for-row",
            rowOrColumnItemClass: "v-for-row-item",
            rowOrColumnBtnName: "Column",
            dynamicColor: "orange",
            myDynamicStyle: { "font-size": "40px", "color": "purple", "text-align": "left" },
            username: "",
            password: "",
            hobbies: [],
            gender: "",
            praize: 0,
            comment: "",
            isSliced: false,
            isChanged: false,
            selectionArray: [{ name: "点赞", selected: false }, { name: "转发", selected: false }, { name: "收藏", selected: false }],
            isRed: false,
            show: true,
            list: [1, 2, 3],
            showTemplate: false,
            text: "",
            checked: false,
            checkedNames: ["Lily"],
            picked: "Two",
            selected: "B",
            multiSelected: [],
            myObject: {
                title: 'How to do lists in Vue',
                author: 'Jane Doe',
                publishedAt: '2016-04-10'
            },
            newTodo: '',
            todos: [
                { id: todoIndex++, text: 'Learn HTML', done: false },
                { id: todoIndex++, text: 'Learn JavaScript', done: false },
                { id: todoIndex++, text: 'Learn Vue', done: false }
            ],
            hideCompleted: false,
            todoId: 1,
            todoData: null,
            greetingMsg: '',
        };
    },
    computed: {
        reversedMessage() {
            return this.msg.split('').reverse().join('');
        },
        // greeting() {
        //     return `Hello, ${this.name}!`;
        // },
        greeting: {
            set(value) {
                console.log("greeting: " + this.value)
                this.greetingMsg = value
            },
            get() {
                return `${this.greetingMsg}!`;
            }
        },
        selectAll: {
            set(value) {
                console.log("selectAll.set:" + value)
                this.selectionArray.forEach(obj => { obj.selected = value });
            },
            get() {
                let selected = true
                let outsideVar = 0
                this.selectionArray.forEach((obj, index) => {
                    console.log(index + ". obj.selected is: " + obj.selected)
                    selected = (obj.selected === true);
                    if (obj.selected) {
                        outsideVar++;
                    }
                });

                console.log("selected: " + selected);
                console.log("outsideVar: " + outsideVar);
                return outsideVar >= 3
                //return this.selectionArray.every(obj => {obj.selected === true});
            }
        },
        filteredTodos() {
            return this.hideCompleted ? this.todos.filter(t => t.done == false) : this.todos;
        }
    },
    watch: {
        // 监听 question 属性
        question(newValue, oldValue) {
            console.log("question: newValue: " + newValue);
            console.log("question: oldValue: " + oldValue);

            this.answer = '...';
            this.getAnswer();
        },

        todoId(newValue) {
            console.log("todoId has changed to " + newValue);

            this.fetchData();
        }
    },
    methods: {

        //这里的this指向当前组件实例
        handleEmit() {
            console.log("handleEmit");
            this.$emit('response', 'Hello from child')
        },
        scrollToBottom() {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth' // 平滑滚动
            });
        },

        changeMsg() {
            this.msg = "Hello, World!";
            this.question = "Is this a question?"
            this.greetingMsg = "Hello, Vue.js";
        },


        handleClick() {
            alert('按钮被点击了');
            console.log(this.hobbies);
            console.log(this.gender);
        },

        getAnswer() {
            this.answer = 'Yes, it is and this is my answer.';
        },

        clickedToGo(e) {
            e.preventDefault();
        },

        clickedToGo2(id, e) {
            //console.log(id);
            //console.log(e);
            e.preventDefault();
        },

        fatherClick() {
            console.log("fatherClick");
        },

        stopClick(e) {
            console.log("stopClick");

            e.preventDefault();
        },

        onceClick() {
            console.log("onceClick");
        },

        enterFun() {
            console.log("enterFun");
        },

        escFun() {
            console.log("escFun");
        },

        clickedReverseBtn() {
            this.items2.reverse();
        },

        clickedSliceBtn() {
            if (this.isSliced == false) {
                let array = this.items2.slice(0, 4);
                this.items2 = array;
                this.isSliced = true
            } else {
                this.items2 = ["c", "o", "d", "e", "i", "s", "w", "o", "r", "l", "d"];
                this.isSliced = false
            }
        },

        clickedChangeBtn() {
            if (this.isChanged) {
                this.isChanged = !this.isChanged;
                this.items2[4] = "i"
            } else {
                this.isChanged = !this.isChanged;
                this.items2[4] = "a"
            }
        },

        clickedChangeRowOrColumnBtn() {
            if (this.rowOrColumnBtnName == "Column") {
                this.rowOrColumnClass = "v-for-column";
                this.rowOrColumnItemClass = "v-for-column-item";
                this.rowOrColumnBtnName = "Row";
            } else {
                this.rowOrColumnClass = "v-for-row";
                this.rowOrColumnItemClass = "v-for-row-item";
                this.rowOrColumnBtnName = "Column";
            }
        },

        handleCheckboxChange() {
            console.log("hobbies: " + this.hobbies);
        },
        
        handleRadioChange() {
            console.log("gender: " + this.gender);
        },

        handleEnter() {
            this.comment = this.comment.trim();
        },

        toggleRed() {
            this.isRed = !this.isRed;
        },

        toggleColor() {
            this.dynamicColor = this.dynamicColor === 'orange' ? 'blue' : 'orange';
        },

        popNumber() {
            this.list.pop();
        },

        pushNumber() {
            this.list.push(this.list.length + 1);
        },

        reverseList() {
            this.list.reverse();
        },

        toggleShowTemplate() {
            this.showTemplate = !this.showTemplate;

            //如果你在更新某个元素的内容后立即需要滚动到最底部，可以使用 Vue.nextTick 来确保 DOM 完成更新后再进行滚动操作：
            this.$nextTick(() => {
                this.scrollToBottom();
            });

        },

        handleKeyInVFor(key) {
            var str = String(key);
            if (str.length > 0) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }

            return str;
        },

        addTodo() {
            if (this.newTodo.length > 0) {
                if (this.todos.some(t => t.text === this.newTodo)) {
                    alert("Todo already exists!");
                    return;
                }
                
                todoIndex = this.todos.length
                this.todos.push({ id: todoIndex, text: this.newTodo })
            }
        },

        removeTodo(todo) {
            this.todos = this.todos.filter(t => t.id != todo.id)
        },

        clickedHideCompletedButton() {
            this.hideCompleted = !this.hideCompleted;
        },

        async fetchData() {
            this.todoData = null
            const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${this.todoId}`)
            this.todoData = await res.json()
        }
    }
};
</script>
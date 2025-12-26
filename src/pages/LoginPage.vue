<template>
    <PageLayout>
        <div class="page-container">
            <div class="login_box">
                <!-- 头像 -->
                <div class="avatar_box">
                    <img src="@/assets/images/logo2.png" alt="">
                </div>
                <h2 class="form-title">{{ $t('login.title') }}</h2>
                <!-- 登录表单 -->
                <el-form ref="loginFormRef" class="login_form" label-width="0px" :model="loginFormData"
                    :rules="loginFormRules">
                    <!-- 用户名 -->
                    <el-form-item prop="username">
                        <el-input v-model="loginFormData.username" prefix-icon="iconfont icon-user"
                            :placeholder="$t('login.username')"></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item prop="password">
                        <el-input v-model="loginFormData.password" prefix-icon="iconfont icon-password"
                            :placeholder="$t('login.password')" :type="showPassword ? 'text' : 'password'">
                            <!-- 尾部图标 -->
                            <template slot="suffix">
                                <img :src="showPassword ? require('@/assets/images/open-eye.png') : require('@/assets/images/close-eye.png')"
                                    @click="togglePassword" class="eye_password" />
                            </template>
                        </el-input>
                    </el-form-item>

                    <div class="login_form_bottom">
                        <!-- 按钮区 -->
                        <el-form-item class="buttons">
                            <el-button class="login_btn" type="primary" @click="login"
                                :loading="isRequesting">{{ $t('login.submit') }}</el-button>
                            <el-button @click="resetLoginForm">{{ $t('login.reset') }}</el-button>
                        </el-form-item>
                    </div>

                </el-form>
            </div>
        </div>
    </PageLayout>

</template>

<!-- lang="less"，支持less语法, 需要先安装, 命令 npm install less less-loader --save-dev -->
<!-- scoped 样式，只在当前组件中生效 -->
<style lang="less" scoped>
.page-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;

    /* ⭐ 新增 */
    justify-content: center;
    /* 垂直居中 */
    align-items: center;
    /* 水平居中 */
}

.login_box {
    position: relative;
    min-width: 360px;
    max-width: 400px;
    min-height: 280px;
    width: 30%;
    height: 30%;
    box-shadow: 0 0 20px var(--shadow-color);
    border-radius: 8px;
    background-color: white;
}

.avatar_box {
    width: 90px;
    height: 90px;
    border: 1px solid var(--border-color);
    border-radius: 50%;
    padding: 0px;
    box-shadow: 0 0 10px var(--shadow-color);
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;

    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: var(--border-color);
        //max-width: none; /* 取消默认 max-width */
    }
}

.form-title {
    text-align: start;
    margin-left: 20px;
    margin-top: 40px;
    margin-bottom: 20px;
    font-size: 28px;
    font-weight: bold;
}

.login_form {
    //background: #ff0000;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    //background: #fdd835;
}

.eye_password {
    //background: turquoise;
    margin: 6px;
    vertical-align: middle;
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.login_form_bottom {
    //margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: top;
}


.buttons {
    flex: 2;
    //gap: 20px;
    height: 100%; // 让按钮高度与select一致
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    //background: turquoise;
}
</style>

<script>
import PageLayout from '@/layouts/PageLayout.vue'
import md5 from 'blueimp-md5'
import Keys from '@/plugins/keys.js'

export default {
    components: {
        PageLayout,
    },
    mounted() {
        console.log('Login component has been mounted!');
    },
    data() {
        return {
            //登录表单数据绑定对象
            loginFormData: {
                username: "",
                password: "",
            },
            loginFormRules: {
                username: [
                    { required: true, message: 'This field is required.', trigger: 'blur' }, //trigger:blur(失去焦点), submit(点击submit) 
                ],
                password: [
                    { required: true, message: "This field is required.", trigger: 'blur' },
                ],
            },
            isRequesting: false,
            showPassword: false, // 是否显示密码
        }
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },

        resetLoginForm() {
            console.log("resetLoginForm");
            this.$refs.loginFormRef.resetFields();
        },
        
        async login() {
            // 防止重复点击
            if (this.$tool.isClickable() === false) {
                console.log("Not clickable!!!");
                return false;
            }

            this.$refs.loginFormRef.validate(async (valid) => {
                console.log("valid:" + valid);

                if (!valid) {
                    console.log("error submit!!");
                    return false;
                }

                if (this.isRequesting) {
                    console.log("Already requesting, please wait...");
                    return false;
                }

                this.isRequesting = true;

                try {

                    //console.log("md5:" + md5(this.loginFormData.password));

                    if (this.loginFormData.username === "Admin" && md5(this.loginFormData.password) === this.$tool.adminHash) {
                        this.isRequesting = false;

                        window.sessionStorage.setItem(Keys.is_login, true);

                        // const msg = "Login succeeded!";
                        // console.log(msg);
                        // this.$message.success(msg);

                        // setTimeout(() => {
                        //     this.$router.push("/clients");
                        // }, 2000)

                        this.$router.push("/clients");

                    } else {

                        this.isRequesting = false;
                        const msg = "Login failed!";
                        console.log(msg);
                        this.$message.error(msg);

                    }

                } catch (err) {
                    this.isRequesting = false;

                    console.error("Login failed: ", err.toString());
                }

                return true;
            });
        }
    }
}
</script>
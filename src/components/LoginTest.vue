<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="@/assets/images/logo.png">
            </div>
            <!-- 登录表单区域 -->
            <el-form label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-yonghu" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input type="password" prefix-icon="iconfont icon-mima" v-model="loginForm.password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="buttons">
                    <el-button type="info" @click="reset">重置</el-button>
                    <el-button type="primary" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang="less" scoped>
.login_container {
    height: 100%;
    background-color: #2b4b6b;

    display: -webkit-flex; /*Safari*/
    display: flex;
    flex-direction: row;
    /* 主轴方向上的对齐方式 */
    justify-content: center;
    /* 交叉轴方向上的对齐方式 */
    align-items: center;
}

.login_box {
    // display: flex;
    // justify-content: center;
    position: relative;
    width: 400px;
    height: 300px;
    background-color: white;
    box-shadow: 0px 0px 20px rgba(0, 0, 255, 255);
    border-radius: 8px;
}

.avatar_box {
    position: absolute;
    left: 50%;
    width: 100px;
    height: 100px;
    padding: 10px;
    border-radius: 50%;
    border: 1px solid #eee;
    background-color: #fff;
    transform: translate(-50%, -50%);
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
}

.login_form {
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding: 0px 20px;
    box-sizing: border-box;
}

.buttons {
    display: -webkit-flex;
    display: flex;
    justify-content: flex-end;
}

</style>

<script>
export default {
    data() { 
        return {
            loginForm: {
                username: '',
                password: '',
            },
            loginFormRules: {
                // 验证用户名是否合法
                username: [
                    { required: true, message: "请输入用户名", trigger:"blur" },
                    { min: 3, max: 10, message: "长度在3～10个字符", trigger: "blur"}
                ],
                // 验证密码是否合法
                password: [
                    { required: true, message: " 请输入密码", trigger: "change" },
                    { min: 6, max: 15, message: "长度在6～15个字符", trigger: "change" }
                ]
            },
        };
    },
    methods: { 
        reset() { 
            this.$refs.loginFormRef.resetFields();
        },

        login() { 

            if (this.$tool.isClickable() === false) {
                console.log("Not clickable!!!");
                return false;
            }

            this.$refs.loginFormRef.validate((valid) => {
                if (valid) {
                    alert("提交验证成功！");
                } else { 
                    alert("提交验证失败！");
                }

                //this.$refs.loginFormRef.clearValidate();
            });
        }
    }
};
</script>
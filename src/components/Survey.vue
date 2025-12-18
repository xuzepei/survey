<template>
    <div class="main_container">
        <div class="logo_group">
            <img src="@/assets/images/logo.png" />
        </div>
        
        <div class="title_card">
            <div class="card_content">
                <h2>Panda Scanner - Support Survey</h2>
                <p class="card_text">Dear Customer, thank you for your trust and support in our customer service over the past year! To better understand your service experience and help us improve our quality of service for the future, we invite you to participate in this survey. Your valuable feedback is extremely important to us.  </p>
            </div>
        </div>

        <!-- 登录表单 -->
        <el-form ref="formRef" class="survey_form" label-width="0px" :model="formData" :rules="formRules">
            <div class="email_card">
                <div class="card_content">
                    <div class="form_title required">Email</div>
                    <!-- Email -->
                    <el-form-item prop="email">
                        <el-input v-model="formData.email" prefix-icon="iconfont icon-yonghu"
                            placeholder="Your email"></el-input>
                    </el-form-item>
                </div>
            </div>


            <!-- 按钮区 -->
            <el-form-item class="buttons">
                <el-button class="submit_btn" type="primary" @click="submit" :loading="isRequesting">Submit</el-button>
            </el-form-item>
        </el-form>




    </div>
</template>

<style>
    
.main_container {
    margin: 0px;
    padding: 20px;
    background-color: var(--survey-bg-color);
}

div {
    text-align: left;
}

.logo_group {
    border: 1px solid var(--survey-border);
    border-radius: 8px;
}

.logo_group img {
    max-width: 100%;
    height: auto;
    border-radius: 8px; /* 圆角大小 */
    display: block;  /* 去掉 img 底部空隙 */
}

.title_card {
    margin-top: 20px;
    padding-top: 16px;
    border-radius: 8px;
    background-color: var(--card-head-color);
}

/* 白色内容卡片 */
.card_content {
    background-color: white;
    border-radius: 8px;
    padding: 16px;
}

.card_text {
    color: var(--card-text-color);
}

.email_card {
    margin-top: 20px;
    border-radius: 8px;
    background-color: var(--card-head-color);
}

.form_title {
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: normal;
    color: black;
    font-weight:500
}

.form_title.required::after {
    content: " *";
    color: red;
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

export default {
    mounted() {
        console.log('Survey has been mounted!');
    },
    created() {
        console.log('Survey has been created!');
    },

    data() {
        return {
            //登录表单数据绑定对象
            formData: {
                email: this.$tool.isDev() ? "" : "",
                password: this.$tool.isDev() ? "" : "",
            },
            formRules: {
                email: [
                    { required: true, message: 'This is a required item.', trigger: 'blur' }, //trigger:blur(失去焦点), submit(点击submit) 
                    { validator: this.validateEmail, trigger: 'submit' }
                ],
                password: [
                    { required: true, message: '请输入登录密码', trigger: 'change' },
                    { min: 6, max: 15, message: "长度在6到15个字符", trigger: 'change' },
                ],
            },
            regionOptions: [{ label: "Mainland China", value: "cn" }, { label: "Europe", value: "eu" }, { label: "India", value: "in" }, { label: "Global", value: "en" }],
            region: "",
            isRequesting: false,
            tokenInfo: null,
            requestingHostUrl: false, //是否正在请求HostUrl
            showPassword: false, // 是否显示密码
        }
    },
    methods: {
        validateEmail(rule, value, callback) {
            console.log("validateEmail: value:" + value);

            //判断是否为开发环境
            if (this.$tool.isDev()) {
                callback();
            } else {
                if (!this.$regex.email.test(value)) {
                    callback(new Error('请输入有效的邮箱地址！'));
                } else {
                    callback();
                }
            }
        },

        async submit() {
            // 防止重复点击
            if (this.$tool.isClickable() === false) {
                console.log("Not clickable!!!");
                return false;
            }


            this.$refs.formRef.validate(async (valid) => {
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

                // try {
                //     // ✅ 使用 async/await 调用
                //     const tokenInfo = await loginToolShared.loginAsync(
                //         this.loginFormData.username,
                //         this.loginFormData.password,
                //         null,
                //         1
                //     );

                //     this.isRequesting = false;

                //     this.tokenInfo = tokenInfo;
                //     userShared.saveLoginInfo(tokenInfo);

                //     const msg = "Login succeeded!";
                //     console.log(msg);
                //     this.$message.success(msg);

                //     this.$router.push("/");
                // } catch (err) {
                //     this.isRequesting = false;

                //     const error = Errors.getLoginError(err?.code || err);
                //     console.error("Login failed: ", error);
                //     this.$message.error("Login failed: " + error);
                // }

                return true;
            });
        }
        
    }
};
</script>
<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像 -->
            <div class="avatar_box">
                <img src="@/assets/images/logo.png" alt="">
            </div>
            <!-- 登录表单 -->
            <el-form ref="loginFormRef" class="login_form" label-width="0px" :model="loginFormData"
                :rules="loginFormRules">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginFormData.username" prefix-icon="iconfont icon-yonghu"
                        placeholder="请输入用户名"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginFormData.password" prefix-icon="iconfont icon-mima" placeholder="请输入密码"
                        :type="showPassword ? 'text' : 'password'">
                        <!-- 尾部图标 -->
                        <template slot="suffix">
                            <img :src="showPassword ? require('@/assets/images/open-eye.png') : require('@/assets/images/close-eye.png')"
                                @click="togglePassword" class="eye_password" />
                        </template>
                    </el-input>
                </el-form-item>

                <div class="login_form_bottom">
                    <!-- 区域选择 -->
                    <el-select v-model="region" placeholder="Select Region" class="select_area" @change="onRegionChange"
                        :disabled="requestingHostUrl || isRequesting">
                        <el-option v-for="item in regionOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>

                    <!-- 按钮区 -->
                    <el-form-item class="buttons">
                        <el-button class="login_btn" type="primary" @click="login"
                            :loading="isRequesting">登录</el-button>
                        <el-button @click="resetLoginForm">重置</el-button>
                    </el-form-item>
                </div>

                <!-- 使用自定义指令v-popover -->
                <!-- <div class="select_tip" v-popover:selectTipPopover>
                    <img src="@/assets/tip2.png" alt="tip image">
                    <span>How to select?</span>
                </div> -->

                <!-- selectTipPopover 本体 -->
                <!-- <el-popover ref="selectTipPopover" placement="bottom" width="300" trigger="click">
                    <p class="tip-content">
                        <i class="el-icon-info tip-icon"></i>
                        为了遵守适用于欧洲地区的严格数据保护和隐私法规，如果您当前位于该地区，请选择「欧洲」。
                    </p>
                </el-popover> -->

                <!-- 使用 slot="reference" 的具名插槽 -->
                <el-popover placement="bottom" width="300" trigger="click">
                    <p class="tip-content">
                        <i class="el-icon-info tip-icon"></i>
                        为了遵守适用于欧洲地区的严格数据保护和隐私法规，如果您当前位于该地区，请选择「欧洲」。
                    </p>
                    <div class="select_tip" slot="reference">
                        <img src="@/assets/images/tip2.png" alt="tip image">
                        <span>How to select?</span>
                    </div>
                </el-popover>

            </el-form>
        </div>
    </div>
</template>

<!-- lang="less"，支持less语法, 需要先安装, 命令 npm install less less-loader --save-dev -->
<!-- scoped 样式，只在当前组件中生效 -->
<style lang="less" scoped>
.login_container {
    width: 100%;
    height: 100%;
    background-color: var(--login-bg-color);

    display: flex;
    flex-direction: row;
    /* 主轴方向上的对齐方式 */
    justify-content: center;
    /* 交叉轴方向上的对齐方式 */
    align-items: center;

}

.login_box {
    //margin: 10px;
    position: relative;
    width: 460px;
    height: 320px;
    box-shadow: 0 0 20px var(--shadow-color);
    border-radius: 8px;
    background-color: white;
}

.avatar_box {
    width: 120px;
    height: 120px;
    border: 1px solid var(--border-color);
    border-radius: 50%;
    padding: 10px;
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

.select_area {
    flex: 3;
    height: 44px; // 让select高度与按钮一致
    max-width: 200px;
}

// 选中状态颜色
.el-select-dropdown__item.selected {
    background-color: #fdd835 !important;
    color: #000 !important;
}

// hover状态颜色
.el-select-dropdown__item:hover {
    background-color: #fff9c4 !important;
    color: #000 !important;
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

.select_tip {
    //background: #f00;
    display: inline-flex; // inline-flex 让宽度包裹内容
    margin-top: 0px;
    margin-bottom: 20px;
    flex-direction: row;
    align-items: center;
    cursor: pointer;


    img {
        width: 24px;
        height: 24px;
    }

    span {
        margin-left: 6px;
        font-size: 14px;
        color: var(--system-blue);
        text-decoration: underline;
    }
}

.tip-content {
    display: flex;
    align-items: top;
    line-height: 1.4;
}

/* 图标样式 */
.tip-icon {
    font-size: 20px;
    color: var(--tip-blue);
    margin-right: 6px;
}
</style>

<!-- 非 scoped 的样式，全局生效 -->
<style lang="less">
.icon-yonghu {
    margin-left: 3px;
}

.icon-mima {
    margin-left: 3px;
}
</style>

<script>

import { loginToolShared } from "@/plugins/LoginTool.js";
import Errors from "@/plugins/Errors.js";
import { urlConfigShared } from '@/plugins/UrlConfig.js';
import { userShared } from '@/plugins/User.js';
import Keys from '@/plugins/keys.js';
import Tool from '@/plugins/tool.js';

export default {
    mounted() {
        console.log('Login component has been mounted!');

        //初始化区域选择
        this.region = userShared.getRegion();
        if (this.region) {
            this.onRegionChange(this.region);
        }
    },
    data() {
        return {
            //登录表单数据绑定对象
            loginFormData: {
                username: this.$tool.isDev() ? "" : "",
                password: this.$tool.isDev() ? "" : "",
            },
            loginFormRules: {
                username: [
                    { required: true, message: '请输入登录用户名', trigger: 'blur' }, //trigger:blur(失去焦点), submit(点击submit) 
                    { min: 3, max: 255, message: "长度在3到255个字符", trigger: 'blur' },
                    { validator: this.validateUsername, trigger: 'submit' }
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


        togglePassword() {
            this.showPassword = !this.showPassword;
        },

        validateUsername(rule, value, callback) {
            console.log("validateUsername: value:" + value);

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

        resetLoginForm() {
            console.log("resetLoginForm");
            this.$refs.loginFormRef.resetFields();
        },

        async onRegionChange(value) {
            console.log("Selected region: " + value);

            //更新全局的用户区域
            userShared.saveRegion(value);

            this.requestingHostUrl = true;
            //根据选择的区域，更新API请求的HostUrl
            try {
                await urlConfigShared.fetchAPIHostUrl(this.$http);
            } finally {
                this.requestingHostUrl = false;
            }

        },

        // login() {

        //     const onSuccess = (tokenInfo) => {

        //         this.isRequesting = false;

        //         this.tokenInfo = tokenInfo;
        //         userShared.saveLoginInfo(tokenInfo)
        //         const accessToken = localStorage.getItem(Keys.access_token)
        //         console.log("AccessToken: " + accessToken);

        //         const msg = "Login succeeded!";
        //         console.log(msg);
        //         this.$message.success(msg);
        //         this.$router.push("/");
        //     };

        //     const onError = (errorCode) => {

        //         this.isRequesting = false;

        //         const error = Errors.getLoginError(errorCode);
        //         console.error("Login failed: ", error);
        //         this.$message.error("Login failed: " + error);
        //     };

        //     //防止重复点击
        //     if (this.$tool.isClickable() === false) {
        //         console.log("Not clickable!!!");
        //         return false;
        //     }

        //     //等待请求HostUrl完成
        //     if (this.requestingHostUrl) {
        //         this.$message.warning('Still requesting host URL, please wait a moment!');
        //         return;
        //     }

        //     //检查是否选择了区域
        //     if (!this.region) {
        //         this.$message.warning('Please select an operational region first!')
        //         return
        //     }

        //     this.$refs.loginFormRef.validate((valid) => {
        //         console.log("valid:" + valid);

        //         if (valid) {

        //             if (this.isRequesting) {
        //                 console.log("Already requesting, please wait...");
        //                 return false;
        //             }

        //             this.isRequesting = true;

        //             loginToolShared.login(
        //                 this.loginFormData.username,
        //                 this.loginFormData.password,
        //                 null,
        //                 1,
        //                 onSuccess,
        //                 onError,
        //             )

        //             return true;
        //         } else {
        //             console.log("error submit!!");
        //             return false;
        //         }
        //     });
        // },

        async login() {
            // 防止重复点击
            if (this.$tool.isClickable() === false) {
                console.log("Not clickable!!!");
                return false;
            }

            // 等待请求HostUrl完成
            if (this.requestingHostUrl) {
                this.$message.warning('Still requesting host URL, please wait a moment!');
                return;
            }

            // 检查是否选择了区域
            if (!this.region) {
                this.$message.warning('Please select an operational region first!')
                return;
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
                    // ✅ 使用 async/await 调用
                    const tokenInfo = await loginToolShared.loginAsync(
                        this.loginFormData.username,
                        this.loginFormData.password,
                        null,
                        1
                    );

                    this.isRequesting = false;

                    this.tokenInfo = tokenInfo;
                    userShared.saveLoginInfo(tokenInfo);

                    const msg = "Login succeeded!";
                    console.log(msg);
                    this.$message.success(msg);

                    this.$router.push("/");
                } catch (err) {
                    this.isRequesting = false;

                    const error = Errors.getLoginError(err?.code || err);
                    console.error("Login failed: ", error);
                    this.$message.error("Login failed: " + error);
                }

                return true;
            });
        }
    }
}
</script>
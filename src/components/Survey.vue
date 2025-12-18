<template>
    <div class="main_container">
        <div class="logo_group">
            <img src="@/assets/images/logo.png" />
        </div>

        <div class="title_card">
            <div class="card_content">
                <h2>Panda Scanner - Support Survey</h2>
                <p class="card_text">Dear Customer, thank you for your trust and support in our customer service over
                    the past year! To better understand your service experience and help us improve our quality of
                    service for the future, we invite you to participate in this survey. Your valuable feedback is
                    extremely important to us. </p>
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

            <div class="country_card">
                <div class="card_content">
                    <div class="form_title required">Country or Region</div>
                    <!-- Country -->
                    <el-select v-model="formData.country" filterable allow-create placeholder="Select country or region"
                        :disabled="isRequesting" class="select_area">
                        <el-option v-for="item in countries" :key="item.code" :label="item.name" :value="item.name">
                            <div class="multi-line-option">
                                {{ item.name }}
                            </div>
                        </el-option>
                    </el-select>

                    <!-- <div class="map_area">
                        <iframe class="map_iframe" src="https://www.google.com/maps?q=world&z=1&output=embed"
                            loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div> -->

                    <div class="map_area">
                        <div ref="map" class="leaflet_map"></div>
                    </div>

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
    border-radius: 8px;
    /* 圆角大小 */
    display: block;
    /* 去掉 img 底部空隙 */
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

.email_card,
.country_card {
    margin-top: 20px;
    border-radius: 8px;
    background-color: var(--card-head-color);
}

.form_title {
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: normal;
    color: black;
    font-weight: 500
}

.form_title.required::after {
    content: " *";
    color: red;
}

.select_area {
    flex: 3;
    height: 44px;
    width: 100%;
}

/* 针对下拉列表项的样式调整 */
.multi-line-option {
    white-space: normal;
    /* 允许换行 */
    word-break: break-word;
    /* 防止长单词溢出 */
    line-height: 2;
    /* 调整行高，增加可读性 */
    padding: 8px;
    /* 上下留白 */
}

.map_area {
    margin-top: 16px;
    width: 100%;
    height: 320px;
    /* 可调 */
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--survey-border);
}

.leaflet_map {
    width: 100%;
    height: 100%;
}

/* 修复 Leaflet icon 路径问题 */
.leaflet-container {
    font-family: inherit;
}
</style>

<script>
import { getNames, getCode } from 'country-list'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function normalizeCountryName(name) {
  return name.replace(/\s*\(the\)$/i, '')
}


export default {
    mounted() {
        console.log('Survey has been mounted!');
        this.initMap();
    },
    created() {
        console.log('Survey has been created!');
    },

    data() {
        return {
            //登录表单数据绑定对象
            formData: {
                email: this.$tool.isDev() ? "" : "",
                country: this.$tool.isDev() ? "" : "",
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
            map: null,
            countries: getNames().map(name => {
                console.log('country name:', name)

                return {
                    name: normalizeCountryName(name),
                    code: getCode(name)
                }
            })
        }
    },
    methods: {

        initMap() {
            this.map = L.map(this.$refs.map, {
                center: [20, 0], // 🌍 世界中心
                zoom: 2,
                minZoom: 1,
                zoomControl: true,
                scrollWheelZoom: false
            })

            // 🌍 世界地图（OpenStreetMap）
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; OpenStreetMap'
            }).addTo(this.map)
        },

        // ✅ 新增：国家定位
        locateCountry(countryName) {
            if (!countryName || !this.map) return

            fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(countryName)}&limit=1`
            )
                .then(res => res.json())
                .then(data => {
                    if (!data || !data.length) {
                        console.warn('No location found for:', countryName)
                        return
                    }

                    const { lat, lon } = data[0]

                    this.map.setView([Number(lat), Number(lon)], 5)
                })
                .catch(err => {
                    console.error('Locate country failed:', err)
                })
        },

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

    },
    watch: {
        'formData.country'(country) {
            if (country && this.map) {
                this.locateCountry(country)
            }
        }
    }
};
</script>
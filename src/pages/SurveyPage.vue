<template>
    <PageLayout>
        <MobilePageContainer>
            <div class="logo_group">
                <img src="@/assets/images/logo.png" />
            </div>

            <div class="title_card">
                <div class="card_content">
                    <h2>Panda Scanner - Support Survey</h2>
                    <p class="card_text">
                        Thank you for your interest in Panda Scanner. To ensure that you receive timely and accurate
                        support, please select your country or region so that we can assign the appropriate sales
                        representative to assist you.
                        <br><br>
                        Your information will be used solely for support and service coordination purposes.
                    </p>
                </div>
            </div>

            <!-- Form -->
            <el-form ref="formRef" class="survey_form" label-width="0px" :model="formData" :rules="formRules">

                <div class="name_card">
                    <div class="card_content">
                        <div class="form_title required">Name</div>
                        <el-form-item prop="name">
                            <el-input v-model.trim="formData.name" prefix-icon="iconfont icon-user"
                                placeholder="Your name" @keyup.enter.native="blurActiveElement"></el-input>
                        </el-form-item>
                    </div>
                </div>

                <div class="email_card">
                    <div class="card_content">
                        <div class="form_title required">Email</div>
                        <el-form-item prop="email">
                            <el-input v-model.trim="formData.email" prefix-icon="iconfont icon-email"
                                placeholder="Your email" @keyup.enter.native="blurActiveElement"></el-input>
                        </el-form-item>
                    </div>
                </div>

                <div class="whatsapp_card">
                    <div class="card_content">
                        <div class="form_title">WhatsApp Number</div>
                        <el-form-item prop="whatsapp">
                            <el-input v-model.trim="formData.whatsapp" prefix-icon="iconfont icon-whatsapp" placeholder="e.g. +1 234 567 8900"
                                @input="onWhatsappInput" @keyup.enter.native="blurActiveElement"></el-input>
                        </el-form-item>
                    </div>
                </div>
                
                <div class="occupation_card">
                    <div class="card_content">
                        <div class="form_title">Occupation</div>
                        <el-form-item prop="occupation">
                            <el-radio-group v-model="formData.occupation" class="occupation_group">
                                <el-radio v-for="item in occupationOptions" :key="item.value" :label="item.value"
                                    class="occupation_item">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                </div>

                <div class="country_card">
                    <div class="card_content">
                        <div class="form_title required">Country or Region</div>
                        <!-- Country -->
                        <el-form-item prop="countryCode">
                            <el-select v-model="formData.countryCode" filterable placeholder="Select country or region" no-match-text="No matching data"
                                :disabled="isRequesting" class="select_area" popper-class="survey_select" @change="onCountryChange" @visible-change="onCountryDropdown">

                                <i slot="prefix" class="iconfont icon-country"></i>

                                <el-option v-for="item in countries" :key="item.code" :label="item.name"
                                    :value="item.code">
                                        {{ item.name }}
                                </el-option>
                            </el-select>
                        </el-form-item>


                        <!-- <div class="map_area">
                        <iframe class="map_iframe" src="https://www.google.com/maps?q=world&z=1&output=embed"
                            loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div> -->

                        <div class="map_area">
                            <div ref="map" class="leaflet_map"></div>
                        </div>

                    </div>
                </div>

                <!-- Sales Card（独立卡片） -->
                <div v-if="formData.countryCode" class="sales_contact_card">
                    <div class="card_content">
                        <div class="sales_header">
                            <div v-if="currentSales.length" class="sales_title">
                                Your Regional Sales Contact
                            </div>
                            <div v-else class="sales_title required">
                                Add Sales Contact
                            </div>
                            <div class="sales_subtitle">
                                {{ currentSales.length
                                    ? 'Our local sales representative will assist you with product inquiries and
                                cooperation.'
                                : 'No sales contact is assigned to this region yet. Please ask on-site staff to assist
                                    in adding sales contact information.'
                                }}
                            </div>
                        </div>

                        <div v-if="currentSales.length" class="sales_card_wrapper">
                            <div class="sales_area">
                                <div v-for="sale in currentSales" :key="sale.email" class="sales_card">
                                    <img :src="sale.photo" class="sales_avatar" />

                                    <div class="sales_info">
                                        <div class="sales_name">{{ sale.name }}</div>
                                        <div class="sales_region">{{ sale.region }}</div>

                                        <a :href="`https://wa.me/${sale.whatsapp.replace(/\D/g, '')}`" target="_blank"
                                            class="sales_link whatsapp">
                                            <span class="label">WhatsApp:</span>
                                            <span class="value">{{ sale.whatsapp }}</span>
                                        </a>

                                        <a :href="`mailto:${sale.email}`" class="sales_link email">
                                            <span class="label">Email:</span>
                                            <span class="value">{{ sale.email }}</span>
                                        </a>

                                        <!-- 编辑按钮 -->
                                        <el-button class="edit_btn" type="text" @click="openEditDialog(sale)">
                                            <i class="el-icon-edit"></i>
                                        </el-button>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 没有销售人员（空态） -->
                        <div v-else class="sales_empty">
                            <el-button type="primary" class="add_btn" @click="openAddDialog">
                                Add
                            </el-button>

                            <!-- <el-button type="primary" size="medium" icon="el-icon-plus" circle @click="openAddDialog"></el-button> -->
                        </div>
                    </div>

                </div>

                <!-- 按钮区 -->
                <div class="button_area">
                    <el-form-item style="display: flex; justify-content: center;">
                        <el-button class="submit_btn" type="primary" @click="submit"
                            :loading="isRequesting">Submit</el-button>
                    </el-form-item>
                </div>

            </el-form>


            <el-dialog :visible.sync="editDialogVisible" :title="editDialogTitle" width="100%" class="edit-dialog"
                :close-on-click-modal="false" :append-to-body="true">
                <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="90px">
                    <el-form-item label="Name" prop="name">
                        <el-input v-model.trim="editForm.name" />
                    </el-form-item>

                    <el-form-item label="WhatsApp">
                        <el-input v-model.trim="editForm.whatsapp" />
                    </el-form-item>

                    <el-form-item label="Email" prop="email">
                        <el-input v-model.trim="editForm.email" />
                    </el-form-item>
                </el-form>

                <!-- Vue 2 写法的 footer slot -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="saveEdit">Save</el-button>
                </span>
            </el-dialog>
        </MobilePageContainer>
    </PageLayout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout.vue'
import MobilePageContainer from '@/layouts/MobilePageContainer.vue'

import { getNames, getCode } from 'country-list'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import salesData from '@/data/sales.json'
import defaultPhoto from '@/assets/sales/default.png'
import Occupation from '@/plugins/occupation.js'
import { urlConfigShared } from '@/plugins/UrlConfig.js';

function normalizeCountryName(name) {
    return name.replace(/\s*\(the\)$/i, '')
}

export default {
    components: {
        PageLayout,
        MobilePageContainer
    },
    mounted() {
        console.log('Survey has been mounted!');
        this.initMap();
    },

    created() {
        console.log('Survey has been created!');

        this.salesList = salesData.map(item => {
            let photo

            try {
                photo = require(`@/assets/sales/${item.photo}`)
            } catch (e) {
                console.warn('Missing photo:', item.photo)
                photo = defaultPhoto
            }

            return {
                ...item,
                photo
            }
        })
    },

    data() {
        return {
            salesList: [],
            occupationOptions: [
                { label: Occupation.DENTIST, value: Occupation.DENTIST },
                { label: Occupation.DISTRIBUTOR, value: Occupation.DISTRIBUTOR },
                { label: Occupation.DENTAL_LAB, value: Occupation.DENTAL_LAB },
                { label: Occupation.KOL, value: Occupation.KOL },
                { label: Occupation.OTHER, value: Occupation.OTHER }
            ],
            //登录表单数据绑定对象
            formData: {
                name: "",
                email: "",
                whatsapp: "",
                countryName: "",
                countryCode: "",
                occupation: Occupation.UNKNOWN
            },
            formRules: {
                name: [
                    { required: true, message: 'Please enter your name.', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: 'Please enter your email address.', trigger: 'blur' },
                    { type: 'email', message: 'Please enter a valid email address.', trigger: 'blur' }
                ],
                countryCode: [
                    { required: true, message: 'Please select your country or region.', trigger: 'change' },
                ],
            },
            regionOptions: [{ label: "Mainland China", value: "cn" }, { label: "Europe", value: "eu" }, { label: "India", value: "in" }, { label: "Global", value: "en" }],
            region: "",
            isRequesting: false,
            tokenInfo: null,
            requestingHostUrl: false, //是否正在请求HostUrl
            map: null,
            countries: getNames().map(name => {
                //console.log('country name:', name)
                return {
                    name: normalizeCountryName(name),
                    code: getCode(name)
                }
            }),
            editDialogVisible: false,
            editForm: {
                name: '',
                whatsapp: '',
                email: ''
            },
            editFormRules: {
                name: [
                    { required: true, message: 'Name is required', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: 'Email is required', trigger: 'blur' },
                    {
                        type: 'email',
                        message: 'Please enter a valid email address',
                        trigger: ['blur']
                    }
                ]
            },
            editingSale: null, // 用于记录当前编辑的销售
            salesRefreshKey: 0,
            localAddedSales: []
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
            //主要以当地语言显示的地图
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; OpenStreetMap'
            }).addTo(this.map)

            
            //主要以英文显示的地图
            // L.tileLayer(
            //     'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            //     {
            //         attribution: '&copy; OpenStreetMap & CartoDB'
            //     }
            // ).addTo(this.map)

            
        },

        // ✅ 新增：国家定位
        locateCountry(countryName) {
            if (!countryName || !this.map) return

            fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(countryName)}&limit=1&accept-language=en`
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

        openEditDialog(sale) {

            console.log('Opening edit dialog for sale:', sale);

            this.editingSale = sale;
            this.editForm = { ...sale };
            this.editDialogVisible = true;

            this.clearEditFormValidate()
        },

        saveEdit() {

            this.$refs.editFormRef.validate(valid => {
                if (!valid) {
                    return
                }

                if (!this.editingSale) {
                    // ✅ 新增销售 → 加入 localAddedSales
                    this.localAddedSales.push({
                        ...this.editForm,
                        region: "Custom",
                        photo: defaultPhoto // 使用默认照片
                    })

                    this.editDialogVisible = false

                    console.log('Added:', this.localAddedSales);

                    return;
                }

                if (this.editingSale.name !== this.editForm.name ||
                    this.editingSale.whatsapp !== this.editForm.whatsapp ||
                    this.editingSale.email !== this.editForm.email) {
                    this.editingSale.region = "Custom";
                    this.editingSale.photo = defaultPhoto; // 使用默认照片
                }

                // 更新原销售对象
                this.editingSale.name = this.editForm.name;
                this.editingSale.whatsapp = this.editForm.whatsapp;
                this.editingSale.email = this.editForm.email;

                this.editDialogVisible = false;

                // 可以在这里调用 API 保存修改
                console.log('Edited:', this.editingSale);
            });


        },

        openAddDialog() {

            this.editingSale = null

            this.editForm = {
                name: '',
                region: '',
                whatsapp: '',
                email: '',
                photo: ''
            }
            this.editDialogVisible = true

            this.clearEditFormValidate()
        },

        onCountryDropdown(visible) {
            // 只在“关闭下拉框”时刷新
            if (!visible) {
                this.salesRefreshKey++
                console.log('Force refresh sales cards')
            }
        },

        clearEditFormValidate() {
            this.$nextTick(() => {
                this.$refs.editFormRef?.clearValidate()
            })
        },

        onWhatsappInput(val) {
            // 只允许：数字、+、空格、-、()
            const cleaned = val.replace(/[^\d+\-()\s]/g, '')
            this.formData.whatsapp = cleaned
        },

        async submit() {
            // 防止重复点击
            if (this.$tool.isClickable() === false) {
                console.log("Not clickable!!!");
                return false;
            }

            if (this.isRequesting) {
                console.log("Already requesting, please wait...");
                return false;
            }

            this.$refs.formRef.validate(async (valid) => {
                console.log("valid:" + valid);

                if (!valid) {
                    console.log("error submit!!");

                    //显示校验失败的表单项
                    this.$nextTick(() => {
                        this.scrollToFirstError()
                    })

                    return false;
                }

                this.isRequesting = true;

                try {

                    console.log("Submitting survey data:", this.formData);

                    const result = await this.postFormData(this.formData);
                    this.isRequesting = false;

                    if (!result) {
                        const msg = "Submit failed!";
                        console.log(msg);
                        this.$message.error(msg);
                        return;
                    }

                    localStorage.setItem('survey_submitted', 'true')
                    localStorage.setItem('survey_email', this.formData.email)

                    const msg = "Submit succeeded!";
                    console.log(msg);
                    this.$message.success(msg);

                    // 提交成功后，3秒后跳转到抽奖页面
                    setTimeout(() => {
                        this.$router.push({
                            path: '/lottery',
                            query: {
                            }
                        });
                    }, 3000);


                } catch (err) {
                    this.isRequesting = false;

                    const error = "";//Errors.getLoginError(err?.code || err);
                    console.error("Login failed: ", error);
                    this.$message.error("Login failed: " + error);
                }

                return true;
            });
        },

        async postFormData(formData) {

            try {

                const uuid = this.$tool.surveyId //crypto.randomUUID()
                const urlString = urlConfigShared.surveySubmitUrl();
                console.log("Request: " + urlString);

                var custInfo = {};
                custInfo.name = formData.name;
                custInfo.email = formData.email;

                var answercontent = {};
                answercontent.whatsapp = formData.whatsapp;
                answercontent.countryName = formData.countryName;
                answercontent.countryCode = formData.countryCode;
                answercontent.occupation = formData.occupation;
                answercontent.salesContact = JSON.stringify(this.currentSales[0] || {});

                var dataBody = {}
                dataBody.questId = uuid;
                dataBody.name = "Exhibition 2026-1";
                dataBody.custInfo = JSON.stringify(custInfo);
                dataBody.answercontent = JSON.stringify(answercontent);

                console.log("POST: " + JSON.stringify(dataBody, null, 2));


                const response = await this.$http.post(encodeURI(urlString), dataBody);
                console.log("response.statue: " + response.status);
                console.log("Response: " + JSON.stringify(response.data, null, 2));
                if (
                    response.status === 200 &&
                    response.headers['content-type']?.includes('application/json') &&
                    response.data.success &&
                    response.data.data
                ) {
                    const dict = response.data.data;
                    return dict;
                }

                console.error(response.data.errorMessage);

            } catch (err) {
                console.error(err);
            }
        },

        scrollToFirstError() {
            const errorItem = this.$el.querySelector(
                '.el-form-item.is-error'
            )

            if (errorItem) {
                errorItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }
        },

        onCountryChange() {
            this.$refs.formRef.validateField('countryCode')
        },

        blurActiveElement() {
            const el = document.activeElement
            if (el && typeof el.blur === 'function') {
                el.blur()
            }
        }
    },
    watch: {
        'formData.countryCode'(countryCode) {
            if (!countryCode || !this.map) return

            const country = this.countries.find(
                c => c.code === countryCode
            )

            if (country) {
                this.formData.countryName = country.name

                this.localAddedSales = []
                this.locateCountry(country.name)
            }
        }
    },
    computed: {
        currentSales() {

            // 👇 强制让 computed 重新计算
            this.salesRefreshKey

            console.log('Filtering sales for country code:', this.formData.countryCode)

            if (!this.formData.countryCode) return [
                ...this.localAddedSales
            ]

            const originSales = this.salesList.filter(sale =>
                Array.isArray(sale.country_code) &&
                sale.country_code.includes(this.formData.countryCode)
            ).map(sale => ({
                    ...sale,
                }))


            // 如果没有匹配到任何销售，尝试添加一个 Global 销售联系人
            if (!originSales.length) {
                originSales.push(this.salesList.filter(sale =>
                    sale.region === "Global"
                ).map(sale => ({
                    ...sale,
                }))[0])
            }

            return [...originSales, ...this.localAddedSales]
        },

        editDialogTitle() {
            console.log('Determining edit dialog title. Editing sale:', this.editingSale);
            return this.editingSale
                ? 'Edit Sales Contact'
                : 'Add Sales Contact'
        }
    }
};
</script>

<style>

/* 禁止移动端输入框触发自动放大 */
.el-input__inner,
.el-textarea__inner {
    font-size: 16px !important;
}

/* 输入框图标和起始文字位置 */
.survey_form .el-input__prefix {
  left: 12px !important;
}
.survey_form .el-input__inner {
  padding-left: 44px !important;
}

/* 修改表单项底部间距 */
.survey_form .el-form-item {
  margin-bottom: 6px;
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

.name_card,
.email_card,
.country_card,
.sales_contact_card,
.whatsapp_card,
.occupation_card {
    margin-top: 20px;
    border-radius: 8px;
    background-color: var(--card-head-color);
}

.form_title {
    margin-bottom: 12px;
    font-size: 16px;
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

/* 选择下拉列表 */
.survey_select {
  width: auto !important;
  max-width: none !important;
  box-sizing: border-box;
}

.survey_select .el-select-dropdown__wrap {
  max-width: 100%;
}

.survey_select .el-select-dropdown__item {
  height: 44px;
  line-height: 44px;
  font-size: 14px;
}

.map_area {
    margin-top: 20px;
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

.sales_title {
    margin-bottom: 8px;
    font-size: 18px;
    font-weight: bold;
    color: black;
}

.sales_title.required::after {
    content: " *";
    color: red;
}

.sales_subtitle {
    margin-bottom: 18px;
    font-size: 14px;
    color: #6b7280;
}

/* 卡片区 */
.sales_area {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.sales_card {
    display: flex;
    align-items: center;
    padding: 16px;
    width: 100%;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
    position: relative;
}

.edit_btn {
    position: absolute;
    top: 8px;
    right: 8px;
    color: gray;
    /* 主色调 */
    font-size: 20px;
    /* 图标更大 */
    width: 36px;
    /* 按钮宽度 */
    height: 36px;
    /* 按钮高度 */
    border-radius: 50%;
    /* 圆形按钮 */
    display: flex;
    align-items: center;
    justify-content: center;
}

.edit_btn:hover {
    color: #2563eb;
}

/* 头像 */
.sales_avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 14px;
}

/* 信息 */
.sales_info {
    display: flex;
    flex-direction: column;
}

.sales_name {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
}

.sales_region {
    font-size: 14px;
    color: #374151;
    margin-bottom: 8px;
}

.sales_link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    text-decoration: none;
    line-height: 1.5;
    margin-top: 4px;
}

/* 标签 */
.sales_link .label {
    font-weight: 500;
    color: #6b7280;
    /* 中性灰 */
}

/* 值 */
.sales_link .value {
    font-weight: 600;
}

/* WhatsApp */
.sales_link.whatsapp .value {
    color: #16a34a;
    /* WhatsApp 绿 */
}

.sales_link.whatsapp:hover .value {
    text-decoration: underline;
}

/* Email */
.sales_link.email .value {
    color: #2563eb;
    /* 专业蓝 */
}

.sales_link.email:hover .value {
    text-decoration: underline;
}

.sales_empty {
  text-align: center;
  padding: 32px 16px;
}

.add_btn {
  min-width: 100px;
}

.edit-dialog .el-dialog {
    margin: 0 auto;
    max-width: 400px;
}

/* 小屏幕时，保证左右至少 20px */
@media (max-width: 400px) {
  .edit-dialog .el-dialog {
    width: calc(100% - 40px) !important;
  }
}

.button_area {
    margin-top: 100px;
}

.el-button.submit_btn {
    font-size: 20px;
    font-weight: 600;
    width: 300px;
}

/* radio单选项设置 */
.occupation_group.el-radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;   /* 👈 现在生效了 */
}

.occupation_item {
  width: 100%;
  margin: 0 !important;
  display: flex !important;
  align-items: center;
}

/* radio圆点 */
.occupation_item .el-radio__input {
  margin-right: 12px;
}

/* 文字 & 卡片区域 */
.occupation_item .el-radio__label {
  flex: 1;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-sizing: border-box;
  transition: all 0.2s ease;
  font-size: 14px;
}

/* hover */
.occupation_item:hover .el-radio__label {
  border-color: #409eff;
}

/* 选中态 */
.occupation_item.is-checked .el-radio__label {
  border-color: #409eff;
  background: #ecf5ff;
  color: #409eff;
}

/* 1. 去掉 ElementUI radio 点击灰色背景 */
.el-radio__input.is-checked + .el-radio__label,
.el-radio__input + .el-radio__label:hover {
  background: transparent !important;
}

/* 2. 去掉 :active 时的灰色闪烁 */
.el-radio,
.el-radio:active,
.el-radio:focus,
.el-radio:focus-visible {
  background: transparent !important;
  outline: none !important;
}

/* 3. 去掉浏览器点击时的蓝色高亮 */
* {
  -webkit-tap-highlight-color: transparent;
}

</style>
<template>
    <div class="main_container">
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
            <div class="email_card">
                <div class="card_content">
                    <div class="form_title required">Email</div>
                    <!-- Email -->
                    <el-form-item prop="email">
                        <el-input v-model="formData.email" prefix-icon="iconfont icon-yonghu"
                            placeholder="Your email" @keyup.enter.native="blurActiveElement"></el-input>
                    </el-form-item>
                </div>
            </div>

            <div class="country_card">
                <div class="card_content">
                    <div class="form_title required">Country or Region</div>
                    <!-- Country -->
                    <el-form-item prop="countryCode">
                        <el-select v-model="formData.countryCode" filterable placeholder="Select country or region"
                            :disabled="isRequesting" class="select_area" @visible-change="onCountryDropdown">
                            <el-option v-for="item in countries" :key="item.code" :label="item.name" :value="item.code">
                                <div class="multi-line-option">
                                    {{ item.name }}
                                </div>
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
                                ? 'Our local sales representative will assist you with product inquiries and cooperation.'
                                : 'No sales contact is assigned to this region yet. Please ask on-site staff to assist in adding sales contact information.'
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
                    <el-input v-model="editForm.name" />
                </el-form-item>

                <el-form-item label="WhatsApp">
                    <el-input v-model="editForm.whatsapp" />
                </el-form-item>

                <el-form-item label="Email" prop="email">
                    <el-input v-model="editForm.email" />
                </el-form-item>
            </el-form>

            <!-- Vue 2 写法的 footer slot -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="saveEdit">Save</el-button>
            </span>
        </el-dialog>


    </div>



</template>

<style>
.main_container {
    max-width: 600px;
    min-width: 300px;
    margin-left: auto;
    margin-right: auto;
    padding: 20px;
    background-color: var(--survey-bg-color);
    margin-top: 0px;

    min-height: 100vh;
}

/* 禁止移动端输入框触发自动放大 */
.el-input__inner,
.el-textarea__inner {
    font-size: 16px !important;
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
.country_card,
.sales_contact_card {
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
    width: 80px;
    height: 80px;
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
</style>

<script>
import { getNames, getCode } from 'country-list'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import salesData from '@/data/sales.json'
import defaultPhoto from '@/assets/sales/default.png'

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
            //登录表单数据绑定对象
            formData: {
                email: "",
                countryName: "",
                countryCode: "",
            },
            formRules: {
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
                console.log('country name:', name)

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
                    // ✅ 使用 async/await 调用
                    // const tokenInfo = await loginToolShared.loginAsync(
                    //     this.loginFormData.username,
                    //     this.loginFormData.password,
                    //     null,
                    //     1
                    // );



                    // 3 秒后跳转
                    setTimeout(() => {

                        this.isRequesting = false;

                        localStorage.setItem('survey_submitted', 'true')
                        localStorage.setItem('survey_email', this.formData.email)

                        const msg = "Submit succeeded!";
                        console.log(msg);
                        this.$message.success(msg);


                        setTimeout(() => {
                        this.$router.push({
                            path: '/lottery',
                            query: {
                            }
                        });
                    }, 3000);


                    }, 1000);



                } catch (err) {
                    this.isRequesting = false;

                    const error = "";//Errors.getLoginError(err?.code || err);
                    console.error("Login failed: ", error);
                    this.$message.error("Login failed: " + error);
                }

                return true;
            });
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
            )
                .map(sale => ({
                    ...sale,
                }))

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
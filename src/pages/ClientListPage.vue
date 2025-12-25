<template>
    <PageLayout>
        <div class="page-container">
            <h2 class="title">Client List</h2>
            <div class="table-wrapper">
                <el-table :data="clientList" 
                height="100%"
                :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
                stripe border v-loading="isRequesting" empty-text="No Data Available">
                    <el-table-column prop="date" label="Date" min-width="120" :resizable="true"/>
                    <el-table-column prop="name" label="Name" min-width="120" />
                    <el-table-column prop="email" label="Email" min-width="120" />
                    <el-table-column prop="whatsapp" label="WhatsApp" min-width="120" />
                    <el-table-column prop="occupation" label="Occupation" min-width="100" />
                    <el-table-column prop="countryName" label="Country" min-width="140" />
                    <el-table-column prop="salesContact" label="Sales Contact" min-width="200" />
                </el-table>
            </div>
        </div>
    </PageLayout>
</template>

<style scoped>

/* 固定表头高度 */
.table-wrapper :deep(.el-table__header th) {
    height: 40px;
    padding: 0;
}

/* 固定行高 */
.table-wrapper :deep(.el-table__row td) {
    height: 45px;
    padding: 0;
}

/* 确保单元格内的内容垂直居中且不换行（可选） */
.table-wrapper :deep(.el-table .cell) {
    line-height: 45px;
    /* 与 td 高度保持一致 */
    white-space: nowrap;
    /* 强制不换行，防止内容过多撑高行 */
    overflow: hidden;
    text-overflow: ellipsis;
    /* 超出部分显示省略号 */
}

.page-bg {
    background: white;
}

.page-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    /* 确保内容从左侧开始排列 */
    align-items: flex-start;
    width: 100%;
}

.title {
    font-size: 30px;
    font-weight: bold;
    margin-left: 20px;
}

.table-wrapper {
    flex: 1;
    min-height: 0;
    width: 100%;
    overflow-x: auto;
    /* 必须：允许横向滚动 */
    overflow-y: auto;
    /* 建议：允许纵向滚动 */
    position: relative;

    padding: 20px;
    padding-top: 0px;
}

.table-wrapper .el-table {
  height: 100%;
  /* 移除固定的 min-width，或者确保它与内层 table 一致 */
  min-width: 100%; 
}

/* 强制内部 table 容器至少 1000px，这会触发父级的 overflow-x: auto */
.table-wrapper :deep(.el-table__header),
.table-wrapper :deep(.el-table__body) {
  min-width: 1000px;
}

</style>

<script>
import PageLayout from '@/layouts/PageLayout.vue'
import { urlConfigShared } from '@/plugins/UrlConfig.js';

export default {
    components: {
        PageLayout,
    },
    mounted() {
    },

    created() {
        this.loadList();
    },

    data() {
        return {
            isRequesting: false,
            clientList: [],
        }
    },
    methods: {


        loadTestList() {
            const str = `{
	"success": true,
	"tags": {},
	"data": [{
		"id": "8f0b0d5a-7d2f-4b1e-9f8e-6c5f6a2a3c41",
		"name": "Exhibition 2026-1",
		"answer": {
			"whatsapp": "12312312313",
			"countryName": "United Arab Emirates",
			"countryCode": "AE",
			"occupation": "Dentist"
		},
		"info": {
			"name": "11313123",
			"email": "123131@qq.com"
		},
		"createTime": "2025/12/25 3:39:58 +00:00"
	}, {
		"id": "8f0b0d5a-7d2f-4b1e-9f8e-6c5f6a2a3c41",
		"name": "Exhibition 2026-1",
		"answer": {
			"whatsapp": "+8613982260658",
			"countryName": "China",
			"countryCode": "CN",
			"occupation": "KOL",
			"salesContact": ""
		},
		"info": {
			"name": "xuzepei",
			"email": "xuzepei@gmail.com"
		},
		"createTime": "2025/12/25 5:44:15 +00:00"
	}]
}`;
            
            const response = JSON.parse(str)
            console.log("Response: " + JSON.stringify(response.data));


            const array = response.data
                    this.clientList = [];

                    array.forEach(item => {

                        const info = item.info;
                        const answer = item.answer;
                        var salesContact = null;
                        if (answer.salesContact) {
                            salesContact = JSON.parse(answer.salesContact);
                        }

                        console.log("info: " + JSON.stringify(info));
                        console.log("info: " + info.name);
                        console.log("answer: " + JSON.stringify(answer));
                        console.log("salesContact: " + JSON.stringify(salesContact));

                        var dict = {};
                        dict.date = this.$tool.formatTime(item.createTime ) || "";
                        dict.name = info.name;
                        dict.email = info.email || "";
                        dict.whatsapp = answer.whatsapp || "";
                        dict.occupation = answer.occupation || "";
                        dict.countryName = answer.countryName || "";
                        dict.countryCode = answer.countryCode || "";

                        if (salesContact) {
                            dict.salesContact = salesContact.name + " | " + salesContact.email || "";
                        }

                        this.clientList.push(dict);
                    });
        },

        async loadList() {

            if (this.isRequesting) {
                console.log("Already requesting, please wait...");
                return;
            }

            this.isRequesting = true;

            const urlString = urlConfigShared.fetchClientsUrl() + "?questId=" + this.$tool.surveyId;
            console.log("Request: " + urlString);

            try {
                const response = await this.$http.get(encodeURI(urlString));
                console.log("response.statue: " + response.status);
                console.log("Response: " + JSON.stringify(response.data));

                if (
                    response.status === 200 &&
                    response.headers['content-type']?.includes('application/json') &&
                    response.data.success &&
                    response.data.data
                ) {
                    const array = response.data.data;
                    this.clientList = [];

                    array.forEach(item => {

                        const info = JSON.parse(item.info || "{}");
                        const answer = JSON.parse(item.answer || "{}");
                        var salesContact = null;
                        if (answer.salesContact) {
                            salesContact = JSON.parse(answer.salesContact);
                        }

                        // console.log("info: " + JSON.stringify(info));
                        // console.log("answer: " + JSON.stringify(answer));
                        // console.log("salesContact: " + JSON.stringify(salesContact));

                        var dict = {};
                        dict.date = this.$tool.formatTime(item.createTime ) || "";
                        dict.name = info.name || "";
                        dict.email = info.email || "";
                        dict.whatsapp = answer.whatsapp || "";
                        dict.occupation = answer.occupation || "";
                        dict.countryName = answer.countryName || "";
                        dict.countryCode = answer.countryCode || "";

                        if (salesContact) {
                            dict.salesContact = salesContact.name + " | " + salesContact.email || "";
                        }

                        this.clientList.push(dict);
                    });
                    
                } else {
                    const msg = "Load failed!";
                    console.log(msg);
                    this.$message.error(msg);
                }
            } catch (err) {
                console.error(err);
                this.$message.error("Load failed: " + err);
            } finally {
                this.isRequesting = false;
            }
        },
    },
    watch: {
    },
    computed: {
    }
};
</script>

